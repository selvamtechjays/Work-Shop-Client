import React, { useState } from 'react';
import {
  MDBCard,
  MDBCardHeader,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCardFooter,
  MDBBtn
} from 'mdb-react-ui-kit';
import TestModal from './questionsPage';

export default function Test() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  return (
    <MDBCard alignment='center' style={{display:'flex',flexDirection:'column'}}>
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