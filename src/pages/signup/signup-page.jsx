import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_URL } from '../../utils/api';
import {
  validateEmail,
  validatePassword,
  validateName,
  validatePasswordMatch
} from '../../utils/validation';
import '../../styles/main.css';
import '../../styles/validation.css';

// Define the SignupPage component
const SignupPage = () => {
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('weak');
  const [submissionAttempts, setSubmissionAttempts] = useState([]);

  const navigate = useNavigate();

  // Validate field on blur or after touch
  const validateField = (name, value) => {
    let validation;

    switch (name) {
      case 'name':
        validation = validateName(value);
        break;
      case 'email':
        validation = validateEmail(value);
        break;
      case 'password':
        validation = validatePassword(value);
        if (validation.strength) {
          setPasswordStrength(validation.strength);
        }
        // Re-validate confirm password if it has been touched
        if (touched.confirmPassword && signupData.confirmPassword) {
          const confirmValidation = validatePasswordMatch(value, signupData.confirmPassword);
          setErrors(prev => ({ ...prev, confirmPassword: confirmValidation.error }));
        }
        break;
      case 'confirmPassword':
        validation = validatePasswordMatch(signupData.password, value);
        break;
      default:
        validation = { isValid: true, error: '' };
    }

    setErrors(prev => ({ ...prev, [name]: validation.error }));
    return validation.isValid;
  };

  // Handle input change with real-time validation for touched fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSignupData(prev => ({
      ...prev,
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
      signupData.name &&
      signupData.email &&
      signupData.password &&
      signupData.confirmPassword &&
      !errors.name &&
      !errors.email &&
      !errors.password &&
      !errors.confirmPassword
    );
  };

  // Rate limiting check
  const checkRateLimit = () => {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;

    // Filter attempts from last minute
    const recentAttempts = submissionAttempts.filter(time => time > oneMinuteAgo);

    if (recentAttempts.length >= 3) {
      toast.warning('Too many signup attempts. Please wait a minute before trying again.');
      return false;
    }

    setSubmissionAttempts([...recentAttempts, now]);
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const nameValid = validateField('name', signupData.name);
    const emailValid = validateField('email', signupData.email);
    const passwordValid = validateField('password', signupData.password);
    const confirmValid = validateField('confirmPassword', signupData.confirmPassword);

    // Mark all fields as touched
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    // If any validation fails, stop submission
    if (!nameValid || !emailValid || !passwordValid || !confirmValid) {
      toast.error('Please fix all validation errors before submitting.');
      return;
    }

    // Check rate limiting
    if (!checkRateLimit()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(`${API_URL}/signup`, {
        name: signupData.name,
        email: signupData.email,
        password: signupData.password,
        confirmPassword: signupData.confirmPassword,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) {
        console.log('Registration successful');
        toast.success('Registration successful');
        localStorage.setItem("userInfo", JSON.stringify(response.data._id));
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Handle validation errors from backend
        if (error.response.data.errors) {
          const backendErrors = {};
          error.response.data.errors.forEach(err => {
            backendErrors[err.field] = err.message;
          });
          setErrors(prev => ({ ...prev, ...backendErrors }));
          toast.error('Please fix the validation errors.');
        } else {
          toast.error('Invalid data provided.');
        }
      } else if (error.response && error.response.status === 409) {
        setErrors(prev => ({ ...prev, email: 'Email already registered' }));
        toast.error('Email already registered');
      } else {
        console.error('Error during registration', error);
        toast.error('Error during registration. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get input class based on validation state
  const getInputClass = (fieldName) => {
    if (!touched[fieldName]) return '';
    if (errors[fieldName]) return 'input-error';
    if (signupData[fieldName]) return 'input-success';
    return '';
  };

  return (
    <div className="main-content" style={{ color: 'white', marginTop: '60px' }}>
      <div className="left-column">
        <h1>500+ FREE Mock Tests for All Govt. Exams</h1>
        <h2>Attempt 500+ Free Mock tests for Bank, SSC, Railways, Regulatory, UPSC, Defence, Teaching, Railways Exams and more</h2>
      </div>
      <div className="right-column">
        <h2>Signup Form</h2>
        <form onSubmit={handleSubmit} className={isSubmitting ? 'form-loading' : ''}>
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
              disabled={isSubmitting}
              className={getInputClass('name')}
              aria-invalid={touched.name && errors.name ? 'true' : 'false'}
              aria-describedby={errors.name ? 'name-error' : undefined}
              required
            />
            {touched.name && errors.name && (
              <div
                id="name-error"
                className="error-message"
                role="alert"
                aria-live="polite"
              >
                {errors.name}
              </div>
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
              value={signupData.password}
              onChange={handleInputChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
              className={getInputClass('password')}
              aria-invalid={touched.password && errors.password ? 'true' : 'false'}
              aria-describedby={errors.password ? 'password-error' : 'password-strength'}
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
            {touched.password && !errors.password && signupData.password && (
              <div className="password-strength-container">
                <span
                  id="password-strength"
                  className={`password-strength-indicator password-strength-${passwordStrength}`}
                >
                  Strength: {passwordStrength.charAt(0).toUpperCase() + passwordStrength.slice(1)}
                </span>
              </div>
            )}

            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm Password"
              id="confirmPassword"
              name="confirmPassword"
              value={signupData.confirmPassword}
              onChange={handleInputChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
              className={getInputClass('confirmPassword')}
              aria-invalid={touched.confirmPassword && errors.confirmPassword ? 'true' : 'false'}
              aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
              required
            />
            {touched.confirmPassword && errors.confirmPassword && (
              <div
                id="confirm-password-error"
                className="error-message"
                role="alert"
                aria-live="polite"
              >
                {errors.confirmPassword}
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
                Signing Up...
                <span className="loading-spinner"></span>
              </>
            ) : (
              'Sign Up'
            )}
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

