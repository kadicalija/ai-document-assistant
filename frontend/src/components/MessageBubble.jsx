function MessageBubble({ role, content }) {
  return (
    <div
      className={
        role === "user"
          ? "message user-message"
          : "message ai-message"
      }
    >
      <div className="message-avatar">
        {role === "user" ? "👤" : "🤖"}
      </div>

      <div className="message-content">
        {content}
      </div>
    </div>
  );
}

export default MessageBubble;