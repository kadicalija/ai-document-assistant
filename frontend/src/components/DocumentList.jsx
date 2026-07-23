function DocumentList({
  documents,
  selectedDocument,
  setSelectedDocument,
  deletingFilename,
  handleDeleteDocument,
  setMessages,
}) {
  return (
    <section>
      <h2>📄 Documents</h2>

      {documents.length === 0 ? (
        <p>No documents uploaded yet.</p>
      ) : (
        <ul className="document-list">
          {documents.map((document) => (
            <li key={document.filename} className="document-item">
              <button
                className={
                  selectedDocument === document.filename
                    ? "document-button selected"
                    : "document-button"
                }
                onClick={() => {
                  setSelectedDocument(document.filename);
                  setMessages([]);
                }}
              >
                {document.filename}
              </button>

              <button
                className="delete-button"
                onClick={() => handleDeleteDocument(document.filename)}
                disabled={deletingFilename === document.filename}
              >
                {deletingFilename === document.filename
                  ? "Deleting..."
                  : "Delete"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default DocumentList;