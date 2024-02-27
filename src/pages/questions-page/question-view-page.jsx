import React, { useState, useEffect, useRef } from "react";
import {
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBBtn,
  MDBCard,
  MDBCardBody,
} from "mdb-react-ui-kit";
import "../../styles/dashboard.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_URL } from "../../utils/api";

   //Define Question view component
export default function QuestionView() {
  const [fullscreenXlModal, setFullscreenXlModal] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionList, setQuestionList] = useState([]);

  //navigation
  const navigate = useNavigate();

  //initial time
  const [timeLeft, setTimeLeft] = useState(1500);
  // Define a state variable to track if the timer is active
  const [timerActive, setTimerActive] = useState(true);
  const [timerPaused, setTimerPaused] = useState(false);
  const [remainingTime, setRemainingTime] = useState(15 * 60);
  const timerIntervalRef = useRef(null);

  // Function to handle timer completion
  const handleTimerCompletion = () => {
    console.log("Time's up! Submitting...");
    toast.error("Time's up!");
    handleSubmit();
  };

  // Function to handle timer pause/resume
  const handleTimerPauseResume = () => {
    if (timerActive) {
      clearInterval(timerIntervalRef.current);
      setTimerPaused(true);
      setTimerActive(false);
    } else {
      setTimerActive(true);
      setTimerPaused(false);
      // Restart the timer interval with the remaining time
      timerIntervalRef.current = setInterval(() => {
        if (remainingTime === 0) {
          clearInterval(timerIntervalRef.current);
          handleTimerCompletion();
        } else {
          handleTimerTick();
          setRemainingTime((prevTime) => prevTime - 1);
        }
      }, 1000);
    }
  };

  // Function to handle "Pause" button click
  const handlePause = () => {
    handleTimerPauseResume();
  };

  // Function to handle "Resume" button click
  const handleResume = () => {
    handleTimerPauseResume();
  };

  // Function to handle each second of the timer
  const handleTimerTick = () => {
    setTimeLeft((prevTime) => prevTime - 1);
  };

  // useEffect hook to set up the timer
  useEffect(() => {
    if (timerActive && !timerPaused) {
      timerIntervalRef.current = setInterval(() => {
        if (timeLeft === 0) {
          clearInterval(timerIntervalRef.current);
          handleTimerCompletion();
        } else {
          handleTimerTick();
        }
      }, 1000);
    }
    return () => clearInterval(timerIntervalRef.current);
  }, [timeLeft, timerActive, timerPaused]);

  const [questions, setQuestions] = useState(
    Array.from({ length: 20 }, (_, index) => ({
      number: index + 1,
      visited: false,
      answered: false,
      selectedOptionIndex: null,
    })),
  );

  //get all the questions from server
  const getAllQuestions = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/get-all-questions`,
      );
      setQuestionList(response.data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  useEffect(() => {
    setFullscreenXlModal(true);
    getAllQuestions();
  }, []);

  useEffect(() => {
    if (questionList.length > 0) {
      const score = calculateScore();
      console.log("Score calculated:", score);
    }
  }, [questionList]);

  // Function to handle option click
  const handleOptionClick = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex].answered = false;
    updatedQuestions[currentQuestionIndex].selectedOptionIndex = index + 1;
    console.log("Selected Index:", index);
    console.log("Updated Questions:", updatedQuestions);
    setQuestions(updatedQuestions);
  };

  // Function to handle clicking a question number
  const handleQuestionNumberClick = (index) => {
    setCurrentQuestionIndex(index);
    const updatedQuestions = [...questions];
    updatedQuestions[index].visited = true;
    setQuestions(updatedQuestions);
  };

  // Function to handle "Save and Next" button click
  const handleSaveAndNext = () => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex].answered = true;
    setQuestions(updatedQuestions);

    setCurrentQuestionIndex((prevIndex) => {
      let nextIndex = prevIndex + 1;
      while (nextIndex < questions.length && questions[nextIndex].answered) {
        nextIndex++;
      }
      return nextIndex < questions.length ? nextIndex : prevIndex;
    });
  };

  // Function to handle "Previous" button click
  const handlePrevious = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
  };

  const toggleOpen = () => setFullscreenXlModal(!fullscreenXlModal);

  // Function to calculate the score
  const calculateScore = () => {
    let score = 0;
    for (let i = 0; i < questions.length; i++) {
      const correctIndex = questionList[i]?.correctOptionIndex;
      const selectedOptionIndex = questions[i]?.selectedOptionIndex;
      console.log("Correct Index:", correctIndex);
      console.log("Selected Index:", selectedOptionIndex);
      if (
        correctIndex !== undefined &&
        selectedOptionIndex !== undefined &&
        selectedOptionIndex === correctIndex
      ) {
        score++;
      }
    }
    return score;
  };

  // Call the calculateScore function
  const score = calculateScore();
  console.log("Score:", score);

  // Function to handle "Submit" button click
  const handleSubmit = () => {
    const score = calculateScore();
    toast.success("Submitted successfully...");

    setTimeout(() => {
      navigate("/scoreboard", {
        state: {
          score: score,
          totalQuestions: questions.length,
          questions: questionList,
          selectedOptions: questions.map((question) => {
            if (question.selectedOptionIndex !== null) {
              return questionList[question.number - 1].options[
                question.selectedOptionIndex - 1
              ];
            } else {
              return "Not answered";
            }
          }),
          correctAnswers: questionList.map(
            (question) => question.options[question.correctOptionIndex - 1],
          ),
        },
      });
    }, 1000);
  };

  return (
    <>
      <MDBModal
        tabIndex="-1"
        open={fullscreenXlModal}
        setOpen={setFullscreenXlModal}
      >
        <MDBModalDialog size="fullscreen">
          <MDBModalContent style={{ height: "100%", width: "100%" }}>
            <MDBModalHeader>
              <MDBModalTitle>SBI Clerk Prelims-1 </MDBModalTitle>
            </MDBModalHeader>
            <MDBModalBody style={{ overflowY: "auto" }}>
              <div className="question-section">
                <div className="left-section">
                  <div className="question">
                    Question {questions[currentQuestionIndex].number}:{" "}
                    {questionList.length > 0 &&
                      questionList[currentQuestionIndex].questionText}
                    
                    <div className="options">
                      {questionList.length > 0 &&
                        questionList[currentQuestionIndex] &&
                        questionList[currentQuestionIndex].imageUrl && (
                          <img src={questionList[currentQuestionIndex].imageUrl} alt="Question Image" />
                        )}

                      {questionList.length > 0 &&
                        questionList[currentQuestionIndex].options.map(
                          (option, index) => (
                            <div key={index}>
                              <input
                                type="radio"
                                name="option"
                                value={index}
                                id={`option${index + 1}`}
                                onClick={() => handleOptionClick(index)}
                              />
                              <label htmlFor={`option${index + 1}`}>
                                {String.fromCharCode(65 + index)}) {option}
                              </label>
                              <br />
                            </div>
                          ),
                        )}
                    </div>
                  </div>
                  <div>
                    <MDBBtn
                      onClick={handlePrevious}
                      disabled={currentQuestionIndex === 0}
                    >
                      Previous
                    </MDBBtn>
                    <MDBBtn onClick={handleSaveAndNext}>Save and Next</MDBBtn>
                  </div>
                </div>
                <div className="right-section">
                  <div>
                    <h2>
                      Time Left: {Math.floor(timeLeft / 60)}:
                      {(timeLeft % 60).toLocaleString("en-US", {
                        minimumIntegerDigits: 2,
                      })}
                    </h2>
                  </div>
                  <MDBCard alignment="center">
                    <MDBCardBody
                      style={{ overflowY: "auto", maxHeight: "400px" }}
                    >
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(4, 1fr)",
                          gap: "10px",
                        }}
                      >
                        {questions.map((question, index) => (
                          <div
                            key={index}
                            style={{
                              padding: "10px",
                              backgroundColor: question.answered
                                ? "green"
                                : question.visited && !question.answered
                                  ? "red"
                                  : index === currentQuestionIndex
                                    ? "white"
                                    : "whitesmoke",
                              cursor: "pointer",
                            }}
                            onClick={() => handleQuestionNumberClick(index)}
                          >
                            {`${question.number}`}
                          </div>
                        ))}
                      </div>
                    </MDBCardBody>
                  </MDBCard>
                </div>
              </div>
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn type="button" color="success" onClick={handleSubmit}>
                Submit
              </MDBBtn>
              <MDBBtn type="button" color="danger" onClick={handlePause}>
                Pause
              </MDBBtn>
              <MDBBtn type="button" color="success" onClick={handleResume}>
                Resume
              </MDBBtn>
              <MDBBtn type="button" color="secondary" onClick={toggleOpen}>
                Close
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
}
