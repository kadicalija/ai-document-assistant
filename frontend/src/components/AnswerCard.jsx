function AnswerCard({ answer }) {
  if (!answer) {
    return null;
  }

  return (
    <section className="answer">
      <h2>🤖 AI Answer</h2>
      <p>{answer}</p>
    </section>
  );
}

export default AnswerCard;