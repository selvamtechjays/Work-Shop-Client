import React from "react";
import Chart from "./bump-chart";
import { MDBBtn } from "mdb-react-ui-kit";

export default function ParentComponent() {
  return (
    <div style={{ height: "60vh" , width:'75vw' }}> 
      <MDBBtn>Chart Representation</MDBBtn>
      <Chart />
    </div>
  );
}
