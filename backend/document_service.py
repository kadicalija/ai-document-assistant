from pathlib import Path
from fastapi import HTTPException
from pathlib import Path

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