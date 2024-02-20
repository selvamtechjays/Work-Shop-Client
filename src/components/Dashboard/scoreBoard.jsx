import React from "react";
import { useLocation } from "react-router-dom";
import { MDBCard, MDBCardBody } from "mdb-react-ui-kit";

export default function Scoreboard() {
  const location = useLocation();
  const { score, totalQuestions, questions, selectedOptions, correctAnswers } = location.state;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginTop:"100px" }}>
      <MDBCard style={{ width: "800px" }}>
        <MDBCardBody>
          <h1 className="mb-4">Scoreboard</h1>
          <p className="mb-0">Your score is {score} out of {totalQuestions}</p>
          <div style={{ marginTop: "20px" }}>
            {questions.map((question, index) => (
              <div key={index} style={{ marginBottom: "20px" }}>
                <p style={{ fontWeight: "bold" }}>Question {index + 1}:</p>
                <p>Question: {question.questionText}</p>
                <p style={{ marginBottom: "5px" }}>Your answer: {selectedOptions[index] || "Not answered"}</p>
                <p style={{ marginBottom: "5px" }}>Correct answer: {correctAnswers[index]}</p>
                <p style={{ color: selectedOptions[index] === correctAnswers[index] ? "green" : "red", marginBottom: "5px" }}>
                  {selectedOptions[index] === correctAnswers[index] ? "Correct!" : "Incorrect!"}
                </p>
              </div>
            ))}
          </div>
        </MDBCardBody>
      </MDBCard>
    </div>
  );
}
