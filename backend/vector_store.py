from pathlib import Path

import chromadb

BASE_DIR = Path(__file__).resolve().parent
CHROMA_DB_PATH = BASE_DIR / "chroma_db"

client = chromadb.PersistentClient(
    path = str(CHROMA_DB_PATH)
)

collection = client.get_or_create_collection(
    name = "document_chunks",
    embedding_function=None,
)

def store_document_chunks(
        filename: str,
        chunks: list[str],
        embeddings: list[list[float]],
) -> None:
    if len(chunks) != len(embeddings):
        raise ValueError(
            "The number of chunks and embeddings must match."
        )

    collection.delete(
        where={"filename": filename}
    )

    if not chunks:
        return

    ids = [
        f"{filename}_chunks_{index}"
        for index in range(len(chunks))
    ]

    metadatas = [
        {
            "filename": filename,
            "chunk_index": index,
        }
        for index in range(len(chunks))
    ]

    collection.add(
        ids=ids,
        documents=chunks,
        embeddings=embeddings,
        metadatas=metadatas,
    )

def search_document_chunks(
        filename: str,
        query_embedding: list[float],
        n_results: int = 3,
) -> list[str]:
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=n_results,
        where={"filename": filename},
        include=["documents", "distances"],
    )

    return results["documents"][0]

def delete_document_chunks(filename: str) -> None:
    collection.delete(
        where={"filename": filename}
    )