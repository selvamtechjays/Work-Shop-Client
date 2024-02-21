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
    <MDBCard
      alignment="center"
      style={{ display: "flex", flexDirection: "column" }}
    >
      <MDBCardHeader>SBI-Clerk-Prelims-1</MDBCardHeader>
      <MDBCardBody>
        <MDBCardTitle>Max Score-100</MDBCardTitle>
        <MDBCardText>Total Questions-100</MDBCardText>
        <MDBCardText>Total Time-1 Hour</MDBCardText>
        <div>
          <MDBBtn onClick={openModal}>Take Test</MDBBtn>
          {isModalOpen && <TestModal onClose={closeModal} />}
        </div>
      </MDBCardBody>
    </MDBCard>
  );
}
