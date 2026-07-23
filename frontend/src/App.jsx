import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://127.0.0.1:8000";

function App() {
  const [documents, setDocuments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isAsking, setIsAsking] = useState(false);
  const [deletingFilename, setDeletingFilename] = useState("");

  async function fetchDocuments() {
    try {
      const response = await fetch(`${API_URL}/documents`);

      if (!response.ok) {
        throw new Error("Failed to load documents.");
      }

      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      setError(error.message);
    }
  }

  async function handleUpload(event) {
    event.preventDefault();

    if (!selectedFile) {
      setError("Please select a PDF file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setIsUploading(true);
      setError("");
      setMessage("");

      const response = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload the document.");
      }

      const data = await response.json();

      setMessage(
        `${data.filename} was uploaded and indexed into ${data.chunks_indexed} chunks.`
      );

      setSelectedDocument(data.filename);
      setSelectedFile(null);
      event.target.reset();

      await fetchDocuments();
    } catch (error) {
      setError(error.message);
    } finally {
      setIsUploading(false);
    }
  }

  async function handleAskQuestion(event) {
    event.preventDefault();

    if (!selectedDocument || !question.trim()) {
      setError("Select a document and enter a question.");
      return;
    }

    try {
      setIsAsking(true);
      setError("");
      setAnswer("");

      const response = await fetch(`${API_URL}/ask-document`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename: selectedDocument,
          question,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get an answer.");
      }

      const data = await response.json();
      setAnswer(data.answer);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsAsking(false);
    }
  }

async function handleDeleteDocument(filename){
    const shouldDelete = window.confirm(
       `Are you sure you want to delete "${filename}"?`
    );
    if(!shouldDelete){ return; }

    try{
        setDeletingFilename(filename);
        setError("");
        setMessage("");

        const response = await fetch(
      `${API_URL}/documents/${encodeURIComponent(filename)}`,
       {
        method: "DELETE",
       }
      );
      if (!response.ok){
        throw new Error("Failed to delete the document.");
      }

      if(selectedDocument === filename){
        setSelectedDocument("");
        setQuestion("");
        setAnswer("");
      }

     setMessage(`${filename} was deleted successfully.`);

     await fetchDocuments();
    }catch(error){
        setError(error.message);
    }finally {
        setDeletingFilename("");
    }
}

useEffect(() => {
  fetchDocuments();
}, []);

  return (
    <main className="app">
      <h1>AI Document Assistant</h1>
      <p>Upload documents and ask AI-powered questions.</p>

      <section>
        <h2>Upload a document</h2>

        <form onSubmit={handleUpload}>
          <input
            type="file"
            accept="application/pdf"
            onChange={(event) => setSelectedFile(event.target.files[0])}
          />

          <button type="submit" disabled={isUploading}>
            {isUploading ? "Uploading and indexing..." : "Upload PDF"}
          </button>
        </form>

        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
      </section>

      <section>
        <h2>Uploaded documents</h2>

        {documents.length === 0 ? (
          <p>No documents uploaded yet.</p>
        ) : (
          <ul className="document-list">
            {documents.map((document) => (
              <div className="document-item">
                  <button
                    className={
                      selectedDocument === document.filename
                        ? "document-button selected"
                        : "document-button"
                    }
                    onClick={() => {
                      setSelectedDocument(document.filename);
                      setAnswer("");
                    }}
                  >
                    {document.filename}
                  </button>

                  <button
                    className="delete-button"
                    onClick={() => handleDeleteDocument(document.filename)}
                    disabled={deletingFilename === document.filename}
                  >
                    {deletingFilename === document.filename ? "Deleting..." : "Delete"}
                  </button>
                </div>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Ask a document</h2>

        {selectedDocument ? (
          <>
            <p>
              Selected document: <strong>{selectedDocument}</strong>
            </p>

            <form onSubmit={handleAskQuestion}>
              <textarea
                placeholder="Ask a question about the selected document..."
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
              />

              <button type="submit" disabled={isAsking}>
                {isAsking ? "Generating answer..." : "Ask question"}
              </button>
            </form>
          </>
        ) : (
          <p>Select a document first.</p>
        )}

        {answer && (
          <div className="answer">
            <h3>AI Answer</h3>
            <p>{answer}</p>
          </div>
        )}
      </section>
    </main>
  );
}

export default App;