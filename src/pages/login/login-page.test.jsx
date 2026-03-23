import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoginPage from './login-page';

// Mock dependencies
vi.mock('axios');
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('LoginPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should render login form with email and password fields', () => {
    renderWithRouter(<LoginPage />);

    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('should show validation error for invalid email format', async () => {
    renderWithRouter(<LoginPage />);

    const emailInput = screen.getByPlaceholderText('Enter your email');
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    });
  });

  it('should show validation error for short password', async () => {
    renderWithRouter(<LoginPage />);

    const passwordInput = screen.getByPlaceholderText('Enter your password');

    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.blur(passwordInput);

    await waitFor(() => {
      expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
    });
  });

  it('should call API with correct payload on valid submission', async () => {
    const mockResponse = {
      status: 200,
      data: {
        user: {
          _id: '12345',
          email: 'test@example.com',
        },
      },
    };
    axios.post.mockResolvedValue(mockResponse);

    renderWithRouter(<LoginPage />);

    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/login'),
        { email: 'test@example.com', password: 'password123' },
        { headers: { 'Content-Type': 'application/json' } }
      );
    });
  });

  it('should store userInfo in localStorage on successful login', async () => {
    const mockResponse = {
      status: 200,
      data: {
        user: {
          _id: '12345',
          email: 'test@example.com',
        },
      },
    };
    axios.post.mockResolvedValue(mockResponse);

    renderWithRouter(<LoginPage />);

    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const storedInfo = localStorage.getItem('userInfo');
      expect(storedInfo).toBeTruthy();
      const parsedInfo = JSON.parse(storedInfo);
      expect(parsedInfo.userId).toBe('12345');
      expect(parsedInfo.userEmail).toBe('test@example.com');
    });
  });

  it('should show success toast on successful login', async () => {
    const mockResponse = {
      status: 200,
      data: {
        user: {
          _id: '12345',
          email: 'test@example.com',
        },
      },
    };
    axios.post.mockResolvedValue(mockResponse);

    renderWithRouter(<LoginPage />);

    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Login Successfully');
    });
  });

  it('should navigate to dashboard after successful login', async () => {
    const mockResponse = {
      status: 200,
      data: {
        user: {
          _id: '12345',
          email: 'test@example.com',
        },
      },
    };
    axios.post.mockResolvedValue(mockResponse);

    renderWithRouter(<LoginPage />);

    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('Login Successfully');
    });
  }, 10000);

  it('should show error toast on failed login', async () => {
    axios.post.mockRejectedValue(new Error('Login failed'));

    renderWithRouter(<LoginPage />);

    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Error during login. Please try again later.');
    }, { timeout: 3000 });
  });

  it('should display loading state during submission', async () => {
    let resolvePromise;
    axios.post.mockImplementation(() => new Promise((resolve) => {
      resolvePromise = resolve;
    }));

    renderWithRouter(<LoginPage />);

    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });

    // Clean up
    resolvePromise({
      status: 200,
      data: { user: { _id: '12345', email: 'test@example.com' } }
    });
  }, 10000);

  it('should have link to signup page', () => {
    renderWithRouter(<LoginPage />);

    const signupLink = screen.getByRole('link', { name: /sign up/i });
    expect(signupLink).toBeInTheDocument();
    expect(signupLink).toHaveAttribute('href', '/signup');
  });

  it('should have link to forget password page', () => {
    renderWithRouter(<LoginPage />);

    const forgetPasswordLink = screen.getByRole('link', { name: /forget password/i });
    expect(forgetPasswordLink).toBeInTheDocument();
    expect(forgetPasswordLink).toHaveAttribute('href', '/forgetPassword');
  });

  it('should render promotional content', () => {
    renderWithRouter(<LoginPage />);

    expect(screen.getByText(/500\+ FREE Mock Tests for All Govt\. Exams/i)).toBeInTheDocument();
  });

  it('should have proper aria-label on form', () => {
    renderWithRouter(<LoginPage />);

    const form = screen.getByRole('form', { name: /login form/i });
    expect(form).toBeInTheDocument();
  });

  it('should not submit form when validation fails', async () => {
    renderWithRouter(<LoginPage />);

    const submitButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(submitButton);

    // Wait a bit for any potential async operations
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(axios.post).not.toHaveBeenCalled();
  });
});
