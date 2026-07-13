from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel
from pathlib import Path
import shutil

from document_service import (
    list_documents,
    delete_document,
    extract_text,
)
from llm import generate_llm_response


app = FastAPI()

UPLOAD_FOLDER = Path("uploads")
UPLOAD_FOLDER.mkdir(exist_ok=True)


class ChatRequest(BaseModel):
    message: str


class AskDocumentRequest(BaseModel):
    filename: str
    question: str

@app.post("/chat")
def chat(request: ChatRequest):
    response = generate_llm_response(request.message)
    return{
        "response": response
    }

@app.post("/upload")
def upload_pdf(file: UploadFile = File(...)):

    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed."
        )

    file_path = UPLOAD_FOLDER / file.filename

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {
        "message": "File uploaded successfully.",
        "filename": file.filename
    }

@app.get("/documents")
def get_documents():
    return list_documents()

@app.delete("/documents/{filename}")
def delete_uploaded_document(filename: str):
    return delete_document(filename)

@app.post("/ask-document")
def ask_document(request: AskDocumentRequest):
    try:
        document_text = extract_text(request.filename)

        answer = generate_llm_response(
            message=request.question,
            context=document_text
        )

        return {
            "answer": answer
        }

    except FileNotFoundError:
        raise HTTPException(
            status_code=404,
            detail="Document not found."
        )