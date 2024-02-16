import React, { useState, useEffect } from "react";
import {
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBBtn,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
} from "mdb-react-ui-kit";
import QuestionView from "./questionview";

export default function TestModal() {
  const [fullscreenXlModal, setFullscreenXlModal] = useState(true);
//question vie
  const [isQuestionOpen, setIsQuestionOpen] = useState(false);

  const openModal = () => {
      setIsQuestionOpen(true);
  };

  const closeModal = () => {
      setIsQuestionOpen(false);
  };

  useEffect(() => {
    setFullscreenXlModal(true);
  }, []);

  const toggleOpen = () => setFullscreenXlModal(!fullscreenXlModal);

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
              <MDBModalTitle>
                Please Read Following Instructions Carefully{" "}
              </MDBModalTitle>
            </MDBModalHeader>
            <MDBModalBody style={{ height: "calc(100% - 120px)", overflowY: "auto" }}>
              <div>
                Total Number of Sections: 3<br />
                Total Numbers of Questions: 100<br />
                Total Time Available: 60 minutes (1 hour)
              </div>
              <div style={{ height: "100%" }}>
                <MDBTable bordered borderColor="primary" style={{ height: "100px" }}>
                  <MDBTableHead>
                    <tr>
                      <th scope="col"># Section</th>
                      <th scope="col">Section Name</th>
                      <th scope="col">Total Questions</th>
                      <th scope="col">Max Score</th>
                      <th scope="col">Time (min)</th>
                      <th scope="col">Language</th>
                    </tr>
                  </MDBTableHead>
                  <MDBTableBody>
                    <tr >
                      <th scope="row">1</th>
                      <td>English Language</td>
                      <td>30</td>
                      <td>30</td>
                      <td>20</td>
                      <td>English</td>
                    </tr>
                    <tr>
                      <th scope="row">2</th>
                      <td>Numerical Ability</td>
                      <td>35</td>
                      <td>35</td>
                      <td>20</td>
                      <td>English</td>
                    </tr>
                    <tr>
                      <th scope="row">3</th>
                      <td>Reasoning Ability</td>
                      <td>35</td>
                      <td>35</td>
                      <td>20</td>
                      <td>English</td>
                    </tr>
                  </MDBTableBody>
                </MDBTable>
                <div>
                  <span style={{background: "gray", height: "50px", width: "50px"}}>1</span>
You have not visited the question yet<br />
                  <span style={{background:"red"}}>2</span>You have not answered the question<br />
        <span style={{background:"green"}}>3</span>You have answered the question<br />
                </div>
              </div>
              
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn onClick={openModal}>Take Test</MDBBtn>
              {isQuestionOpen && <QuestionView onClose={closeModal} />}
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
