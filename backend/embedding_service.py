from google import genai
from google.genai import types

from config import GEMINI_API_KEY, GEMINI_EMBEDDING_MODEL

client = genai.Client(api_key=GEMINI_API_KEY)

def generate_document_embedding(text: str) -> list[float]:
    response = client.models.embed_content(
        model = GEMINI_EMBEDDING_MODEL,
        contents = text,
        config=types.EmbedContentConfig(
            task_type = "RETRIEVAL_DOCUMENT"
        ),
    )

    return response.embeddings[0].values

def generate_query_embedding(text: str) -> list[float]:
    response = client.models.embed_content(
        model=GEMINI_EMBEDDING_MODEL,
        contents=text,
        config=types.EmbedContentConfig(
            task_type = "RETRIEVAL_QUERY"
        ),
    )

    return response.embeddings[0].values