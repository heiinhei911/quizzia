import "./startScreen.css";

export default function StartScreen(props) {
  return (
    <div id="startscreen" style={{ alignSelf: "center", textAlign: "center" }}>
      <h1 className="start-screen-title">Quizzia</h1>
      <p className="start-screen-description">
        A trivia app testing your general knowledge! Have fun!
      </p>
      <div className="buttons" id="start" onClick={props.screen}>
        I'm Ready!
      </div>
      <div className="start-screen-credit">
        <p>
          powered by{" "}
          <a href="https://opentdb.com" target="_blank" rel="noreferrer">
            opentdb.com
          </a>
        </p>
        <p>created by Steve Sam</p>
      </div>
    </div>
  );
}
