import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../utils/api";
import { MDBListGroup, MDBListGroupItem, MDBContainer, MDBBtn } from "mdb-react-ui-kit";
//Define History page component
const HistoryPage = () => {
  //State Management for stored data
  const [scoreboardData, setScoreboardData] = useState([]);
  const [selectedAttempt, setSelectedAttempt] = useState(null);
  const [isScoreboardOpen, setIsScoreboardOpen] = useState(true);

  //get all the scoredboard details from database
  useEffect(() => {
    const fetchScoreboardData = async () => {
      try {
        const response = await axios.get(`${API_URL}/get-all-scoreboard`);
        setScoreboardData(response.data);
      } catch (error) {
        console.error("Error fetching scoreboard data:", error);
      }
    };

    fetchScoreboardData();
  }, []);

  const handleAttemptClick = (index) => {
    // If the same scoreboard is clicked again, close it
    if (selectedAttempt === scoreboardData[index]) {
      setSelectedAttempt(null);
      setIsScoreboardOpen(false);
    } else {
      setSelectedAttempt(scoreboardData[index]);
      setIsScoreboardOpen(true);
    }
  };

  return (
    <div className="mt-4">
      <MDBContainer className={`scoreboard-container ${isScoreboardOpen ? 'shadow' : ''}`} onClick={() => setIsScoreboardOpen(false)}>
        <h1 className="text-center" style={{background:'blue',color:'white'}}>Scoreboard History</h1>
        <MDBListGroup>
          {scoreboardData.map((attempt, index) => (
            <MDBListGroupItem
              key={index}
              onClick={() => handleAttemptClick(index)}
              className="cursor-pointer"
            >
              Attempt {index + 1}: Score {attempt.score} out of {attempt.totalQuestions}
            </MDBListGroupItem>
          ))}
        </MDBListGroup>
        {selectedAttempt && (
          <div>
            <h2 className="mt-4">Attempt Details</h2>
            <MDBBtn>Score: {selectedAttempt.score} out of {selectedAttempt.totalQuestions}</MDBBtn>
            <ul>
              {selectedAttempt.questions.map((question, index) => (
                <li key={index}>
                  <p>Question: {question.questionText}</p>
                  <p>Your Option: {selectedAttempt.selectedOptions[index] || "Not answered"}</p>
                  <p style={{color:'green'}}>Correct Answer: {selectedAttempt.correctAnswers[index]}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </MDBContainer>
    </div>
  );
};

export default HistoryPage;

