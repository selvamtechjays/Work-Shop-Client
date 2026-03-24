import React, { useState } from 'react';
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

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);

  // Hook to navigate to different pages
  const navigate = useNavigate();

  // Validate field
  const validateField = (name, value) => {
    let validation;

    switch (name) {
      case 'email':
        validation = validateEmail(value);
        break;
      case 'password':
        validation = validatePasswordLogin(value);
        break;
      default:
        validation = { isValid: true, error: '' };
    }

    setErrors(prev => ({ ...prev, [name]: validation.error }));
    return validation.isValid;
  };

  // Function to handle input changes with real-time validation
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

  // Handle blur event
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  // Check if form is valid
  const isFormValid = () => {
    return (
      signinData.email &&
      signinData.password &&
      !errors.email &&
      !errors.password
    );
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const emailValid = validateField('email', signinData.email);
    const passwordValid = validateField('password', signinData.password);

    // Mark all fields as touched
    setTouched({
      email: true,
      password: true,
    });

    // If any validation fails, stop submission
    if (!emailValid || !passwordValid) {
      toast.error('Please fix all validation errors before submitting.');
      return;
    }

    setIsSubmitting(true);

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

        // Reset failed attempts on success
        setFailedAttempts(0);

        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      }
    } catch (error) {
      // Increment failed attempts
      const newFailedAttempts = failedAttempts + 1;
      setFailedAttempts(newFailedAttempts);

      // Handle different types of errors
      if (error.response && error.response.status === 400) {
        // Handle validation errors from backend
        if (error.response.data.errors) {
          const backendErrors = {};
          error.response.data.errors.forEach(err => {
            backendErrors[err.field] = err.message;
          });
          setErrors(prev => ({ ...prev, ...backendErrors }));
          toast.error('Please check your credentials.');
        } else {
          toast.error('Invalid credentials.');
        }
      } else if (error.response && error.response.status === 401) {
        toast.error('Invalid email or password.');
      } else {
        console.error('Error during login', error);
        toast.error('Error during login. Please try again later.');
      }

      // Show progressive warning messages based on failed attempts
      if (newFailedAttempts >= 3) {
        toast.warning('Multiple failed login attempts detected. Please verify your credentials or reset your password.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get input class based on validation state
  const getInputClass = (fieldName) => {
    if (!touched[fieldName]) return '';
    if (errors[fieldName]) return 'input-error';
    if (signinData[fieldName]) return 'input-success';
    return '';
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
        <form onSubmit={handleSubmit} className={isSubmitting ? 'form-loading' : ''}>
          <div className="form-group">
            <label htmlFor="useremail">Email</label>
            <input
              type="email"
              placeholder="Email"
              id="useremail"
              name="email"
              value={signinData.email}
              onChange={handleInputChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
              className={getInputClass('email')}
              aria-invalid={touched.email && errors.email ? 'true' : 'false'}
              aria-describedby={errors.email ? 'email-error' : undefined}
              required
            />
            {touched.email && errors.email && (
              <div
                id="email-error"
                className="error-message"
                role="alert"
                aria-live="polite"
              >
                {errors.email}
              </div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              placeholder="Password"
              id="password"
              name="password"
              value={signinData.password}
              onChange={handleInputChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
              className={getInputClass('password')}
              aria-invalid={touched.password && errors.password ? 'true' : 'false'}
              aria-describedby={errors.password ? 'password-error' : undefined}
              required
            />
            {touched.password && errors.password && (
              <div
                id="password-error"
                className="error-message"
                role="alert"
                aria-live="polite"
              >
                {errors.password}
              </div>
            )}
          </div>
          <button
            className={`login-button ${(!isFormValid() || isSubmitting) ? 'button-disabled' : ''}`}
            type="submit"
            disabled={!isFormValid() || isSubmitting}
          >
            {isSubmitting ? (
              <>
                Logging In...
                <span className="loading-spinner"></span>
              </>
            ) : (
              'Login'
            )}
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
