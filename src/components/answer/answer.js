import "./answer.css";

export default function Answer(props) {
  return (
    <div
      className="ans-option"
      onClick={props.click}
      style={
        props.checked && props.id === props.correct_answer
          ? {
              backgroundColor: "#2e8b57",
              border: "1px solid #2e8b57",
              color: "#f5f5f5",
              cursor: "default",
            }
          : props.checked && props.clicked && props.id !== props.correct_answer
          ? {
              backgroundColor: "#f08080",
              border: "1px solid #f08080",
              color: "#f5f5f5",
              opacity: "0.5",
              cursor: "default",
            }
          : props.checked && props.id !== props.correct_answer
          ? {
              border: "1px solid #d3d3d3",
              color: "#d3d3d3",
              cursor: "default",
            }
          : !props.checked && props.clicked
          ? {
              backgroundColor: "#d0d6f2",
              border: "1px solid #d0d6f2",
            }
          : {}
      }
    >
      {props.answer[1]}
    </div>
  );
}
