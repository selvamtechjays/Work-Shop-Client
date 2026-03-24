import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { User, Mail, Lock } from 'lucide-react';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import PasswordStrength from '../../components/PasswordStrength/PasswordStrength';
import PasswordToggle from '../../components/PasswordToggle/PasswordToggle';
import { validateEmail, validatePassword, validateName, validatePasswordMatch } from '../../utils/validation';
import { API_URL } from '../../utils/api';
import styles from './signup-page.module.css';

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

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const navigate = useNavigate();

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({
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

    validateField(name, signupData[name]);
  };

  // Validate individual field
  const validateField = (fieldName, value) => {
    let validationResult = { valid: true, error: '' };

    switch (fieldName) {
      case 'name':
        validationResult = validateName(value);
        break;
      case 'email':
        validationResult = validateEmail(value);
        break;
      case 'password':
        validationResult = validatePassword(value);
        break;
      case 'confirmPassword':
        validationResult = validatePasswordMatch(signupData.password, value);
        break;
      default:
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [fieldName]: validationResult.error,
    }));

    return validationResult.valid;
  };

  // Check if form is valid
  const isFormValid = () => {
    const { name, email, password, confirmPassword } = signupData;

    // Check if all fields are filled
    if (!name || !email || !password || !confirmPassword) {
      return false;
    }

    // Check if there are any errors
    if (errors.name || errors.email || errors.password || errors.confirmPassword) {
      return false;
    }

    // Validate all fields
    const nameValid = validateName(name).valid;
    const emailValid = validateEmail(email).valid;
    const passwordValidation = validatePassword(password);
    const confirmValid = validatePasswordMatch(password, confirmPassword).valid;

    // Password must be at least medium strength
    return nameValid && emailValid && passwordValidation.valid && confirmValid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    // Validate all fields
    const nameValid = validateField('name', signupData.name);
    const emailValid = validateField('email', signupData.email);
    const passwordValid = validateField('password', signupData.password);
    const confirmValid = validateField('confirmPassword', signupData.confirmPassword);

    if (!nameValid || !emailValid || !passwordValid || !confirmValid) {
      return;
    }

    setIsLoading(true);
    setApiError('');

    try {
      const response = await axios.post(
        `${API_URL}/signup`,
        {
          name: signupData.name,
          email: signupData.email,
          password: signupData.password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 201) {
        toast.success('Registration successful');
        localStorage.setItem('userInfo', JSON.stringify(response.data._id));
        // Navigate immediately without delay
        navigate('/dashboard');
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setApiError('Email already registered. Please sign in.');
        toast.error('Email already registered. Please sign in.');
      } else {
        setApiError('Registration failed. Please try again.');
        toast.error('Registration failed. Please try again.');
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
          <h2 className={styles.title}>Create Your Account</h2>
          <p className={styles.subtitle}>Join thousands of learners preparing for govt exams</p>

          <form onSubmit={handleSubmit} className={styles.form} role="form" aria-label="Signup form">
            <Input
              type="text"
              name="name"
              value={signupData.name}
              onChange={handleInputChange}
              onBlur={handleBlur}
              label="Full Name"
              placeholder="Enter your full name"
              icon={<User size={20} />}
              error={touched.name ? errors.name : ''}
              required
              autoFocus
              autoComplete="name"
            />

            <Input
              type="email"
              name="email"
              value={signupData.email}
              onChange={handleInputChange}
              onBlur={handleBlur}
              label="Email Address"
              placeholder="Enter your email"
              icon={<Mail size={20} />}
              error={touched.email ? errors.email : ''}
              required
              autoComplete="email"
            />

            <div className={styles.passwordWrapper}>
              <Input
                type={passwordVisible ? 'text' : 'password'}
                name="password"
                value={signupData.password}
                onChange={handleInputChange}
                onBlur={handleBlur}
                label="Password"
                placeholder="Create a strong password"
                icon={<Lock size={20} />}
                error={touched.password ? errors.password : ''}
                required
                autoComplete="new-password"
              />
              <div className={styles.passwordToggleWrapper}>
                <PasswordToggle
                  isVisible={passwordVisible}
                  onToggle={() => setPasswordVisible(!passwordVisible)}
                />
              </div>
              {signupData.password && <PasswordStrength password={signupData.password} />}
            </div>

            <div className={styles.passwordWrapper}>
              <Input
                type={confirmPasswordVisible ? 'text' : 'password'}
                name="confirmPassword"
                value={signupData.confirmPassword}
                onChange={handleInputChange}
                onBlur={handleBlur}
                label="Confirm Password"
                placeholder="Re-enter your password"
                icon={<Lock size={20} />}
                error={touched.confirmPassword ? errors.confirmPassword : ''}
                required
                autoComplete="new-password"
              />
              <div className={styles.passwordToggleWrapper}>
                <PasswordToggle
                  isVisible={confirmPasswordVisible}
                  onToggle={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                />
              </div>
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
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </Button>

            <p className={styles.loginLink}>
              Already have an account?{' '}
              <Link to="/" className={styles.link}>
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
