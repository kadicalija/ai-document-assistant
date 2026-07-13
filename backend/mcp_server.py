from mcp.server.fastmcp import FastMCP
from document_service import(
    list_documents,
    extract_text,
    delete_document,
)

mcp = FastMCP("AI Document Assistant")

@mcp.tool()
def list_uploaded_documents():
    """
    Returns a list of all uploaded PDF documents.
    """
    return list_documents()

@mcp.tool()
def extract_document_text(filename: str):
    """
    Extracts and returns the text content of an uploaded PDF document.
    """
    return extract_text(filename)

@mcp.tool()
def delete_uploaded_document(filename: str):
    """
    Deletes an uploaded PDF file
    """
    return delete_document(filename)

if __name__ == "__main__":
    mcp.run()

