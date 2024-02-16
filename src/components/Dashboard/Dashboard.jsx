import React from "react";
import "./Dashboard.css";
import Card from "./card";
import Test from "./testCard";
import {useNavigate} from "react-router-dom"
import { toast } from "react-toastify";

const Dashboard = () => {
const navigate = useNavigate();
  const logout = ()=>{
    toast.success("Logout Successfully")
    setTimeout(() => {
      navigate("/");
    }, 1000);
  }
  return (
    <div className="dashboard-main">
      <div className="sidebar">
        <ul style={{ listStyleType: "none",}}>
          <li className="active" >Dashboard</li>
          <li className="side-links" onClick={logout} >Logout</li>
        </ul>
      </div>
      <div className="dash-content">
        <div className="row-1">
           <Card/>
        </div>
        <div className="row-2">
           <Test/>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
