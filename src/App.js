import "./App.css";
import StartScreen from "./components/startScreen/startScreen";
import Question from "./components/question/question";
import Answer from "./components/answer/answer";
import { useState, useEffect } from "react";
import { nanoid } from "nanoid";

function App() {
  // Set up intial constants and states
  const initialMessage = "Please answer all the questions above.";
  const [screen, setScreen] = useState(0); // start screen = 0, questions screen = 1
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(initialMessage);
  const [questions, setQuestions] = useState([]);
  const [checked, setChecked] = useState(false);
  const [result, setResult] = useState([]);

  // Flip between start screen and questions screen
  function updateScreen() {
    // start screen = 0, questions screen = 1
    setScreen((prevScreen) => (prevScreen === 0 ? 1 : 0));
  }

  // Reset game (fetech new questions from API)
  function updateQuestions() {
    setChecked(false);
    setMessage(initialMessage);
    updateScreen();
    setTimeout(() => updateScreen(), 1);
    window.scrollTo(0, 0);
  }

  // Iterate through the state "questions", find the option being clicked,
  // and update its isClicked property and display the changes on screen
  function updateClicked(quesID, ansID) {
    setQuestions((prevQues) =>
      prevQues.map((ques) => {
        for (let i = 0; i < ques.answers.length; i++) {
          if (ques.answers[i].ansID === ansID)
            return {
              ...ques,
              answers: ques.answers.map((ans) =>
                // If current ans is the answer that the user selected,
                // update its property isClicked (select or deselect)
                (ans.isClicked && ques.id === quesID) || ans.ansID === ansID
                  ? { ...ans, isClicked: !ans.isClicked }
                  : ans
              ),
            };
        }
        return ques;
      })
    );
  }

  // Check if all questions have been answered
  // If they have, check answers and display score
  // If they have not, display message to ask user to fill in all the questions
  function checkAnswers() {
    if (!checked) {
      if (result.every((ans) => ans !== null)) {
        setChecked(true);
        setMessage(
          `You scored ${
            result.filter((ans) => ans === true).length
          }/5 correct answers.`
        );
      } else {
        setMessage("You must answer all questions.");
      }
      window.scrollTo(0, document.body.scrollHeight);
    }
  }

  // Fetch data from trivia API, set up the state "questions", and
  // re(start) the game
  useEffect(() => {
    // An object that corresponds HTML entities with their regular symbols
    const htmlEntities = {
      "&amp;": "&",
      "&lt;": "<",
      "&gt;": ">",
      "&quot;": '"',
      "&apos;": "'",
      "&#039;": "'",
      "&Uuml;": "Ü",
      "&deg;": "°",
      "&copy;": "©",
    };

    // Replace HTML entities from the API with regular symbols and
    // trim any whitespace
    function fixEntities(data) {
      const htmlChar = /&\w+;|&#\d+;/gi;
      if (htmlChar.test(data)) {
        return data.replace(htmlChar, (match) => htmlEntities[match]).trim();
      }
      return data.trim();
    }

    // Create an array with numbers in a randomized order going from 0 up to
    // the length of its argument
    const shuffledArray = function createShuffledArray(num) {
      // num = biggest number in the array
      const array = [];
      for (let i = 0; i <= num; i++) {
        array.push(i);
      }
      return array.sort(() => Math.random() - 0.5);
    };

    // Set up question screen
    if (screen === 1) {
      // Emptying the state "question" to get rid of previous questions
      setQuestions([]);
      setLoading(true);
      // Fetch questions from API
      fetch("https://opentdb.com/api.php?amount=5")
        .then((response) => response.json())
        .then((data) =>
          data.results.map((result) => {
            const answersArray = [];
            const correct_answer_id = nanoid();
            setLoading(false);

            if (result.incorrect_answers.length === 1) {
              // True or false answers
              answersArray.push(
                {
                  ansID:
                    result.correct_answer === "True"
                      ? correct_answer_id
                      : nanoid(),
                  answer: fixEntities(
                    result.correct_answer === "True"
                      ? result.correct_answer
                      : result.incorrect_answers[0]
                  ),
                  isClicked: false,
                },
                {
                  ansID:
                    result.correct_answer === "False"
                      ? correct_answer_id
                      : nanoid(),
                  answer: fixEntities(
                    result.correct_answer === "False"
                      ? result.correct_answer
                      : result.incorrect_answers[0]
                  ),
                  isClicked: false,
                }
              );
            } // Regular answers
            // Pushing question pulled from API into the state "questions"
            // in a randomized order using shuffledArray
            else
              shuffledArray(3).forEach((n) => {
                if (n === result.incorrect_answers.length) {
                  answersArray.push({
                    ansID: correct_answer_id,
                    answer: fixEntities(result.correct_answer),
                    isClicked: false,
                  });
                } else {
                  answersArray.push({
                    ansID: nanoid(),
                    answer: fixEntities(result.incorrect_answers[n]),
                    isClicked: false,
                  });
                }
                return n;
              });

            return setQuestions((prevQues) => [
              ...prevQues,
              {
                id: nanoid(),
                question: fixEntities(result.question),
                category: result.category,
                correct_answer: {
                  ansID: correct_answer_id,
                  answer: fixEntities(result.correct_answer),
                },
                answers: answersArray,
              },
            ]);
          })
        );
    }
  }, [screen]);

  // Updating the state "result" with its latest selection from user
  useEffect(() => {
    if (screen === 1) {
      setResult([]);
      questions.forEach((ques) => {
        const ans = ques.answers;
        for (let i = 0; i < ans.length; i++) {
          if (ans[i].isClicked && ans[i].ansID === ques.correct_answer.ansID) {
            setResult((prevResult) => [...prevResult, true]);
            break;
          } else if (
            ans[i].isClicked &&
            ans[i].ansID !== ques.correct_answer.ansID
          ) {
            setResult((prevResult) => [...prevResult, false]);
            break;
          } else if (i === ans.length - 1 && !ans[i].isClicked) {
            setResult((prevResult) => [...prevResult, null]);
          }
        }
      });
    }
  }, [questions, screen]);

  console.log("questions ", questions);

  // Rendering questions and answers
  const game = questions.map((data, i) => {
    return (
      <div id={`question-${i + 1}`} className="questions" key={data.id}>
        <Question
          key={data.id}
          question={data.question}
          category={data.category}
          i={i}
        />
        <div className="answers" key={nanoid()}>
          {data.answers.map((ans) => (
            <Answer
              key={ans.ansID}
              id={ans.ansID}
              answer={[ans.ansID, ans.answer, ans.isClicked]}
              correct_answer={data.correct_answer.ansID}
              click={() =>
                !checked ? updateClicked(data.id, ans.ansID) : null
              }
              clicked={ans.isClicked}
              checked={checked}
            />
          ))}
        </div>
      </div>
    );
  });

  return (
    <div className="App">
      {screen === 0 && <StartScreen screen={updateScreen} />}
      {screen === 1 && [
        loading && (
          <div
            id="loading-display"
            className="message"
            key={nanoid()}
            style={{ fontSize: "2rem" }}
          >
            Loading...
          </div>
        ),
        !loading && (
          <div className="title" key={nanoid()}>
            Below are five questions to answer:
          </div>
        ),
        game,
        !loading && [
          <div className="bottom-btns" key={nanoid()}>
            <div
              id="check-btn"
              className="buttons"
              key={nanoid()}
              onClick={checkAnswers}
              style={
                checked
                  ? {
                      cursor: "default",
                      backgroundColor: "rgba(187, 195, 227, 0.81)",
                    }
                  : {}
              }
            >
              Check Answers
            </div>
            <div
              id="new-question-btn"
              className="buttons"
              key={nanoid()}
              onClick={updateQuestions}
            >
              New Questions
            </div>
          </div>,
          <div id="message-display" className="message" key={nanoid()}>
            {message}
          </div>,
        ],
      ]}
    </div>
  );
}

export default App;
