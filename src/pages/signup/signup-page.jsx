import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_URL } from '../../utils/api';
import FormField from '../../components/form/FormField';
import Input from '../../components/form/Input';
import PasswordInput from '../../components/form/PasswordInput';
import Button from '../../components/form/Button';
import useFormValidation from '../../hooks/useFormValidation';
import { validateName, validateEmail, validateSignupPassword } from '../../utils/validation';
import '../../styles/auth.css';
import '../../styles/components.css';

/**
 * Password strength indicator component
 */
const PasswordStrengthIndicator = ({ password }) => {
  const requirements = [
    { text: 'At least 8 characters', met: password.length >= 8 },
    { text: 'One uppercase letter', met: /[A-Z]/.test(password) },
    { text: 'One lowercase letter', met: /[a-z]/.test(password) },
    { text: 'One number', met: /[0-9]/.test(password) },
  ];

  return (
    <div className="password-strength">
      <p className="password-strength-title">Password must contain:</p>
      <ul className="password-requirements">
        {requirements.map((req, index) => (
          <li key={index} className={req.met ? 'met' : 'not-met'}>
            <span>{req.met ? '✓' : '○'}</span> {req.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

/**
 * Signup page component with modern design and form validation
 */
const SignupPage = () => {
  const navigate = useNavigate();

  // Define validation rules for signup form
  const validationRules = {
    name: validateName,
    email: validateEmail,
    password: validateSignupPassword,
  };

  // Initialize form validation hook
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useFormValidation(
    { name: '', email: '', password: '' },
    validationRules
  );

  // Handle form submission
  const onSubmit = async (formValues) => {
    try {
      const response = await axios.post(`${API_URL}/signup`, formValues, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) {
        console.log('Registration successful');
        toast.success('Registration successful');
        localStorage.setItem('userInfo', JSON.stringify(response.data._id));
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      } else {
        console.error('Registration failed');
        toast.error('Registration failed');
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error('User already exists');
        toast.error('User already exists');
      } else {
        console.error('Error during registration', error);
        toast.error('Error during registration');
      }
    }
  };

  return (
    <div className="auth-container">
      {/* Left Column - Promotional Content */}
      <div className="auth-left">
        <h1>500+ FREE Mock Tests for All Govt. Exams</h1>
        <h2>
          Attempt 500+ Free Mock tests for Bank, SSC, Railways, Regulatory, UPSC,
          Defence, Teaching, Railways Exams and more
        </h2>
      </div>

      {/* Right Column - Signup Form */}
      <div className="auth-right">
        <div className="auth-form-wrapper">
          <h2 className="auth-title">Sign Up</h2>
          <form className="auth-form" onSubmit={handleSubmit(onSubmit)} aria-label="Signup form">
            <FormField
              label="Name"
              htmlFor="name"
              required
              error={touched.name ? errors.name : ''}
            >
              <Input
                name="name"
                type="text"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter your name"
                error={touched.name ? errors.name : ''}
                autoComplete="name"
                ariaLabel="Full name"
              />
            </FormField>

            <FormField
              label="Email"
              htmlFor="email"
              required
              error={touched.email ? errors.email : ''}
            >
              <Input
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter your email"
                error={touched.email ? errors.email : ''}
                autoComplete="email"
                ariaLabel="Email address"
              />
            </FormField>

            <FormField
              label="Password"
              htmlFor="password"
              required
              error={touched.password ? errors.password : ''}
            >
              <PasswordInput
                name="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Create a password"
                error={touched.password ? errors.password : ''}
                autoComplete="new-password"
              />
            </FormField>

            {/* Password strength indicator */}
            {values.password && <PasswordStrengthIndicator password={values.password} />}

            <Button
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
              fullWidth
              variant="primary"
            >
              Sign Up
            </Button>

            <div className="auth-links">
              <p className="auth-text">
                Already Have an Account?{' '}
                <Link to="/" className="auth-link">
                  Log In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SignupPage;

