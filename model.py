import os
from google import genai
from dotenv import load_dotenv
from google import genai
from google.genai import types

# Automatically uses GEMINI_API_KEY from your environment
client = genai.Client()

load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
summary = ""
prompt="What is CSS?"
role="You are a helpful coding assistant."
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

print(summary)