import React from "react";
import {
  MDBCard,
  MDBCardHeader,
  MDBCardBody,
  MDBCardFooter,
  MDBBtn,
} from "mdb-react-ui-kit";

//Define the card component
export default function Card() {
  return (
    <MDBCard alignment="center">
      <MDBCardHeader style={{background:'blue',color:'white'}}>SBI Clerk Mock Tests</MDBCardHeader>
      <MDBCardBody>
        <MDBBtn href="#" style={{ margin: "10px" }}>
          SBI Clerk Prelims
        </MDBBtn>
        <MDBBtn href="#" style={{ margin: "10px" }}>
          SBI Clerk Mains
        </MDBBtn>
        <MDBBtn href="#" style={{ margin: "10px" }}>
          SBI Clerk Pre Sectional
        </MDBBtn>
        <MDBBtn href="#" style={{ margin: "10px" }}>
          SBI Clerk Main Sectional
        </MDBBtn>
      </MDBCardBody>
    </MDBCard>
  );
}
