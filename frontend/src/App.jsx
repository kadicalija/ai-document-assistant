import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import UploadCard from "./components/UploadCard";
import DocumentList from "./components/DocumentList";
import ChatWindow from "./components/ChatWindow";
import MessageInput from "./components/MessageInput";

const API_URL = "http://127.0.0.1:8000";

function App() {
  const [documents, setDocuments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState("");
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
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
      setMessages([]);
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

      const userQuestion = question;

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

        setMessages((prev) => [
          ...prev,
          {
            role: "user",
            content: question,
          },
          {
            role: "assistant",
            content: data.answer,
          },
        ]);

setQuestion("");
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
        setMessages([]);
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

  <Header />

  <div className="dashboard">

    <aside className="sidebar">

      <UploadCard
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        handleUpload={handleUpload}
        isUploading={isUploading}
        message={message}
        error={error}
      />

      <DocumentList
        documents={documents}
        selectedDocument={selectedDocument}
        setSelectedDocument={setSelectedDocument}
        deletingFilename={deletingFilename}
        handleDeleteDocument={handleDeleteDocument}
        setMessages={setMessages}
      />

    </aside>

    <section className="workspace">

      <ChatWindow
        messages={messages}
        />
        <MessageInput
          selectedDocument={selectedDocument}
          question={question}
          setQuestion={setQuestion}
          handleAskQuestion={handleAskQuestion}
          isAsking={isAsking}
        />


    </section>

  </div>

</main>
  );
}

export default App;