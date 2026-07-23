import MessageBubble from "./MessageBubble";

function ChatWindow({ messages }) {
  return (
    <section className="chat-window">

      <h2>💬 Conversation</h2>

      <div className="messages">

        {messages.length === 0 ? (
          <MessageBubble
            role="assistant"
            content="Hello! Upload a document and ask me anything."
          />
        ) : (
          messages.map((message, index) => (
            <MessageBubble
              key={index}
              role={message.role}
              content={message.content}
            />
          ))
        )}

      </div>

    </section>
  );
}

export default ChatWindow;