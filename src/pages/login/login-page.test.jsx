import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import MainContent from './login-page';

// Mock dependencies
vi.mock('axios');
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

vi.mock('../../utils/api', () => ({
  API_URL: 'http://test-api.com',
}));

const renderLoginPage = () => {
  return render(
    <BrowserRouter>
      <MainContent />
    </BrowserRouter>
  );
};

describe('Login Page - Validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should render the login form with all fields', () => {
      renderLoginPage();

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    it('should have submit button disabled initially', () => {
      renderLoginPage();

      const submitButton = screen.getByRole('button', { name: /login/i });
      expect(submitButton).toBeDisabled();
    });

    it('should not display error messages initially', () => {
      renderLoginPage();

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('should have proper ARIA attributes on inputs', () => {
      renderLoginPage();

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);

      expect(emailInput).toHaveAttribute('aria-invalid', 'false');
      expect(emailInput).toHaveAttribute('aria-describedby', 'email-error');
      expect(passwordInput).toHaveAttribute('aria-invalid', 'false');
      expect(passwordInput).toHaveAttribute('aria-describedby', 'password-error');
    });
  });

  describe('Email Validation', () => {
    it('should show error message for invalid email on blur (TS-LOGIN-001)', () => {
      renderLoginPage();

      const emailInput = screen.getByLabelText(/email/i);

      fireEvent.change(emailInput, { target: { value: 'notanemail' } });
      fireEvent.blur(emailInput);

      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    });

    it('should add input-error class for invalid email', () => {
      renderLoginPage();

      const emailInput = screen.getByLabelText(/email/i);

      fireEvent.change(emailInput, { target: { value: 'invalid' } });
      fireEvent.blur(emailInput);

      expect(emailInput).toHaveClass('input-error');
    });

    it('should show green border for valid email (TS-LOGIN-002)', () => {
      renderLoginPage();

      const emailInput = screen.getByLabelText(/email/i);

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.blur(emailInput);

      expect(emailInput).toHaveClass('input-success');
      expect(screen.queryByText('Please enter a valid email address')).not.toBeInTheDocument();
    });

    it('should set aria-invalid to true for invalid email', () => {
      renderLoginPage();

      const emailInput = screen.getByLabelText(/email/i);

      fireEvent.change(emailInput, { target: { value: 'invalid' } });
      fireEvent.blur(emailInput);

      expect(emailInput).toHaveAttribute('aria-invalid', 'true');
    });

    it('should show error for empty email on blur', () => {
      renderLoginPage();

      const emailInput = screen.getByLabelText(/email/i);

      fireEvent.blur(emailInput);

      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });

    it('should validate email formats correctly', () => {
      renderLoginPage();

      const emailInput = screen.getByLabelText(/email/i);

      // Test various invalid formats
      const invalidEmails = ['test@', '@example.com', 'test@domain', 'test @example.com'];

      invalidEmails.forEach(email => {
        fireEvent.change(emailInput, { target: { value: email } });
        fireEvent.blur(emailInput);
        expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
      });
    });
  });

  describe('Password Validation', () => {
    it('should show error for password less than 8 characters (TS-LOGIN-003)', () => {
      renderLoginPage();

      const passwordInput = screen.getByLabelText(/password/i);

      fireEvent.change(passwordInput, { target: { value: 'Pass1' } });
      fireEvent.blur(passwordInput);

      expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
    });

    it('should not show error for valid password (TS-LOGIN-004)', () => {
      renderLoginPage();

      const passwordInput = screen.getByLabelText(/password/i);

      fireEvent.change(passwordInput, { target: { value: 'Password123' } });
      fireEvent.blur(passwordInput);

      expect(passwordInput).toHaveClass('input-success');
      expect(screen.queryByText('Password must be at least 8 characters')).not.toBeInTheDocument();
    });

    it('should add input-error class for invalid password', () => {
      renderLoginPage();

      const passwordInput = screen.getByLabelText(/password/i);

      fireEvent.change(passwordInput, { target: { value: 'short' } });
      fireEvent.blur(passwordInput);

      expect(passwordInput).toHaveClass('input-error');
    });

    it('should show error for empty password on blur', () => {
      renderLoginPage();

      const passwordInput = screen.getByLabelText(/password/i);

      fireEvent.blur(passwordInput);

      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });

    it('should set aria-invalid to true for invalid password', () => {
      renderLoginPage();

      const passwordInput = screen.getByLabelText(/password/i);

      fireEvent.change(passwordInput, { target: { value: 'short' } });
      fireEvent.blur(passwordInput);

      expect(passwordInput).toHaveAttribute('aria-invalid', 'true');
    });
  });

  describe('Real-time Validation (TS-LOGIN-005)', () => {
    it('should clear email error in real-time when typing valid email', async () => {
      renderLoginPage();

      const emailInput = screen.getByLabelText(/email/i);

      // First, create an error
      fireEvent.change(emailInput, { target: { value: 'invalid' } });
      fireEvent.blur(emailInput);
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();

      // Then type a valid email
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      await waitFor(() => {
        expect(screen.queryByText('Please enter a valid email address')).not.toBeInTheDocument();
      });
    });

    it('should clear password error in real-time when typing valid password', async () => {
      renderLoginPage();

      const passwordInput = screen.getByLabelText(/password/i);

      // First, create an error
      fireEvent.change(passwordInput, { target: { value: 'short' } });
      fireEvent.blur(passwordInput);
      expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();

      // Then type a valid password
      fireEvent.change(passwordInput, { target: { value: 'LongPassword123' } });

      await waitFor(() => {
        expect(screen.queryByText('Password must be at least 8 characters')).not.toBeInTheDocument();
      });
    });

    it('should not validate untouched fields on input', () => {
      renderLoginPage();

      const emailInput = screen.getByLabelText(/email/i);

      // Type without blurring
      fireEvent.change(emailInput, { target: { value: 'invalid' } });

      // Should not show error yet
      expect(screen.queryByText('Please enter a valid email address')).not.toBeInTheDocument();
    });
  });

  describe('Submit Button State (TS-LOGIN-006, TS-LOGIN-007)', () => {
    it('should keep submit button disabled with invalid fields', () => {
      renderLoginPage();

      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole('button', { name: /login/i });

      fireEvent.change(emailInput, { target: { value: 'invalid' } });
      fireEvent.blur(emailInput);

      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveClass('button-disabled');
    });

    it('should enable submit button when all fields are valid', async () => {
      renderLoginPage();

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /login/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.blur(emailInput);

      fireEvent.change(passwordInput, { target: { value: 'ValidPassword123' } });
      fireEvent.blur(passwordInput);

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
        expect(submitButton).not.toHaveClass('button-disabled');
      });
    });

    it('should keep button disabled with empty fields', () => {
      renderLoginPage();

      const submitButton = screen.getByRole('button', { name: /login/i });

      expect(submitButton).toBeDisabled();
    });

    it('should disable button when only email is valid', async () => {
      renderLoginPage();

      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole('button', { name: /login/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.blur(emailInput);

      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });
    });

    it('should disable button when only password is valid', async () => {
      renderLoginPage();

      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /login/i });

      fireEvent.change(passwordInput, { target: { value: 'ValidPassword123' } });
      fireEvent.blur(passwordInput);

      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });
    });
  });

  describe('Accessibility (TS-LOGIN-008)', () => {
    it('should have error messages with role alert', () => {
      renderLoginPage();

      const emailInput = screen.getByLabelText(/email/i);

      fireEvent.change(emailInput, { target: { value: 'invalid' } });
      fireEvent.blur(emailInput);

      const errorMessage = screen.getByText('Please enter a valid email address');
      expect(errorMessage).toHaveAttribute('role', 'alert');
      expect(errorMessage).toHaveAttribute('aria-live', 'polite');
    });

    it('should have proper id for error messages matching aria-describedby', () => {
      renderLoginPage();

      const emailInput = screen.getByLabelText(/email/i);

      fireEvent.change(emailInput, { target: { value: 'invalid' } });
      fireEvent.blur(emailInput);

      const errorMessage = screen.getByText('Please enter a valid email address');
      expect(errorMessage).toHaveAttribute('id', 'email-error');
    });

    it('should update aria-invalid when validation state changes', async () => {
      renderLoginPage();

      const emailInput = screen.getByLabelText(/email/i);

      // Invalid state
      fireEvent.change(emailInput, { target: { value: 'invalid' } });
      fireEvent.blur(emailInput);
      expect(emailInput).toHaveAttribute('aria-invalid', 'true');

      // Valid state
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      await waitFor(() => {
        expect(emailInput).toHaveAttribute('aria-invalid', 'false');
      });
    });
  });

  describe('Form Submission (TS-LOGIN-010)', () => {
    it('should not submit form with invalid fields', async () => {
      renderLoginPage();

      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole('button', { name: /login/i });

      fireEvent.change(emailInput, { target: { value: 'invalid' } });
      fireEvent.blur(emailInput);

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(axios.post).not.toHaveBeenCalled();
      });
    });

    it('should call API with valid credentials', async () => {
      axios.post.mockResolvedValue({
        status: 200,
        data: {
          user: {
            _id: '123',
            email: 'test@example.com',
          },
        },
      });

      renderLoginPage();

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /login/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.blur(emailInput);

      fireEvent.change(passwordInput, { target: { value: 'ValidPassword123' } });
      fireEvent.blur(passwordInput);

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          'http://test-api.com/login',
          {
            email: 'test@example.com',
            password: 'ValidPassword123',
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
      });
    });
  });

  describe('Multiple Fields Validation', () => {
    it('should show errors for multiple invalid fields', () => {
      renderLoginPage();

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);

      fireEvent.change(emailInput, { target: { value: 'invalid' } });
      fireEvent.blur(emailInput);

      fireEvent.change(passwordInput, { target: { value: 'short' } });
      fireEvent.blur(passwordInput);

      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
      expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
    });

    it('should remove error message when field becomes valid', async () => {
      renderLoginPage();

      const emailInput = screen.getByLabelText(/email/i);

      // Create error
      fireEvent.change(emailInput, { target: { value: 'invalid' } });
      fireEvent.blur(emailInput);
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();

      // Fix error
      fireEvent.change(emailInput, { target: { value: 'valid@example.com' } });

      await waitFor(() => {
        expect(screen.queryByText('Please enter a valid email address')).not.toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid input changes', async () => {
      renderLoginPage();

      const emailInput = screen.getByLabelText(/email/i);

      fireEvent.change(emailInput, { target: { value: 'a' } });
      fireEvent.blur(emailInput);

      fireEvent.change(emailInput, { target: { value: 'ab' } });
      fireEvent.change(emailInput, { target: { value: 'abc' } });
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      await waitFor(() => {
        expect(emailInput).toHaveClass('input-success');
      });
    });

    it('should handle empty input after having value', async () => {
      renderLoginPage();

      const emailInput = screen.getByLabelText(/email/i);

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.blur(emailInput);

      fireEvent.change(emailInput, { target: { value: '' } });

      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeInTheDocument();
      });
    });
  });

  describe('API Error Handling', () => {
    it('should handle successful login', async () => {
      axios.post.mockResolvedValue({
        status: 200,
        data: {
          user: {
            _id: '123',
            email: 'test@example.com',
          },
        },
      });

      renderLoginPage();

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /login/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.blur(emailInput);

      fireEvent.change(passwordInput, { target: { value: 'ValidPassword123' } });
      fireEvent.blur(passwordInput);

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('Login Successfully');
      });
    });

    it('should handle login failure with 409 status', async () => {
      axios.post.mockRejectedValue({
        response: {
          status: 409,
        },
      });

      renderLoginPage();

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /login/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.blur(emailInput);

      fireEvent.change(passwordInput, { target: { value: 'ValidPassword123' } });
      fireEvent.blur(passwordInput);

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('User already exists');
      });
    });

    it('should handle generic login error', async () => {
      axios.post.mockRejectedValue(new Error('Network error'));

      renderLoginPage();

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /login/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.blur(emailInput);

      fireEvent.change(passwordInput, { target: { value: 'ValidPassword123' } });
      fireEvent.blur(passwordInput);

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Error during login. Please try again later.');
      });
    });

    it('should handle non-200 response status', async () => {
      axios.post.mockResolvedValue({
        status: 401,
        data: {},
      });

      renderLoginPage();

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /login/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.blur(emailInput);

      fireEvent.change(passwordInput, { target: { value: 'ValidPassword123' } });
      fireEvent.blur(passwordInput);

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Login failed. Please try again.');
      });
    });
  });
});
