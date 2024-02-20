import React from 'react';
import {
  MDBCard,
  MDBCardHeader,
  MDBCardBody,
  MDBCardFooter,
  MDBBtn
} from 'mdb-react-ui-kit';

export default function Card() {
  return (
    <MDBCard alignment='center'>
      <MDBCardHeader>SBI Clerk Mock Tests</MDBCardHeader>
      <MDBCardBody >
        <MDBBtn  href='#' style={{margin:"10px"}} >SBI Clerk Prelims</MDBBtn>
        <MDBBtn href='#' style={{margin:"10px"}}>SBI Clerk Mains</MDBBtn>
        <MDBBtn href='#' style={{margin:"10px"}}>SBI Clerk Pre Sectional</MDBBtn>
        <MDBBtn href='#' style={{margin:"10px"}}>SBI Clerk Main Sectional</MDBBtn>
      </MDBCardBody>
      
    </MDBCard>
  );
}