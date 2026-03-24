import React, { useState, useEffect } from 'react';
import '../../styles/main.css';
import '../../styles/validation.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../../utils/api';
import { validateEmail, validatePasswordLogin } from '../../utils/validation';

// Define the main content component
const MainContent = () => {
  // State to manage user sign-in data
  const [signinData, setSigninData] = useState({
    email: '',
    password: '',
  });

  // State for validation errors
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  // State for touched fields
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  // State for form validity
  const [formValid, setFormValid] = useState(false);

  // Hook to navigate to different pages
  const navigate = useNavigate();

  // Function to validate individual field
  const validateField = (fieldName, value) => {
    let result;
    if (fieldName === 'email') {
      result = validateEmail(value);
    } else if (fieldName === 'password') {
      result = validatePasswordLogin(value);
    }
    setErrors(prev => ({
      ...prev,
      [fieldName]: result.error
    }));
    return result.isValid;
  };

  // Function to handle field blur
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    validateField(name, signinData[name]);
  };

  // Function to handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSigninData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // Validate in real-time if field has been touched
    if (touched[name]) {
      validateField(name, value);
    }
  };

  // Effect to check form validity
  useEffect(() => {
    const isEmailValid = signinData.email && !errors.email;
    const isPasswordValid = signinData.password && !errors.password;
    setFormValid(isEmailValid && isPasswordValid);
  }, [signinData, errors]);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send sign-in data to the server
      const response = await axios.post(`${API_URL}/login`, signinData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // If login is successful, navigate to the dashboard
      if (response.status === 200) {
        console.log('Login successful');
        toast.success('Login Successfully');
        const { _id, email } = response.data.user;

        // Creating an object with user ID and email
        const userInfo = { userId: _id, userEmail: email };

        // Saving the userInfo object into localStorage after stringifying it
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
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
            <label htmlFor="useremail">Email</label>
            <input
              type="email"
              placeholder="Email"
              id="useremail"
              name="email"
              required={true}
              onChange={handleInputChange}
              onBlur={handleBlur}
              value={signinData.email}
              className={`${errors.email && touched.email ? 'input-error' : ''} ${!errors.email && touched.email && signinData.email ? 'input-success' : ''}`}
              aria-invalid={errors.email && touched.email ? 'true' : 'false'}
              aria-describedby="email-error"
            />
            {errors.email && touched.email && (
              <span id="email-error" className="error-message" role="alert" aria-live="polite">
                {errors.email}
              </span>
            )}
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
              onBlur={handleBlur}
              value={signinData.password}
              className={`${errors.password && touched.password ? 'input-error' : ''} ${!errors.password && touched.password && signinData.password ? 'input-success' : ''}`}
              aria-invalid={errors.password && touched.password ? 'true' : 'false'}
              aria-describedby="password-error"
            />
            {errors.password && touched.password && (
              <span id="password-error" className="error-message" role="alert" aria-live="polite">
                {errors.password}
              </span>
            )}
          </div>
          <button
            className={`login-button ${(!formValid || Object.values(errors).some(err => err !== '')) ? 'button-disabled' : ''}`}
            type="submit"
            onClick={handleSubmit}
            disabled={!formValid || Object.values(errors).some(err => err !== '')}
          >
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
