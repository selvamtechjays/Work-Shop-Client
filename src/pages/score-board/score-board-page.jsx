import React from "react";
import { useLocation } from "react-router-dom";
import { MDBCard, MDBCardBody, MDBBtn, MDBCardHeader } from "mdb-react-ui-kit";
import axios from "axios";
import { API_URL } from "../../utils/api";
import { toast } from "react-toastify";

 //Define score board component
export default function Scoreboard() {
  const location = useLocation();
  const { score, totalQuestions, questions, selectedOptions, correctAnswers } =
    location.state;
// function to save scoreboard data
  const saveScoreboardData = async () => {
    try {
      const response = await axios.post(`${API_URL}/save-scoreboard`, {
        score,
        totalQuestions,
        questions,
        selectedOptions,
        correctAnswers,
      });
      console.log("Scoreboard data saved successfully", response.data);
      toast.success("Scoreboard data saved successfully");
    
    } catch (error) {
      console.error("Error saving scoreboard data:", error);
      toast.error("Error saving scoreboard data");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "100px",
      }}
    >
      <MDBCard style={{ width: "800px" }}>
        <MDBCardHeader style={{background:'blue',color:'white',textAlign:'center'}} >   <h1 className="mb-4">Scoreboard</h1>
          <p className="mb-0">
            Your score is {score} out of {totalQuestions}
          </p>
        </MDBCardHeader>
        <MDBCardBody>
       
          <div style={{ marginTop: "20px" }}>
            {questions.map((question, index) => (
              <div key={index} style={{ marginBottom: "20px" }}>
                <p style={{ fontWeight: "bold" }}>Question {index + 1}:</p>
                <p>Question: {question.questionText}</p>
                <p style={{ marginBottom: "5px" }}>
                  Your answer: {selectedOptions[index] || "Not answered"}
                </p>
                <p style={{ marginBottom: "5px" }}>
                  Correct answer: {correctAnswers[index]}
                </p>
                <p
                  style={{
                    color:
                      selectedOptions[index] === correctAnswers[index]
                        ? "green"
                        : "red",
                    marginBottom: "5px",
                  }}
                >
                  {selectedOptions[index] === correctAnswers[index]
                    ? "Correct!"
                    : "Incorrect!"}
                </p>
              </div>
            ))}
          </div>
          <MDBBtn onClick={saveScoreboardData}>Save</MDBBtn>
        </MDBCardBody>
      </MDBCard>
    </div>
  );
}
