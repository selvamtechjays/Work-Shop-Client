import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import { SignUpPage } from './SignUpPage';

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

const renderSignUpPage = () => {
  return render(
    <BrowserRouter>
      <SignUpPage />
    </BrowserRouter>
  );
};

describe('SignUpPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should render signup form', () => {
    renderSignUpPage();

    expect(screen.getByText('Create your account')).toBeInTheDocument();
    expect(screen.getByText('Join us to get started')).toBeInTheDocument();
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  });

  it('should show validation errors for empty fields', async () => {
    renderSignUpPage();

    const submitButton = screen.getByRole('button', { name: /Sign Up/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });
  });

  it('should show validation error for short name', async () => {
    renderSignUpPage();

    const nameInput = screen.getByLabelText(/Name/i);
    fireEvent.change(nameInput, { target: { value: 'A' } });
    fireEvent.blur(nameInput);

    await waitFor(() => {
      expect(screen.getByText('Name must be at least 2 characters')).toBeInTheDocument();
    });
  });

  it('should show validation error for invalid email', async () => {
    renderSignUpPage();

    const emailInput = screen.getByLabelText(/Email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    });
  });

  it('should show validation error for short password', async () => {
    renderSignUpPage();

    const passwordInput = screen.getByLabelText(/Password/i);
    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.blur(passwordInput);

    await waitFor(() => {
      expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
    });
  });

  it('should display password strength indicator when typing password', async () => {
    renderSignUpPage();

    const passwordInput = screen.getByLabelText(/Password/i);
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    await waitFor(() => {
      const progressbar = screen.getByRole('progressbar');
      expect(progressbar).toBeInTheDocument();
    });
  });

  it('should handle successful signup', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      status: 201,
      data: {
        _id: '123',
      },
    });

    renderSignUpPage();

    const nameInput = screen.getByLabelText(/Name/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Sign Up/i });

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/signup'),
        { name: 'Test User', email: 'test@example.com', password: 'password123' },
        { headers: { 'Content-Type': 'application/json' } }
      );
    });
  });

  it('should display loading state during signup', async () => {
    mockedAxios.post.mockImplementationOnce(
      () => new Promise((resolve) => setTimeout(() => resolve({ status: 201, data: { _id: '123' } }), 100))
    );

    renderSignUpPage();

    const nameInput = screen.getByLabelText(/Name/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Sign Up/i });

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    expect(screen.getByText('Creating account...')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it('should redirect to dashboard if already authenticated', () => {
    localStorage.setItem('userInfo', JSON.stringify({ userId: '123', userEmail: 'test@example.com' }));

    renderSignUpPage();

    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('should render Sign In link', () => {
    renderSignUpPage();

    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });
});
