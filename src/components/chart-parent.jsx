import React from "react";
import Chart from "./bump-chart";

export default function ParentComponent() {
  return (
    <div style={{ height: "30vh" , width:'75vw' }}> 
      <Chart />
    </div>
  );
}
