import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../../utils/api';
import { AuthCard } from '../../components/auth/AuthCard';
import { FloatingLabelInput } from '../../components/auth/FloatingLabelInput';
import { PasswordStrengthIndicator } from '../../components/auth/PasswordStrengthIndicator';
import { AuthDivider } from '../../components/auth/AuthDivider';

export const SignUpPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: { name?: string; email?: string; password?: string } = {};

    if (!name) {
      newErrors.name = 'Name is required';
    } else if (name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/signup`,
        { name, email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.status === 201) {
        toast.success('Registration successful!');
        localStorage.setItem('userInfo', JSON.stringify(response.data._id));

        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      }
    } catch (error: any) {
      console.error('Signup error:', error);

      if (error.response) {
        if (error.response.status === 400) {
          toast.error('User already exists');
        } else {
          toast.error('Registration failed. Please try again.');
        }
      } else if (error.request) {
        toast.error('Connection failed. Please check your internet and retry.');
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleNameBlur = () => {
    if (name && name.length < 2) {
      setErrors((prev) => ({ ...prev, name: 'Name must be at least 2 characters' }));
    } else {
      setErrors((prev) => ({ ...prev, name: undefined }));
    }
  };

  const handleEmailBlur = () => {
    if (email && !validateEmail(email)) {
      setErrors((prev) => ({ ...prev, email: 'Please enter a valid email address' }));
    } else {
      setErrors((prev) => ({ ...prev, email: undefined }));
    }
  };

  const handlePasswordBlur = () => {
    if (password && password.length < 6) {
      setErrors((prev) => ({ ...prev, password: 'Password must be at least 6 characters' }));
    } else {
      setErrors((prev) => ({ ...prev, password: undefined }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 p-4">
      <AuthCard>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Create your account</h1>
            <p className="text-white/70">Join us to get started</p>
          </div>

          <form onSubmit={handleSubmit} aria-live="polite" noValidate>
            <FloatingLabelInput
              id="name"
              label="Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={handleNameBlur}
              error={errors.name}
              required
              autoComplete="name"
            />

            <FloatingLabelInput
              id="email"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={handleEmailBlur}
              error={errors.email}
              required
              autoComplete="email"
            />

            <FloatingLabelInput
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={handlePasswordBlur}
              error={errors.password}
              required
              autoComplete="new-password"
            />

            <PasswordStrengthIndicator password={password} />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full min-h-[44px] bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent mt-6"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating account...
                </span>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>

          <AuthDivider text="or continue with" />

          <div className="text-center">
            <p className="text-white/70 text-sm">
              Already have an account?{' '}
              <Link
                to="/"
                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>
      </AuthCard>
    </div>
  );
};

export default SignUpPage;
