import fileinput

from fastapi  import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel
from pathlib  import Path
import shutil
from document_service import list_documents

from llm import generate_llm_response

app = FastAPI()

UPLOAD_FOLDER = Path("uploads")
UPLOAD_FOLDER.mkdir(exist_ok=True)
class ChatRequest(BaseModel):
    message: str

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
    print(file_path)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {
        "message": "File uploaded successfully.",
        "filename": file.filename
    }

@app.get("/documents")
def get_documents():
    return list_documents()