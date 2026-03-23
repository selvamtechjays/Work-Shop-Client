import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../../utils/api';
import FormField from '../../components/form/FormField';
import Input from '../../components/form/Input';
import PasswordInput from '../../components/form/PasswordInput';
import Button from '../../components/form/Button';
import useFormValidation from '../../hooks/useFormValidation';
import { validateEmail, validatePassword } from '../../utils/validation';
import '../../styles/auth.css';
import '../../styles/components.css';

/**
 * Login page component with modern design and form validation
 */
const LoginPage = () => {
  const navigate = useNavigate();

  // Define validation rules for login form
  const validationRules = {
    email: validateEmail,
    password: validatePassword,
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
    { email: '', password: '' },
    validationRules
  );

  // Handle form submission
  const onSubmit = async (formValues) => {
    try {
      const response = await axios.post(`${API_URL}/login`, formValues, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        console.log('Login successful');
        toast.success('Login Successfully');
        const { _id, email } = response.data.user;

        // Creating an object with user ID and email
        const userInfo = { userId: _id, userEmail: email };

        // Saving the userInfo object into localStorage
        localStorage.setItem('userInfo', JSON.stringify(userInfo));

        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      } else {
        console.error('Login failed');
        toast.error('Login failed. Please try again.');
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        console.error('User already exists');
        toast.error('User already exists');
      } else {
        console.error('Error during login', error);
        toast.error('Error during login. Please try again later.');
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

      {/* Right Column - Login Form */}
      <div className="auth-right">
        <div className="auth-form-wrapper">
          <h2 className="auth-title">Login</h2>
          <form className="auth-form" onSubmit={handleSubmit(onSubmit)} aria-label="Login form">
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
                placeholder="Enter your password"
                error={touched.password ? errors.password : ''}
                autoComplete="current-password"
              />
            </FormField>

            <Button
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
              fullWidth
              variant="primary"
            >
              Login
            </Button>

            <div className="auth-links">
              <p className="auth-text">
                New Here?{' '}
                <Link to="/signup" className="auth-link">
                  Sign Up
                </Link>
              </p>
              <p className="auth-text">
                <Link to="/forgetPassword" className="auth-link">
                  Forget Password?
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
