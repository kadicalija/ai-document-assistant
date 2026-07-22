from pathlib import Path
from fastapi import HTTPException
from pathlib import Path
from pypdf import PdfReader
from chunking import split_text_into_chunks
from embedding_service import (
    generate_document_embedding,
    generate_query_embedding,
)
from vector_store import (
    store_document_chunks,
    search_document_chunks,
    delete_document_chunks,
)

from llm import generate_llm_response

UPLOAD_FOLDER = Path("uploads")

def list_documents():

    documents = UPLOAD_FOLDER.glob("*.pdf")

    documents_list = []

    for document in documents:
        documents_list.append({
            "filename": document.name
        })

    return documents_list

def delete_document(filename:str):
    file_path = UPLOAD_FOLDER / filename

    if not file_path.exists():
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )
    delete_document_chunks(filename)
    file_path.unlink()

    return{
        "message": "Document deleted successfully"
    }

def extract_text(filename: str) -> str:
    file_path = UPLOAD_FOLDER / filename

    if not file_path.exists():
        raise FileNotFoundError("Document not found.")

    with open(file_path, "rb") as file:
        reader = PdfReader(file)
        pages = []

        for page in reader.pages:
            page_text = page.extract_text()

            if page_text:
                pages.append(page_text)

    return "\n".join(pages)

def get_document_chunks(filename: str) -> list[str]:
    document_text = extract_text(filename)

    return split_text_into_chunks(document_text)

def index_document(filename:str) -> dict:
    chunks = get_document_chunks(filename)

    embeddings = []

    for chunk in chunks:
        embedding = generate_document_embedding(chunk)
        embeddings.append(embedding)

    store_document_chunks(
        filename=filename,
        chunks=chunks,
        embeddings=embeddings,
    )

    return{
        "filename": filename,
        "chunks_indexed": len(chunks),
    }

def answer_question_about_document(
        filename: str,
        question: str,
) -> str:
    query_embedding = generate_query_embedding(question)

    relevant_chunks = search_document_chunks(
        filename=filename,
        query_embedding=query_embedding,
    )

    context= "\n\n".join(relevant_chunks)

    return generate_llm_response(
        message=question,
        context=context,
    )

