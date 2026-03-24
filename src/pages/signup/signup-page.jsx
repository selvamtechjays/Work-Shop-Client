import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_URL } from '../../utils/api';
import '../../styles/main.css';
import '../../styles/validation.css';
import { validateEmail, validatePassword, validateName, validatePasswordMatch } from '../../utils/validation';

// Define the SignupPage component
const SignupPage = () => {
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // State for validation errors
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // State for touched fields
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  // State for form validity
  const [formValid, setFormValid] = useState(false);

  // State for password strength
  const [passwordStrength, setPasswordStrength] = useState('');

  const navigate = useNavigate();

  // Function to validate individual field
  const validateField = (fieldName, value) => {
    let result;
    if (fieldName === 'name') {
      result = validateName(value);
    } else if (fieldName === 'email') {
      result = validateEmail(value);
    } else if (fieldName === 'password') {
      result = validatePassword(value);
      setPasswordStrength(result.strength || '');
    } else if (fieldName === 'confirmPassword') {
      result = validatePasswordMatch(signupData.password, value);
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
    validateField(name, signupData[name]);
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSignupData({
      ...signupData,
      [name]: value,
    });
    // Validate in real-time if field has been touched
    if (touched[name]) {
      validateField(name, value);
    }
  };

  // Effect to check form validity
  useEffect(() => {
    const allFieldsFilled = signupData.name && signupData.email && signupData.password && signupData.confirmPassword;
    const noErrors = Object.values(errors).every(err => err === '');
    setFormValid(allFieldsFilled && noErrors);
  }, [signupData, errors]);

  // Effect to re-validate confirmPassword when password changes
  useEffect(() => {
    if (touched.confirmPassword && signupData.confirmPassword) {
      validateField('confirmPassword', signupData.confirmPassword);
    }
  }, [signupData.password]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/signup`, signupData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) {
        // Registration successful
        console.log('Registration successful');
        toast.success('Registration successful');
        localStorage.setItem("userInfo",JSON.stringify(response.data._id))
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      } else {
        // Registration failed
        console.error('Registration failed');
        toast.error('Registration failed');
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // User already exists
        console.error('User already exists');
        toast.error('User already exists');
      } else {
        // Other error
        console.error('Error during registration', error);
        toast.error('Error during registration');
      }
    }
  };

  return (
    <div className="main-content" style={{ color: 'white', marginTop: '60px' }}>
      <div className="left-column">
        <h1>500+ FREE Mock Tests for All Govt. Exams</h1>
        <h2>Attempt 500+ Free Mock tests for Bank, SSC, Railways, Regulatory, UPSC, Defence, Teaching, Railways Exams and more</h2>
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
              onBlur={handleBlur}
              required
              className={`${errors.name && touched.name ? 'input-error' : ''} ${!errors.name && touched.name && signupData.name ? 'input-success' : ''}`}
              aria-invalid={errors.name && touched.name ? 'true' : 'false'}
              aria-describedby="name-error"
            />
            {errors.name && touched.name && (
              <span id="name-error" className="error-message" role="alert" aria-live="polite">
                {errors.name}
              </span>
            )}
            <label htmlFor="email">Email</label>
            <input
              type="email"
              placeholder="Email"
              id="email"
              name="email"
              value={signupData.email}
              onChange={handleInputChange}
              onBlur={handleBlur}
              required
              className={`${errors.email && touched.email ? 'input-error' : ''} ${!errors.email && touched.email && signupData.email ? 'input-success' : ''}`}
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
              value={signupData.password}
              onChange={handleInputChange}
              onBlur={handleBlur}
              required
              className={`${errors.password && touched.password ? 'input-error' : ''} ${!errors.password && touched.password && signupData.password ? 'input-success' : ''}`}
              aria-invalid={errors.password && touched.password ? 'true' : 'false'}
              aria-describedby="password-error"
            />
            {passwordStrength && touched.password && signupData.password && (
              <div className={`password-strength-${passwordStrength}`}>
                {passwordStrength.charAt(0).toUpperCase() + passwordStrength.slice(1)}
              </div>
            )}
            {errors.password && touched.password && (
              <span id="password-error" className="error-message" role="alert" aria-live="polite">
                {errors.password}
              </span>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm Password"
              id="confirmPassword"
              name="confirmPassword"
              value={signupData.confirmPassword}
              onChange={handleInputChange}
              onBlur={handleBlur}
              required
              className={`${errors.confirmPassword && touched.confirmPassword ? 'input-error' : ''} ${!errors.confirmPassword && touched.confirmPassword && signupData.confirmPassword ? 'input-success' : ''}`}
              aria-invalid={errors.confirmPassword && touched.confirmPassword ? 'true' : 'false'}
              aria-describedby="confirmPassword-error"
            />
            {errors.confirmPassword && touched.confirmPassword && (
              <span id="confirmPassword-error" className="error-message" role="alert" aria-live="polite">
                {errors.confirmPassword}
              </span>
            )}
          </div>
          <button
            className={`login-button ${(!formValid || Object.values(errors).some(err => err !== '')) ? 'button-disabled' : ''}`}
            type="submit"
            onClick={handleSubmit}
            disabled={!formValid || Object.values(errors).some(err => err !== '')}
          >
            Sign Up
          </button>
          <p className="text">
            Already Have an Account? <Link to="/" style={{ color: 'yellow' }}>Log In</Link>
          </p>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SignupPage;

