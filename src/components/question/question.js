import "./question.css";

export default function Question(props) {
  return (
    <div className="question">
      <span className="question-label">{props.category}</span>
      <h2 className="question-text">{`${props.i + 1}. ${props.question}`}</h2>
    </div>
  );
}
