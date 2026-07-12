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

