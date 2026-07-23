function ChatPanel({
  selectedDocument,
  question,
  setQuestion,
  handleAskQuestion,
  isAsking,
}) {
  return (
    <section>
      <h2>💬 Ask AI</h2>

      {selectedDocument ? (
        <>
          <p className="selected-document">
            <strong>Selected document:</strong> {selectedDocument}
          </p>

          <form onSubmit={handleAskQuestion}>
            <textarea
              placeholder="Ask a question about your document..."
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
            />

            <button type="submit" disabled={isAsking}>
              {isAsking ? "Generating..." : "✨ Ask AI"}
            </button>
          </form>
        </>
      ) : (
        <p>Select a document first.</p>
      )}
    </section>
  );
}

export default ChatPanel;