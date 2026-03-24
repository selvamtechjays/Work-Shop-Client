import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Mail, Lock } from 'lucide-react';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import PasswordToggle from '../../components/PasswordToggle/PasswordToggle';
import { validateEmail } from '../../utils/validation';
import { API_URL } from '../../utils/api';
import styles from './login-page.module.css';

const LoginPage = () => {
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

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const navigate = useNavigate();

  // Check localStorage for remember me preference on mount
  useEffect(() => {
    const savedRememberMe = localStorage.getItem('rememberMe');
    if (savedRememberMe === 'true') {
      setRememberMe(true);
    }
  }, []);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSigninData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }

    // Clear API error when user makes changes
    if (apiError) {
      setApiError('');
    }
  };

  // Handle field blur (validation)
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    if (name === 'email') {
      const validationResult = validateEmail(signinData.email);
      setErrors((prev) => ({
        ...prev,
        email: validationResult.error,
      }));
    }
  };

  // Check if form is valid
  const isFormValid = () => {
    const { email, password } = signinData;

    // Check if both fields are filled
    if (!email || !password) {
      return false;
    }

    // Check email format
    const emailValid = validateEmail(email).valid;

    return emailValid;
  };

  // Handle remember me checkbox
  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      email: true,
      password: true,
    });

    // Validate email
    const emailValidation = validateEmail(signinData.email);
    if (!emailValidation.valid) {
      setErrors((prev) => ({
        ...prev,
        email: emailValidation.error,
      }));
      return;
    }

    if (!signinData.password) {
      return;
    }

    setIsLoading(true);
    setApiError('');

    try {
      const response = await axios.post(
        `${API_URL}/login`,
        {
          email: signinData.email,
          password: signinData.password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        const { _id, email } = response.data.user;
        const userInfo = { userId: _id, userEmail: email };

        // Store user info
        localStorage.setItem('userInfo', JSON.stringify(userInfo));

        // Store remember me preference
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        } else {
          localStorage.removeItem('rememberMe');
        }

        toast.success('Login successful');
        // Navigate immediately without delay
        navigate('/dashboard');
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401 || error.response.status === 404) {
          setApiError('Invalid email or password');
          toast.error('Invalid email or password');
        } else if (error.response.status === 409) {
          setApiError('User already exists');
          toast.error('User already exists');
        } else {
          setApiError('Login failed. Please try again.');
          toast.error('Login failed. Please try again.');
        }
      } else {
        setApiError('Unable to connect. Please try again.');
        toast.error('Unable to connect. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftColumn}>
        <h1 className={styles.leftTitle}>500+ FREE Mock Tests for All Govt. Exams</h1>
        <h2 className={styles.leftSubtitle}>
          Attempt 500+ Free Mock tests for Bank, SSC, Railways, Regulatory, UPSC, Defence, Teaching, Railways Exams and more
        </h2>
      </div>
      <div className={styles.rightColumn}>
        <div className={styles.formCard}>
          <h2 className={styles.title}>Welcome Back</h2>
          <p className={styles.subtitle}>Sign in to continue your learning journey</p>

          <form onSubmit={handleSubmit} className={styles.form} role="form" aria-label="Login form">
            <Input
              type="email"
              name="email"
              value={signinData.email}
              onChange={handleInputChange}
              onBlur={handleBlur}
              label="Email Address"
              placeholder="Enter your email"
              icon={<Mail size={20} />}
              error={touched.email ? errors.email : ''}
              required
              autoFocus
              autoComplete="email"
            />

            <div className={styles.passwordWrapper}>
              <Input
                type={passwordVisible ? 'text' : 'password'}
                name="password"
                value={signinData.password}
                onChange={handleInputChange}
                onBlur={handleBlur}
                label="Password"
                placeholder="Enter your password"
                icon={<Lock size={20} />}
                error={touched.password ? errors.password : ''}
                required
                autoComplete="current-password"
              />
              <div className={styles.passwordToggleWrapper}>
                <PasswordToggle
                  isVisible={passwordVisible}
                  onToggle={() => setPasswordVisible(!passwordVisible)}
                />
              </div>
            </div>

            <div className={styles.rememberForgotContainer}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={handleRememberMeChange}
                  className={styles.checkbox}
                />
                <span>Remember me</span>
              </label>
              <Link to="/forgetPassword" className={styles.forgotLink}>
                Forgot password?
              </Link>
            </div>

            {apiError && (
              <div className={styles.apiError} role="alert">
                {apiError}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              disabled={!isFormValid() || isLoading}
              fullWidth
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>

            <p className={styles.signupLink}>
              New here?{' '}
              <Link to="/signup" className={styles.link}>
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
