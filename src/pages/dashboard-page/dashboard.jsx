import React, { useState } from "react";
import "../../styles/dashboard.css";
import Card from "../../components/card";
import Test from "../../components/test-card";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import HistoryPage from "../history/user-histroy";
import ParentComponent from "../../components/chart-parent";


// Define the DashboardPage component
const Dashboard = () => {
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState("Dashboard");

  // Function to handle logout
  const logout = () => {
    toast.success("Logout Successfully");
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  // Function to handle clicking on a link
  const handleLinkClick = (link) => {
    setActiveLink(link);
    if (link === "Dashboard") {
      console.log("Dashboard link clicked");
    } else if (link === "History") {
      console.log("History link clicked");
    }else if (link === "Progress"){
      console.log("Progress link clicked")
    }
  };

  return (
    <div className="dashboard-main">
      <div className="sidebar">
        <ul style={{ listStyleType: "none" }}>
          <li
            className={activeLink === "Dashboard" ? "active" : ""}
            onClick={() => handleLinkClick("Dashboard")}
          >
            Dashboard
          </li>
          <li
            className={activeLink === "History" ? "active" : "side-link"}
            onClick={() => handleLinkClick("History")}
            style={{ marginTop: "30px" }}
          >
            History
          </li>
          <li
            className={activeLink === "Progress" ? "active" : "side-link"}
            onClick={() => handleLinkClick("Progress")}
            style={{ marginTop: "30px" }}
          >
            Progress
          </li>
          <li className="side-links" onClick={logout}>
            Logout
          </li>
        </ul>
      </div>
      <div className="dash-content">
        <div className="row-1">
          <Card />
        </div>
        <div className="row-2">
          {activeLink === 'History' ? <HistoryPage />:<Test/>}
          {activeLink == 'Progress' && <ParentComponent />}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
