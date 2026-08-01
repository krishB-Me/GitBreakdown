import os
from dotenv import load_dotenv
from cerebras.cloud.sdk import Cerebras
from services.github_fetcher import get_readme, get_manifest, get_meaningful_path
from services.db_service import update_columns
from google import genai
from google.genai import types

def summarize(description, tree_paths, branch, owner, repo):
    if not all([tree_paths, branch]):
        return "No tree or branch available."

    """
        We need the summary and for that we need data 
        data like the packages, requirements.txt, Readme, and any other resource 
        cause it's not good to analyze files and files or code 
        We are storing extensions and folders to skip files directly when creating the
        summary so that we don't bombard the API
    """
    
    # we need to get the Readme file first
    readme = get_readme(tree_paths, owner, repo, branch)

    # after hopefully getting the readme we need to get the manifest files
    manifest = get_manifest(tree_paths, owner, repo, branch)
    
    # the clean paths that are be sent with the cerebras API
    clean_paths = get_meaningful_path(tree_paths)

    # now we got all the stuff what remains is to call Cerebras API
    prompt = f"""
        Analyze the following repository and generate a structured, high-level summary.

        ### REPOSITORY:
        {repo}
        {f"Description: {description}" if description else ""}

        ### FILE STRUCTURE ({len(clean_paths)} main files):
        {chr(10).join(clean_paths[:150])}

        ### MANIFEST / DEPENDENCIES:
        {manifest if manifest else "No manifest found."}

        ### README CONTENT:
        {readme if readme else "No README found."}

        ---
        ### INSTRUCTIONS FOR SUMMARY:
        1. **Overview:** Write a comprehensive 2-paragraph overview. Paragraph 1 should explain **what the project does**, its **core value proposition**, and **who it is built for**. Paragraph 2 should explain **how it works under the hood** based on the file structure and codebase layout.
        2. **Tech Stack:** List primary languages, core frameworks, libraries, and tools.
        3. **Architecture & Project Layout:** Explain key directories/modules and how data or control flows through the app.
        4. **Key Features:** Highlight 3-5 major capabilities or standout features.

        ### FORMATTING CONSTRAINTS:
        - Use **bold text** (`**like this**`) for all critical concepts, core technologies, primary frameworks, key file paths, and standout features so they pop out visually.
        - Use clear Markdown headings (`###`) and bullet points.
        - Do NOT include conversational intros or soft openings (e.g., "Here is a summary..."). Start immediately with the Overview section.
        """.strip()
    role = ("You are an expert AI software architect. Your job is to analyze software repositories"
            "using provided file trees, README files, manifest files, and project metadata. "
            "Provide sharp, well-structured, technical summaries. Avoid generic conversational fluff.")
    summary = call_cerebras_api(prompt, role)   

    if not summary:
        return "Unable to generate summary."
    
    # saving the summary in the database
    update_columns("repositories", "overall_summary", summary, owner=owner, repo=repo)
    print(f"The summary is: {summary}")
    return summary


def call_cerebras_api(prompt, content, raw_code=None):
    load_dotenv()
    client = Cerebras(api_key=os.getenv("CEREBRAS_API_KEY"))
    summary = ""

    try:
        response = client.chat.completions.create(
            model="zai-glm-4.7",
            messages=[
                {
                    "role": "system",
                    "content": content
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
            temperature=0.2,
            max_tokens=1500,
        )
        summary = response.choices[0].message.content.strip()

    except Exception as cerebras_err:
        print(f"❌ Cerebras API Error: {cerebras_err}")
    
    # checking if the summary is good enough
    if checks(summary, raw_code):
        return summary
    else:
        return call_gemini_api(prompt, content, raw_code)
    
def call_gemini_api(prompt, role, raw_code=None):
    load_dotenv()
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
    summary = ""

    try:
        gemini_response = client.models.generate_content(
            model="gemini-3.5-flash-lite",  # Fast, highly reliable model
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=role,
                temperature=0.2
            )
        )
        summary = gemini_response.text.strip()
    except Exception as gemini_err:
        print(f"❌ Gemini Fallback Error: {gemini_err}")
    
    # checking if the summary is good enough
    if checks(summary, raw_code):
        return summary
    else:
        return "Unable to generate summary."
    
def checks(summary_clean, raw_code=None):
    # Check 1: Too short (fewer than 5 words)
    if len(summary_clean.split()) < 5:
        return False
        
    # Check 2: Known refusal phrases or error reflections
    refusal_keywords = [
        "cannot summarize", "i cannot", "error reading", 
        "no content provided", "invalid file", "as an ai"
    ]
    if any(keyword in summary_clean for keyword in refusal_keywords):
        return False

    # Check 3: Parroted raw code back instead of summarizing
    if raw_code:
        if summary_clean == raw_code.strip().lower():
            return False
    
    # check 4
    valid_endings = ('.', '!', '?', '`', '"', "'", ')')
    if not summary_clean.endswith(valid_endings):
        print(f"⚠️ Summary appears incomplete (missing terminal punctuation): '{summary_clean[-20:]}'")
        return False
    return True