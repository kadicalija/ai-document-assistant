function MessageInput({
  question,
  setQuestion,
  handleAskQuestion,
  isAsking,
  selectedDocument,
}) {
  return (
    <form
      className="message-input"
      onSubmit={handleAskQuestion}
    >
      <textarea
        placeholder={
          selectedDocument
            ? "Ask something about the document..."
            : "Select a document first..."
        }
        value={question}
        disabled={!selectedDocument}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <button
        type="submit"
        disabled={!selectedDocument || isAsking}
      >
        {isAsking ? "Thinking..." : "Send"}
      </button>
    </form>
  );
}

export default MessageInput;