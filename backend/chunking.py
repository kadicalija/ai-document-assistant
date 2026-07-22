def split_text_into_chunks(
        text: str,
        chunk_size: int = 1000,
        overlap: int = 200
) -> list[str]:
    if chunk_size <= 0:
        raise ValueError("chunk_size must be greater than 0.")

    if overlap < 0 or overlap >= chunk_size:
        raise ValueError(
            "overlap must be greater than 0"
            "and smaller than chunk size"
        )
    cleaned_text = text.strip()

    if not cleaned_text:
        return[]

    chunks = []
    start = 0

    while start < len(cleaned_text):
        end = start + chunk_size
        chunk = cleaned_text[start:end]

        chunks.append(chunk)

        start += chunk_size - overlap

    return chunks