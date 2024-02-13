import React, { useState } from "react";
import "./landingPage.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../api/url";
import { toast } from "react-toastify";

const MainContent = () => {
  const [signinData, setSigninData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSigninData({
      ...signinData,
      [name]: value,
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
      `${API_URL}/api/login`,
      signinData,
      {
        headers: {
        "Content-Type": "application/json",
        },
      }
      );

      if (response.status === 200) {
      // Handle successful registration
      console.log("Login successful");
      toast.success("Login Successfully")
        setTimeout(() => {
          navigate("/dashboard");
        }, 3000);
      } else {
      // Handle registration error
      console.error("Login failed");
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
      // User already exists
      console.error("User already exists");
      toast.error("User already exists");
      } else {
      // Other error
      console.error("Error during registration", error);
      toast.error("Error during registration");
      }
    }
    };
  
  return (
    <div className="main-content">
      <div className="left-column">
        <h1>500+ FREE Mock Tests for All Govt. Exams</h1>
        <h2>
          Attempt 500+ Free Mock tests for Bank, SSC, Railways, Regulatory,
          UPSC, Defence, Teaching, Railways Exams and more
        </h2>
      </div>
      <div className="right-column">
        <h2>Login Form</h2>
        <form>
          <div className="form-group">
            <label htmlFor="username">Email</label>
            <input
              type="email"
              placeholder="Email"
              id="useremail"
              name="email"
              required="true"
              onChange={handleInputChange}
              value={signinData.email}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              placeholder="Password"
              id="password"
              name="password"
              required ="true"
              onChange={handleInputChange}
              value={signinData.password}
            />
          </div>
          <button className="login-button" type="submit" onClick={handleSubmit}>
            Login
          </button>
          <p className="text">
            New Here ? <Link to="/signup" style={{color:"yellow"}}>Sing Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default MainContent;