from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel
from pathlib import Path
import shutil
from fastapi.middleware.cors import CORSMiddleware


from document_service import (
    list_documents,
    delete_document,
    index_document,
    answer_question_about_document,
)
from llm import generate_llm_response


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

    index_result = index_document(file.filename)

    return {
        "message": "File uploaded and indexed successfully.",
        "filename": file.filename,
        "chunks_indexed": index_result["chunks_indexed"],
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

        answer = answer_question_about_document(
            filename=request.filename,
            question=request.question,
        )

        return {
            "answer": answer
        }

    except FileNotFoundError:
        raise HTTPException(
            status_code=404,
            detail="Document not found."
        )