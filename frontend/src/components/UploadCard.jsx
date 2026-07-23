function UploadCard({
  setSelectedFile,
  handleUpload,
  isUploading,
  message,
  error,
}) {
  return (
    <section>
      <h2>📤 Upload Document</h2>

      <form onSubmit={handleUpload} className="upload-form">

        <label className="upload-area">

          <div className="upload-icon">📄</div>

          <h3>Choose a PDF document</h3>

          <p>
            Upload a PDF so the AI can search and answer questions about it.
          </p>

          <input
            type="file"
            accept="application/pdf"
            onChange={(event) => setSelectedFile(event.target.files[0])}
          />

        </label>

        <button type="submit" disabled={isUploading}>
          {isUploading ? "Uploading..." : "Upload PDF"}
        </button>

      </form>

      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
    </section>
  );
}

export default UploadCard;