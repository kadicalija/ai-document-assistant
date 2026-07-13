from pathlib import Path
from fastapi import HTTPException
from pathlib import Path
from pypdf import PdfReader

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
    file_path.unlink()

    return{
        "message": "Document deleted successfully"
    }

def extract_text(filename: str)->str:
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