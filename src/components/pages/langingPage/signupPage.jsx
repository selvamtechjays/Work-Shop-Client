import React, { useState } from "react";
import "./landingPage.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_URL } from "../../api/url";




const SignupPage = () => {
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate()

  //handle change function 
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSignupData({
      ...signupData,
      [name]: value,
    });
  };
  console.log(signupData);

  //handle submit function

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
      `${API_URL}/api/signup`,
      signupData,
      {
        headers: {
        "Content-Type": "application/json",
        },
      }
      );

      if (response.status === 201) {
      // Handle successful registration
      console.log("Registration successful");
        toast.success("Registration successful")
        setTimeout(() => {
          navigate("/dashboard");
        }, 3000);
      } else {
      // Handle registration error
      console.error("Registration failed");
        toast.error("Registration failed");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
      // User already exists
      console.error("User already exists");
        toast.error("User already exists")
      } else {
      // Other error
      console.error("Error during registration", error);
        toast.error("Error during registration")
      }
    }
    };

  return (
    <div className="main-content" style={{ color: "white", marginTop: "60px" }}>
      <div className="left-column">
        <h1>500+ FREE Mock Tests for All Govt. Exams</h1>
        <h2>
          Attempt 500+ Free Mock tests for Bank, SSC, Railways, Regulatory,
          UPSC, Defence, Teaching, Railways Exams and more
        </h2>
      </div>
      <div className="right-column">
        <h2>Signup Form</h2>
        <form>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              placeholder="Name"
              id="name"
              name="name"
              value={signupData.name}
              onChange={handleInputChange}
              required
            />
            <label htmlFor="email">Email</label>
            <input
              type="email"
              placeholder="Email"
              id="email"
              name="email"
              value={signupData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              placeholder="Password"
              id="password"
              name="password"
              value={signupData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <button className="login-button" type="submit" onClick={handleSubmit}>
            Sign Up
          </button>
          <p className="text">
            Already Have an Account? <Link to="/" style={{ color: "yellow" }}>Log In</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
