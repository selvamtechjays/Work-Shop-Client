import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import { LoginPage } from './LoginPage';

// Mock axios
vi.mock('axios');
const mockedAxios = axios as any;

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock react-toastify
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const renderLoginPage = () => {
  return render(
    <BrowserRouter>
      <LoginPage />
    </BrowserRouter>
  );
};

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should render login form', () => {
    renderLoginPage();

    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  });

  it('should show validation errors for empty fields', async () => {
    renderLoginPage();

    const submitButton = screen.getByRole('button', { name: /Sign In/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });
  });

  it('should show validation error for invalid email', async () => {
    renderLoginPage();

    const emailInput = screen.getByLabelText(/Email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    });
  });

  it('should show validation error for short password', async () => {
    renderLoginPage();

    const passwordInput = screen.getByLabelText(/Password/i);
    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.blur(passwordInput);

    await waitFor(() => {
      expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
    });
  });

  it('should handle successful login', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      status: 200,
      data: {
        user: {
          _id: '123',
          email: 'test@example.com',
        },
      },
    });

    renderLoginPage();

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Sign In/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/login'),
        { email: 'test@example.com', password: 'password123' },
        { headers: { 'Content-Type': 'application/json' } }
      );
    });
  });

  it('should display loading state during login', async () => {
    mockedAxios.post.mockImplementationOnce(
      () => new Promise((resolve) => setTimeout(() => resolve({ status: 200, data: { user: { _id: '123', email: 'test@example.com' } } }), 100))
    );

    renderLoginPage();

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Sign In/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    expect(screen.getByText('Signing in...')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it('should redirect to dashboard if already authenticated', () => {
    localStorage.setItem('userInfo', JSON.stringify({ userId: '123', userEmail: 'test@example.com' }));

    renderLoginPage();

    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('should render Remember Me checkbox', () => {
    renderLoginPage();

    expect(screen.getByLabelText('Remember me for 30 days')).toBeInTheDocument();
  });

  it('should render Forgot Password link', () => {
    renderLoginPage();

    expect(screen.getByText('Forgot Password?')).toBeInTheDocument();
  });

  it('should render Sign Up link', () => {
    renderLoginPage();

    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });
});
