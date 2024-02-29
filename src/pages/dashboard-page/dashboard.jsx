import React, { useEffect, useState } from "react";
import "../../styles/dashboard.css";
import Card from "../../components/card";
import Test from "../../components/test-card";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import HistoryPage from "../history/user-histroy";
import ParentComponent from "../../components/chart-parent";
import { AiOutlineDashboard } from "react-icons/ai";
import { MdWorkHistory } from "react-icons/md";
import { GiProgression } from "react-icons/gi";
import { TbLogout } from "react-icons/tb";

// Define the DashboardPage component
const Dashboard = () => {
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState("Dashboard");
  const [userName, setUserName] = useState("");

  // Function to handle logout
  const logout = () => {
    toast.success("Logout Successfully");
    // Remove an item from localStorage
    localStorage.removeItem("userInfo");
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
    } else if (link === "Progress") {
      console.log("Progress link clicked");
    }
  };

  useEffect(() => {
    // Retrieve user info from localStorage
    const userInfoString = localStorage.getItem("userInfo");
    const userInfo = JSON.parse(userInfoString);
    const email = userInfo ? userInfo.userEmail : null;

    if (email) {
      // Extract the name from the email address
      const extractedName = extractNameFromEmail(email);
      setUserName(extractedName);
    }
  }, []);

  // Function to extract the name from the email address
  const extractNameFromEmail = (email) => {
    const atIndex = email.indexOf("@");
    if (atIndex !== -1) {
      return email.substring(0, atIndex);
    }
    return email;
  };

  return (
    <div className="dashboard-main">
      <div className="sidebar">
        <ul style={{ listStyleType: "none" }}>
          <li
            className={activeLink === "Dashboard" ? "active" : ""}
            onClick={() => handleLinkClick("Dashboard")}
          >
            <AiOutlineDashboard /> Dashboard
          </li>
          <li
            className={activeLink === "History" ? "active" : "side-link"}
            onClick={() => handleLinkClick("History")}
            style={{ marginTop: "30px" }}
          >
            <MdWorkHistory /> History
          </li>
          <li
            className={activeLink === "Progress" ? "active" : "side-link"}
            onClick={() => handleLinkClick("Progress")}
            style={{ marginTop: "30px" }}
          >
            <GiProgression /> Progress
          </li>
          <li className="side-links" onClick={logout}>
            <TbLogout /> Logout
          </li>
        </ul>
      </div>
      <div className="dash-content">
        <div className="text-end user-icon">
          <p style={{ fontSize: "20px", fontFamily: "cursive" }}>
            <img
              src="https://th.bing.com/th/id/OIP.aqyKxF_a1JtOtE5Grz3ZIwHaHs?w=177&h=184&c=7&r=0&o=5&dpr=1.3&pid=1.7"
              style={{ borderRadius: "50%", width: "50px", height: "50px" }}
            />
            {"  "}
            {userName}
          </p>
        </div>
        <div className="row-1" style={{ marginTop: "80px" }}>
          <Card />
        </div>
        <div className="row-2" style={{ marginTop: "80px" }}>
          {activeLink === "Progress" ? (
            <ParentComponent />
          ) : (
            <>{activeLink === "History" ? <HistoryPage /> : <Test />}</>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
