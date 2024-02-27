import React, { useState } from "react";
import {
  MDBCard,
  MDBCardHeader,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBBtn,
} from "mdb-react-ui-kit";
import TestModal from "../pages/questions-page/question-page";


// Test component to display test information and start the test
export default function Test() {
  // State to manage modal open/close
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to open the test modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the test modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-around" }}>
      {/* First container */}
      <MDBCard style={{width:'350px' ,textAlign:'center'}}>
        <MDBCardHeader style={{background:'blue',color:'white'}}>SBI-Clerk-Prelims-1</MDBCardHeader>
        <MDBCardBody>
          <MDBCardTitle>Max Score-20</MDBCardTitle>
          <MDBCardText>Total Questions-20</MDBCardText>
          <MDBCardText>Total Time-25 Minutes</MDBCardText>
          <div>
            <MDBBtn onClick={openModal}>Take Test</MDBBtn>
            {isModalOpen && <TestModal onClose={closeModal} />}
          </div>
        </MDBCardBody>
      </MDBCard>

      {/* Second container */}
      <MDBCard style={{width:'350px' ,textAlign:'center'}}>
        <MDBCardHeader style={{background:'blue',color:'white'}} >SBI-Clerk-Prelims-2</MDBCardHeader>
        <MDBCardBody>
          <MDBCardTitle>Max Score-20</MDBCardTitle>
          <MDBCardText>Total Questions-20</MDBCardText>
          <MDBCardText>Total Time-25 Minutes</MDBCardText>
          <div>
            <MDBBtn onClick={openModal}>Take Test</MDBBtn>
            {isModalOpen && <TestModal onClose={closeModal} />}
          </div>
        </MDBCardBody>
      </MDBCard>

      {/* Third container */}
      <MDBCard style={{width:'350px' ,textAlign:'center'}}>
        <MDBCardHeader style={{background:'blue',color:'white'}}>SBI-Clerk-Prelims-3</MDBCardHeader>
        <MDBCardBody >
          <MDBCardTitle>Max Score-20</MDBCardTitle>
          <MDBCardText>Total Questions-20</MDBCardText>
          <MDBCardText>Total Time-25 Minutes</MDBCardText>
          <div>
            <MDBBtn onClick={openModal}>Take Test</MDBBtn>
            {isModalOpen && <TestModal onClose={closeModal} />}
          </div>
        </MDBCardBody>
      </MDBCard>
    </div>
  );
}
