import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
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
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Helper function to render with router
const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

// Helper to get password field by name attribute
const getPasswordField = (container) => container.querySelector('input[name="password"]');
const getConfirmPasswordField = (container) => container.querySelector('input[name="confirmPassword"]');

describe('SignupPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render all form fields', () => {
      const { container } = renderWithRouter(<SignupPage />);
      expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
      expect(getPasswordField(container)).toBeInTheDocument();
      expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
    });

    it('should render the title and subtitle', () => {
      renderWithRouter(<SignupPage />);
      expect(screen.getByText('Create Your Account')).toBeInTheDocument();
      expect(screen.getByText(/Join thousands of learners/i)).toBeInTheDocument();
    });

    it('should render promotional content', () => {
      renderWithRouter(<SignupPage />);
      expect(screen.getAllByText(/500\+ FREE Mock Tests/i)[0]).toBeInTheDocument();
    });

    it('should render submit button', () => {
      renderWithRouter(<SignupPage />);
      expect(screen.getByRole('button', { name: /Sign Up/i })).toBeInTheDocument();
    });

    it('should render link to login page', () => {
      renderWithRouter(<SignupPage />);
      expect(screen.getByText(/Already have an account/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Sign in/i })).toBeInTheDocument();
    });

    it('should have form with proper role', () => {
      renderWithRouter(<SignupPage />);
      const form = screen.getByRole('form');
      expect(form).toHaveAttribute('aria-label', 'Signup form');
    });
  });

  describe('Input Handling', () => {
    it('should update name field when typing', () => {
      renderWithRouter(<SignupPage />);
      const nameInput = screen.getByLabelText(/Full Name/i);
      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      expect(nameInput).toHaveValue('John Doe');
    });

    it('should update email field when typing', () => {
      renderWithRouter(<SignupPage />);
      const emailInput = screen.getByLabelText(/Email Address/i);
      fireEvent.change(emailInput, { target: { value: 'john@test.com' } });
      expect(emailInput).toHaveValue('john@test.com');
    });

    it('should update password field when typing', () => {
      const { container } = renderWithRouter(<SignupPage />);
      const passwordInput = getPasswordField(container);
      fireEvent.change(passwordInput, { target: { value: 'Test@1234' } });
      expect(passwordInput).toHaveValue('Test@1234');
    });

    it('should update confirm password field when typing', () => {
      renderWithRouter(<SignupPage />);
      const confirmInput = screen.getByLabelText(/Confirm Password/i);
      fireEvent.change(confirmInput, { target: { value: 'Test@1234' } });
      expect(confirmInput).toHaveValue('Test@1234');
    });
  });

  describe('Validation', () => {
    it('should show error for invalid email on blur', async () => {
      renderWithRouter(<SignupPage />);
      const emailInput = screen.getByLabelText(/Email Address/i);
      fireEvent.change(emailInput, { target: { value: 'notanemail' } });
      fireEvent.blur(emailInput);
      await waitFor(() => {
        expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument();
      });
    });

    it('should show error for empty name on blur', async () => {
      renderWithRouter(<SignupPage />);
      const nameInput = screen.getByLabelText(/Full Name/i);
      fireEvent.change(nameInput, { target: { value: '' } });
      fireEvent.blur(nameInput);
      await waitFor(() => {
        expect(screen.getByText(/Name is required/i)).toBeInTheDocument();
      });
    });

    it('should show error for short name on blur', async () => {
      renderWithRouter(<SignupPage />);
      const nameInput = screen.getByLabelText(/Full Name/i);
      fireEvent.change(nameInput, { target: { value: 'A' } });
      fireEvent.blur(nameInput);
      await waitFor(() => {
        expect(screen.getByText(/at least 2 characters/i)).toBeInTheDocument();
      });
    });

    it('should show error when passwords do not match', async () => {
      const { container } = renderWithRouter(<SignupPage />);
      const passwordInput = getPasswordField(container);
      const confirmInput = screen.getByLabelText(/Confirm Password/i);

      fireEvent.change(passwordInput, { target: { value: 'Test@1234' } });
      fireEvent.change(confirmInput, { target: { value: 'Different123' } });
      fireEvent.blur(confirmInput);

      await waitFor(() => {
        expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
      });
    });

    it('should clear error when user starts typing after validation', async () => {
      renderWithRouter(<SignupPage />);
      const emailInput = screen.getByLabelText(/Email Address/i);

      fireEvent.change(emailInput, { target: { value: 'notanemail' } });
      fireEvent.blur(emailInput);

      await waitFor(() => {
        expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument();
      });

      fireEvent.change(emailInput, { target: { value: 'john@test.com' } });

      await waitFor(() => {
        expect(screen.queryByText(/Please enter a valid email address/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Password Strength', () => {
    it('should show password strength indicator when password is entered', () => {
      const { container } = renderWithRouter(<SignupPage />);
      const passwordInput = getPasswordField(container);
      fireEvent.change(passwordInput, { target: { value: 'Test@1234' } });
      expect(screen.getByText('Strong')).toBeInTheDocument();
    });

    it('should not show password strength when password is empty', () => {
      renderWithRouter(<SignupPage />);
      expect(screen.queryByText('Weak')).not.toBeInTheDocument();
      expect(screen.queryByText('Medium')).not.toBeInTheDocument();
      expect(screen.queryByText('Strong')).not.toBeInTheDocument();
    });
  });

  describe('Password Visibility Toggle', () => {
    it('should toggle password visibility when eye icon is clicked', () => {
      const { container } = renderWithRouter(<SignupPage />);
      const passwordInput = getPasswordField(container);
      const toggleButtons = screen.getAllByRole('button', { name: /password/i });
      const passwordToggle = toggleButtons[0];

      expect(passwordInput).toHaveAttribute('type', 'password');

      fireEvent.click(passwordToggle);
      expect(passwordInput).toHaveAttribute('type', 'text');

      fireEvent.click(passwordToggle);
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('should toggle confirm password visibility independently', () => {
      renderWithRouter(<SignupPage />);
      const confirmInput = screen.getByLabelText(/Confirm Password/i);
      const toggleButtons = screen.getAllByRole('button', { name: /password/i });
      const confirmToggle = toggleButtons[1];

      expect(confirmInput).toHaveAttribute('type', 'password');

      fireEvent.click(confirmToggle);
      expect(confirmInput).toHaveAttribute('type', 'text');

      fireEvent.click(confirmToggle);
      expect(confirmInput).toHaveAttribute('type', 'password');
    });
  });

  describe('Form Submission', () => {
    it('should disable submit button when form is invalid', () => {
      renderWithRouter(<SignupPage />);
      const submitButton = screen.getByRole('button', { name: /Sign Up/i });
      expect(submitButton).toBeDisabled();
    });

    it('should enable submit button when all fields are valid', async () => {
      const { container } = renderWithRouter(<SignupPage />);
      const nameInput = screen.getByLabelText(/Full Name/i);
      const emailInput = screen.getByLabelText(/Email Address/i);
      const passwordInput = getPasswordField(container);
      const confirmInput = screen.getByLabelText(/Confirm Password/i);

      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'john@test.com' } });
      fireEvent.change(passwordInput, { target: { value: 'Test@1234' } });
      fireEvent.change(confirmInput, { target: { value: 'Test@1234' } });

      await waitFor(() => {
        const submitButton = screen.getByRole('button', { name: /Sign Up/i });
        expect(submitButton).not.toBeDisabled();
      });
    });

    it('should show loading state during submission', async () => {
      axios.post.mockImplementation(() => new Promise(() => {}));

      const { container } = renderWithRouter(<SignupPage />);

      fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'john@test.com' } });
      fireEvent.change(getPasswordField(container), { target: { value: 'Test@1234' } });
      fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'Test@1234' } });

      const submitButton = screen.getByRole('button', { name: /Sign Up/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Creating Account...')).toBeInTheDocument();
      });
    });

    it('should call API with correct data on successful submission', async () => {
      const mockResponse = { status: 201, data: { _id: '12345' } };
      axios.post.mockResolvedValue(mockResponse);

      const { container } = renderWithRouter(<SignupPage />);

      fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'john@test.com' } });
      fireEvent.change(getPasswordField(container), { target: { value: 'Test@1234' } });
      fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'Test@1234' } });

      const submitButton = screen.getByRole('button', { name: /Sign Up/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          expect.stringContaining('/signup'),
          {
            name: 'John Doe',
            email: 'john@test.com',
            password: 'Test@1234',
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
      });
    });

    it('should show success toast and navigate on successful signup', async () => {
      const mockResponse = { status: 201, data: { _id: '12345' } };
      axios.post.mockResolvedValue(mockResponse);

      const { container } = renderWithRouter(<SignupPage />);

      fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'john@test.com' } });
      fireEvent.change(getPasswordField(container), { target: { value: 'Test@1234' } });
      fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'Test@1234' } });

      const submitButton = screen.getByRole('button', { name: /Sign Up/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('Registration successful');
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
        expect(localStorage.getItem('userInfo')).toBeTruthy();
      });
    });

    it('should show error message for duplicate email (400 error)', async () => {
      axios.post.mockRejectedValue({
        response: { status: 400 },
      });

      const { container } = renderWithRouter(<SignupPage />);

      fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'existing@test.com' } });
      fireEvent.change(getPasswordField(container), { target: { value: 'Test@1234' } });
      fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'Test@1234' } });

      const submitButton = screen.getByRole('button', { name: /Sign Up/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Email already registered/i)).toBeInTheDocument();
        expect(toast.error).toHaveBeenCalledWith('Email already registered. Please sign in.');
      });
    });

    it('should show generic error message for network errors', async () => {
      axios.post.mockRejectedValue(new Error('Network error'));

      const { container } = renderWithRouter(<SignupPage />);

      fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'john@test.com' } });
      fireEvent.change(getPasswordField(container), { target: { value: 'Test@1234' } });
      fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'Test@1234' } });

      const submitButton = screen.getByRole('button', { name: /Sign Up/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Registration failed/i)).toBeInTheDocument();
        expect(toast.error).toHaveBeenCalledWith('Registration failed. Please try again.');
      });
    });

    it('should clear API error when user changes input', async () => {
      axios.post.mockRejectedValue({
        response: { status: 400 },
      });

      const { container } = renderWithRouter(<SignupPage />);

      fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'existing@test.com' } });
      fireEvent.change(getPasswordField(container), { target: { value: 'Test@1234' } });
      fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'Test@1234' } });

      fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

      await waitFor(() => {
        expect(screen.getByText(/Email already registered/i)).toBeInTheDocument();
      });

      fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'newemail@test.com' } });

      await waitFor(() => {
        expect(screen.queryByText(/Email already registered/i)).not.toBeInTheDocument();
      });
    });

    it('should prevent submission with invalid form', async () => {
      const { container } = renderWithRouter(<SignupPage />);

      fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'A' } });
      fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'notanemail' } });
      fireEvent.change(getPasswordField(container), { target: { value: 'weak' } });
      fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'different' } });

      const submitButton = screen.getByRole('button', { name: /Sign Up/i });
      fireEvent.click(submitButton);

      expect(axios.post).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper autocomplete attributes', () => {
      const { container } = renderWithRouter(<SignupPage />);
      expect(screen.getByLabelText(/Full Name/i)).toHaveAttribute('autocomplete', 'name');
      expect(screen.getByLabelText(/Email Address/i)).toHaveAttribute('autocomplete', 'email');
      expect(getPasswordField(container)).toHaveAttribute('autocomplete', 'new-password');
      expect(screen.getByLabelText(/Confirm Password/i)).toHaveAttribute('autocomplete', 'new-password');
    });

    it('should set autofocus on name field', () => {
      renderWithRouter(<SignupPage />);
      const nameInput = screen.getByLabelText(/Full Name/i);
      expect(nameInput).toHaveFocus();
    });

    it('should have aria-label on form', () => {
      renderWithRouter(<SignupPage />);
      const form = screen.getByRole('form');
      expect(form).toHaveAttribute('aria-label', 'Signup form');
    });

    it('should have role="alert" on API error message', async () => {
      axios.post.mockRejectedValue({
        response: { status: 400 },
      });

      const { container } = renderWithRouter(<SignupPage />);

      fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@test.com' } });
      fireEvent.change(getPasswordField(container), { target: { value: 'Test@1234' } });
      fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'Test@1234' } });
      fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

      await waitFor(() => {
        const errorElement = screen.getByText(/Email already registered/i);
        expect(errorElement).toHaveAttribute('role', 'alert');
      });
    });
  });

  describe('Navigation', () => {
    it('should have working link to login page', () => {
      renderWithRouter(<SignupPage />);
      const loginLink = screen.getByRole('link', { name: /Sign in/i });
      expect(loginLink).toHaveAttribute('href', '/');
    });
  });
});
