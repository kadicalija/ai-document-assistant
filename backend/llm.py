from google import genai
from config import GEMINI_API_KEY, GEMINI_MODEL

client = genai.Client(api_key=GEMINI_API_KEY)


def generate_llm_response(message: str, context: str | None = None) -> str:
    if context:
        prompt = f"""
You are an AI assistant that answers questions based only on the provided document.

If the answer cannot be found in the document, clearly say that the information is not available in the document.
1
Document:
{context}

Question:
{message}
"""
    else:
        prompt = message

    response = client.models.generate_content(
        model=GEMINI_MODEL,
        contents=prompt,
    )

    return response.text