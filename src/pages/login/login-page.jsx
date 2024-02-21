import React, { useState } from 'react';
import '../../styles/main.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../../utils/api';

// Define the main content component
const MainContent = () => {
  // State to manage user sign-in data
  const [signinData, setSigninData] = useState({
    email: '',
    password: '',
  });

  // Hook to navigate to different pages
  const navigate = useNavigate();

  // Function to handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSigninData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send sign-in data to the server
      const response = await axios.post(`${API_URL}/api/login`, signinData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // If login is successful, navigate to the dashboard
      if (response.status === 200) {
        console.log('Login successful');
        toast.success('Login Successfully');
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      } else {
        // If login fails, display an error message
        console.error('Login failed');
        toast.error('Login failed. Please try again.');
      }
    } catch (error) {
      // Handle different types of errors
      if (error.response && error.response.status === 409) {
        console.error('User already exists');
        toast.error('User already exists');
      } else {
        console.error('Error during login', error);
        toast.error('Error during login. Please try again later.');
      }
    }
  };

  // Render the main content component
  return (
    <div className="main-content">
      <div className="left-column">
        <h1>500+ FREE Mock Tests for All Govt. Exams</h1>
        <h2>
          Attempt 500+ Free Mock tests for Bank, SSC, Railways, Regulatory, UPSC, Defence, Teaching, Railways Exams and more
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
              required={true}
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
              required={true}
              onChange={handleInputChange}
              value={signinData.password}
            />
          </div>
          <button className="login-button" type="submit" onClick={handleSubmit}>
            Login
          </button>
          <p className="text">
            New Here ? <Link to="/signup" style={{ color: 'yellow' }}>Sign Up</Link>
          </p>
          <p className="text">
            <Link to="/forgetPassword" style={{ color: 'yellow' }}>Forget Password</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

// Export the main content component
export default MainContent;
