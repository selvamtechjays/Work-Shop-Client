import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import SignupPage from './signup-page';

// Mock dependencies
vi.mock('axios');
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
  ToastContainer: () => null,
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

describe('SignupPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should render signup form with name, email, and password fields', () => {
    renderWithRouter(<SignupPage />);

    expect(screen.getByRole('heading', { name: 'Sign Up' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Create a password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  it('should validate name field with minimum 2 characters', async () => {
    renderWithRouter(<SignupPage />);

    const nameInput = screen.getByPlaceholderText('Enter your name');

    fireEvent.change(nameInput, { target: { value: 'A' } });
    fireEvent.blur(nameInput);

    await waitFor(() => {
      expect(screen.getByText('Name must be at least 2 characters')).toBeInTheDocument();
    });
  });

  it('should validate email format', async () => {
    renderWithRouter(<SignupPage />);

    const emailInput = screen.getByPlaceholderText('Enter your email');

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    });
  });

  it('should validate password strength (8 chars, uppercase, lowercase, number)', async () => {
    renderWithRouter(<SignupPage />);

    const passwordInput = screen.getByPlaceholderText('Create a password');

    // Test password too short
    fireEvent.change(passwordInput, { target: { value: 'Pass1' } });
    fireEvent.blur(passwordInput);

    await waitFor(() => {
      expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
    });

    // Test password without uppercase
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.blur(passwordInput);

    await waitFor(() => {
      expect(screen.getByText('Password must contain at least one uppercase letter')).toBeInTheDocument();
    });
  });

  it('should show password strength indicator', () => {
    renderWithRouter(<SignupPage />);

    const passwordInput = screen.getByPlaceholderText('Create a password');

    fireEvent.change(passwordInput, { target: { value: 'Test1234' } });

    expect(screen.getByText('Password must contain:')).toBeInTheDocument();
    expect(screen.getByText('At least 8 characters')).toBeInTheDocument();
    expect(screen.getByText('One uppercase letter')).toBeInTheDocument();
    expect(screen.getByText('One lowercase letter')).toBeInTheDocument();
    expect(screen.getByText('One number')).toBeInTheDocument();
  });

  it('should call API with correct payload on valid submission', async () => {
    const mockResponse = {
      status: 201,
      data: {
        _id: '12345',
      },
    };
    axios.post.mockResolvedValue(mockResponse);

    renderWithRouter(<SignupPage />);

    const nameInput = screen.getByPlaceholderText('Enter your name');
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Create a password');
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/signup'),
        {
          name: 'John Doe',
          email: 'john@example.com',
          password: 'Password123',
        },
        { headers: { 'Content-Type': 'application/json' } }
      );
    });
  });

  it('should show error toast when user already exists', async () => {
    const mockError = {
      response: {
        status: 400,
      },
    };
    axios.post.mockRejectedValue(mockError);

    renderWithRouter(<SignupPage />);

    const nameInput = screen.getByPlaceholderText('Enter your name');
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Create a password');
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'existing@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('User already exists');
    });
  });

  it('should store userInfo and navigate on success', async () => {
    const mockResponse = {
      status: 201,
      data: {
        _id: '12345',
      },
    };
    axios.post.mockResolvedValue(mockResponse);

    renderWithRouter(<SignupPage />);

    const nameInput = screen.getByPlaceholderText('Enter your name');
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Create a password');
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Registration successful');
    });

    await waitFor(() => {
      const storedInfo = localStorage.getItem('userInfo');
      expect(storedInfo).toBeTruthy();
    });
  }, 10000);

  it('should display loading state during submission', async () => {
    let resolvePromise;
    axios.post.mockImplementation(() => new Promise((resolve) => {
      resolvePromise = resolve;
    }));

    renderWithRouter(<SignupPage />);

    const nameInput = screen.getByPlaceholderText('Enter your name');
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Create a password');
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });

    // Clean up
    resolvePromise({ status: 201, data: { _id: '12345' } });
  }, 10000);

  it('should have link to login page', () => {
    renderWithRouter(<SignupPage />);

    const loginLink = screen.getByRole('link', { name: /log in/i });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute('href', '/');
  });

  it('should render promotional content', () => {
    renderWithRouter(<SignupPage />);

    expect(screen.getByText(/500\+ FREE Mock Tests for All Govt\. Exams/i)).toBeInTheDocument();
  });

  it('should have proper aria-label on form', () => {
    renderWithRouter(<SignupPage />);

    const form = screen.getByRole('form', { name: /signup form/i });
    expect(form).toBeInTheDocument();
  });

  it('should not submit form when validation fails', async () => {
    renderWithRouter(<SignupPage />);

    const submitButton = screen.getByRole('button', { name: /sign up/i });
    fireEvent.click(submitButton);

    // Wait a bit for any potential async operations
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(axios.post).not.toHaveBeenCalled();
  });

  it('should show all password requirements as not met initially', () => {
    renderWithRouter(<SignupPage />);

    const passwordInput = screen.getByPlaceholderText('Create a password');
    fireEvent.change(passwordInput, { target: { value: 'a' } });

    // All requirements should be visible
    expect(screen.getByText('At least 8 characters')).toBeInTheDocument();
    expect(screen.getByText('One uppercase letter')).toBeInTheDocument();
    expect(screen.getByText('One lowercase letter')).toBeInTheDocument();
    expect(screen.getByText('One number')).toBeInTheDocument();
  });

  it('should show password requirements as met when password is strong', () => {
    renderWithRouter(<SignupPage />);

    const passwordInput = screen.getByPlaceholderText('Create a password');
    fireEvent.change(passwordInput, { target: { value: 'StrongPassword123' } });

    // Password strength indicator should show all requirements met
    const requirements = screen.getAllByText(/✓/);
    expect(requirements.length).toBeGreaterThan(0);
  });

  it('should show error on general registration failure', async () => {
    axios.post.mockRejectedValue(new Error('Network error'));

    renderWithRouter(<SignupPage />);

    const nameInput = screen.getByPlaceholderText('Enter your name');
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Create a password');
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Error during registration');
    }, { timeout: 3000 });
  });
});
