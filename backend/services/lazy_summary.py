import os
from dotenv import load_dotenv
from cerebras.cloud.sdk import Cerebras
from services.db_service import update_columns
from services.ai_service import call_cerebras_api

MAX_CHAR_LIMIT = 15000
HEAD_LINE_COUNT = 150
TAIL_LINE_COUNT = 50

def lazy_summarizer(content, path, repo_id, repo):
    if not content:
        raise ValueError("There is not content available to summarize.")
    
    # parsing the content
    result = parser(content)

    prompt = f"""
        Analyze the following source code file from the repository **{repo}** and generate a concise, structured breakdown.

        ### FILE PATH:
        `{path}`

        ### SOURCE CODE:
        `{result}`
        ---
        ### INSTRUCTIONS FOR SUMMARY:
        1. **Overview:** Write a focused 2-3 sentence overview explaining **what this specific file does**, its **primary role in the architecture**, and **why it exists**.
        2. **Key Capabilities & Logic:** List 3-5 bullet points covering the core functions, classes, components, or API interactions handled inside this file.
        3. **Dependencies & Exports:** Briefly highlight what key modules/libraries it imports and what primary items it exports or exposes for the rest of the project.

        ### FORMATTING CONSTRAINTS:
        - Use **bold text** (`**like this**`) for all critical function names, class names, key variables, imported libraries, and core architectural concepts so they pop out visually.
        - Use clear Markdown subheadings (`###`).
        - Do NOT include conversational intros (e.g., "Here is the summary..."). Start immediately with the `### Overview` heading.

        ### RULES:
        - Never return a single word like 'Overview' or 'Summary'.
        - Always return at least 2 full sentences.
        - If the file is small (like a CSS file), summarize what key styles or theme rules it defines.
        """.strip()

    role = (
        "You are an expert AI software architect. Your job is to analyze individual source code files "
        "using provided source code, file paths, and project context. "
        "Provide sharp, well-structured, technical summaries. Avoid generic conversational fluff."
    )

    summary = call_cerebras_api(prompt, role, content)
    if not summary: return "Unable to generate summary."
    
    # save the summary in db
    update_columns('files', 'summary', summary, repo_id, path)
    return summary

def parser(content):
    # based on size of the file there will be three possibilities
    if len(content) <= MAX_CHAR_LIMIT:
        return content 
    
    lines = content.splitlines()
    size = len(lines)

    if size <= (HEAD_LINE_COUNT + TAIL_LINE_COUNT):
        return content[:MAX_CHAR_LIMIT] + "\n\n... [TRUNCATED DUE TO EXTREME LINE LENGTH] ..."

    head = lines[:HEAD_LINE_COUNT]
    tail = lines[-TAIL_LINE_COUNT:]
    skipped = size - (HEAD_LINE_COUNT + TAIL_LINE_COUNT)

    truncated_notice = (
        f"\n\n... [MIDDLE TRUNCATED: {skipped} LINES OMITTED FOR BREVITY] ...\n\n"
    )

    formatted_code = '\n'.join(head) + truncated_notice + '\n'.join(tail)

    return formatted_code 