import { useState, useEffect } from "react";
import useSound from "use-sound";
import play from "../sounds/play.mp3";
import correct from "../sounds/correct.mp3";
import wrong from "../sounds/wrong.mp3";

const Quiz = ({ newData, questionNumber, setQuestionNumber, setTimeOut }) => {
  const [newQuestion, setNewQuestion] = useState({});
  const [selectedAnswer, setSelectedAnswer] = useState(-1);
  const [className, setClassName] = useState("answer");
  const [letsPlay] = useSound(play);
  const [correctAnswer] = useSound(correct);
  const [wrongAnswer] = useSound(wrong);

  // Power-up states
  const [is50Clicked, setIs50Clicked] = useState(false);
  const [isAudienceClicked, setIsAudienceClicked] = useState(false);

  // Effect to load the new question when the question number changes
  useEffect(() => {
    setNewQuestion(newData[questionNumber - 1]);
  }, [newData, questionNumber]);

  // Play sound when the quiz starts
  useEffect(() => {
    letsPlay();
  }, [letsPlay]);

  // Function to delay an action (useful for animations)
  const delay = (duration, callBack) => {
    setTimeout(() => {
      callBack();
    }, duration);
  };

  // Handle answer selection
  const handleClick = (index) => {
    setSelectedAnswer(index);
    setClassName("answer active");

    const correct = newQuestion.correct_option === index + 1;

    delay(3000, () => {
      setClassName(correct ? "answer correct" : "answer wrong");
    });

    delay(5000, () => {
      if (correct) {
        correctAnswer();
        delay(1000, () => {
          setQuestionNumber((prev) => prev + 1);
          setSelectedAnswer(-1);
        });
      } else {
        wrongAnswer();
        delay(1000, () => {
          setTimeOut(true);
        });
      }
    });
  };

  // Handle the 50-50 power-up
  const handle50Click = () => {
    if (!is50Clicked) {
      setIs50Clicked(true);

      const question = newQuestion;
      let answerOptions = [...question.options];
      const correctAnswerIndex = question.correct_option - 1;

      answerOptions.splice(correctAnswerIndex, 1);

      const removeTwoRandomElements = (arr) => {
        if (arr.length > 2) {
    
          const index1 = Math.floor(Math.random() * arr.length);
          let index2;
          do {
              index2 = Math.floor(Math.random() * arr.length);
          } while (index2 === index1);
      
          const indices = [index1, index2].sort((a, b) => b - a);
      
          indices.forEach(index => arr.splice(index, 1));
        }
      
        return arr;
    }

    answerOptions = removeTwoRandomElements(answerOptions);

    answerOptions.push(question.options[question.correct_option - 1]);

    const shuffleArray = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
  
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
  }

    answerOptions = shuffleArray(answerOptions);

    question.correct_option = answerOptions.indexOf(question.options[question.correct_option - 1]) + 1;
    question.options = answerOptions;

    setNewQuestion(question);
    }
  };

  // Handle the Audience Poll power-up (Only changes the image)
  const handleAudienceClick = () => {
    if (!isAudienceClicked) {
      setIsAudienceClicked(true); // Mark that audience poll was used
    }
  };

  if (newQuestion?.question) {
    return (
      <div className="quiz">
        <div className="powerups-container">
          {/* Power-ups */}
          <img
            src={is50Clicked ? "/images/50-50-X.png" : "/images/50-50.png"}
            alt="50-50"
            onClick={handle50Click}
            style={{
              cursor: is50Clicked ? "not-allowed" : "pointer",
              opacity: is50Clicked ? 0.5 : 1,
            }}
          />
          <img
            src={isAudienceClicked ? "/images/audiencePoll-X.png" : "/images/audiencePoll.png"}
            alt="Audience Poll"
            onClick={handleAudienceClick}
            style={{
              cursor: isAudienceClicked ? "not-allowed" : "pointer",
              opacity: isAudienceClicked ? 0.5 : 1,
            }}
          />
        </div>

        {/* Question */}
        <div className="question">{newQuestion?.question}</div>

        {/* Answer Options */}
        <div className="answers">
          {newQuestion?.options.map((item, index) => (
            <div
              className={selectedAnswer === index ? className : "answer"}
              onClick={() => selectedAnswer === -1 && handleClick(index)}
              key={index}
              style={{ display: item === "Removed" ? "none" : "block" }} // Hide removed options
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    );
  } else {
    return <>Loading...</>;
  }
};

export default Quiz;
