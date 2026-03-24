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
  ToastContainer: () => null,
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

const renderSignupPage = () => {
  return render(
    <BrowserRouter>
      <SignupPage />
    </BrowserRouter>
  );
};

describe('Signup Page - Validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should render the signup form with all fields', () => {
      renderSignupPage();

      expect(screen.getByLabelText(/^name$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    });

    it('should have submit button disabled initially', () => {
      renderSignupPage();

      const submitButton = screen.getByRole('button', { name: /sign up/i });
      expect(submitButton).toBeDisabled();
    });

    it('should not display error messages initially', () => {
      renderSignupPage();

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('should have proper ARIA attributes on inputs', () => {
      renderSignupPage();

      const nameInput = screen.getByLabelText(/^name$/i);
      const emailInput = screen.getByLabelText(/^email$/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

      expect(nameInput).toHaveAttribute('aria-invalid', 'false');
      expect(nameInput).toHaveAttribute('aria-describedby', 'name-error');
      expect(emailInput).toHaveAttribute('aria-invalid', 'false');
      expect(emailInput).toHaveAttribute('aria-describedby', 'email-error');
      expect(passwordInput).toHaveAttribute('aria-invalid', 'false');
      expect(passwordInput).toHaveAttribute('aria-describedby', 'password-error');
      expect(confirmPasswordInput).toHaveAttribute('aria-invalid', 'false');
      expect(confirmPasswordInput).toHaveAttribute('aria-describedby', 'confirmPassword-error');
    });
  });

  describe('Name Validation', () => {
    it('should show error for name with 1 character (TS-SIGNUP-001)', () => {
      renderSignupPage();

      const nameInput = screen.getByLabelText(/^name$/i);

      fireEvent.change(nameInput, { target: { value: 'J' } });
      fireEvent.blur(nameInput);

      expect(screen.getByText('Name must be at least 2 characters')).toBeInTheDocument();
    });

    it('should show error for name with numbers (TS-SIGNUP-002)', () => {
      renderSignupPage();

      const nameInput = screen.getByLabelText(/^name$/i);

      fireEvent.change(nameInput, { target: { value: 'John123' } });
      fireEvent.blur(nameInput);

      expect(screen.getByText(/must start with a letter/i)).toBeInTheDocument();
    });

    it('should show green border for valid name (TS-SIGNUP-003)', () => {
      renderSignupPage();

      const nameInput = screen.getByLabelText(/^name$/i);

      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.blur(nameInput);

      expect(nameInput).toHaveClass('input-success');
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('should add input-error class for invalid name', () => {
      renderSignupPage();

      const nameInput = screen.getByLabelText(/^name$/i);

      fireEvent.change(nameInput, { target: { value: 'A' } });
      fireEvent.blur(nameInput);

      expect(nameInput).toHaveClass('input-error');
    });

    it('should show error for empty name on blur', () => {
      renderSignupPage();

      const nameInput = screen.getByLabelText(/^name$/i);

      fireEvent.blur(nameInput);

      expect(screen.getByText('Name is required')).toBeInTheDocument();
    });

    it('should validate names with hyphens and apostrophes', () => {
      renderSignupPage();

      const nameInput = screen.getByLabelText(/^name$/i);

      // Valid name with hyphen
      fireEvent.change(nameInput, { target: { value: 'Mary-Jane' } });
      fireEvent.blur(nameInput);
      expect(nameInput).toHaveClass('input-success');

      // Valid name with apostrophe
      fireEvent.change(nameInput, { target: { value: "O'Brien" } });
      expect(nameInput).toHaveClass('input-success');
    });
  });

  describe('Email Validation', () => {
    it('should show error for invalid email (TS-SIGNUP-004)', () => {
      renderSignupPage();

      const emailInput = screen.getByLabelText(/^email$/i);

      fireEvent.change(emailInput, { target: { value: 'test@' } });
      fireEvent.blur(emailInput);

      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    });

    it('should show green border for valid email', () => {
      renderSignupPage();

      const emailInput = screen.getByLabelText(/^email$/i);

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.blur(emailInput);

      expect(emailInput).toHaveClass('input-success');
    });

    it('should add input-error class for invalid email', () => {
      renderSignupPage();

      const emailInput = screen.getByLabelText(/^email$/i);

      fireEvent.change(emailInput, { target: { value: 'invalid' } });
      fireEvent.blur(emailInput);

      expect(emailInput).toHaveClass('input-error');
    });

    it('should set aria-invalid to true for invalid email', () => {
      renderSignupPage();

      const emailInput = screen.getByLabelText(/^email$/i);

      fireEvent.change(emailInput, { target: { value: 'invalid' } });
      fireEvent.blur(emailInput);

      expect(emailInput).toHaveAttribute('aria-invalid', 'true');
    });
  });

  describe('Password Validation and Strength', () => {
    it('should show error and weak strength for simple password (TS-SIGNUP-005)', () => {
      renderSignupPage();

      const passwordInput = screen.getByLabelText(/^password$/i);

      fireEvent.change(passwordInput, { target: { value: 'password' } });
      fireEvent.blur(passwordInput);

      expect(screen.getByText(/uppercase/i)).toBeInTheDocument();
      expect(screen.getByText('Weak')).toBeInTheDocument();
    });

    it('should show strong password strength for valid password (TS-SIGNUP-006)', () => {
      renderSignupPage();

      const passwordInput = screen.getByLabelText(/^password$/i);

      fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
      fireEvent.blur(passwordInput);

      expect(passwordInput).toHaveClass('input-success');
      expect(screen.getByText('Strong')).toBeInTheDocument();
      expect(screen.getByText('Strong')).toHaveClass('password-strength-strong');
    });

    it('should show medium strength for partially strong password', () => {
      renderSignupPage();

      const passwordInput = screen.getByLabelText(/^password$/i);

      fireEvent.change(passwordInput, { target: { value: 'Password1' } });
      fireEvent.blur(passwordInput);

      expect(screen.getByText('Medium')).toBeInTheDocument();
      expect(screen.getByText('Medium')).toHaveClass('password-strength-medium');
    });

    it('should show error for password less than 8 characters', () => {
      renderSignupPage();

      const passwordInput = screen.getByLabelText(/^password$/i);

      fireEvent.change(passwordInput, { target: { value: 'Pass1!' } });
      fireEvent.blur(passwordInput);

      expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
    });

    it('should not show strength indicator until field is touched', () => {
      renderSignupPage();

      const passwordInput = screen.getByLabelText(/^password$/i);

      fireEvent.change(passwordInput, { target: { value: 'Password123!' } });

      expect(screen.queryByText('Strong')).not.toBeInTheDocument();
    });
  });

  describe('Confirm Password Validation', () => {
    it('should show error when passwords do not match (TS-SIGNUP-007)', () => {
      renderSignupPage();

      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

      fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
      fireEvent.blur(passwordInput);

      fireEvent.change(confirmPasswordInput, { target: { value: 'Password456!' } });
      fireEvent.blur(confirmPasswordInput);

      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });

    it('should show green border when passwords match (TS-SIGNUP-008)', () => {
      renderSignupPage();

      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

      fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
      fireEvent.blur(passwordInput);

      fireEvent.change(confirmPasswordInput, { target: { value: 'Password123!' } });
      fireEvent.blur(confirmPasswordInput);

      expect(passwordInput).toHaveClass('input-success');
      expect(confirmPasswordInput).toHaveClass('input-success');
      expect(screen.queryByText('Passwords do not match')).not.toBeInTheDocument();
    });

    it('should re-validate confirm password when password changes (TS-SIGNUP-009)', async () => {
      renderSignupPage();

      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

      // Set matching passwords
      fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
      fireEvent.blur(passwordInput);

      fireEvent.change(confirmPasswordInput, { target: { value: 'Password123!' } });
      fireEvent.blur(confirmPasswordInput);

      expect(screen.queryByText('Passwords do not match')).not.toBeInTheDocument();

      // Change password
      fireEvent.change(passwordInput, { target: { value: 'DifferentPass123!' } });

      await waitFor(() => {
        expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
      });
    });

    it('should show error for empty confirm password', () => {
      renderSignupPage();

      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

      fireEvent.blur(confirmPasswordInput);

      expect(screen.getByText('Please confirm your password')).toBeInTheDocument();
    });

    it('should add input-error class when passwords do not match', () => {
      renderSignupPage();

      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

      fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'Different123!' } });
      fireEvent.blur(confirmPasswordInput);

      expect(confirmPasswordInput).toHaveClass('input-error');
    });
  });

  describe('Real-time Validation', () => {
    it('should clear error in real-time when typing valid data', async () => {
      renderSignupPage();

      const nameInput = screen.getByLabelText(/^name$/i);

      // Create an error
      fireEvent.change(nameInput, { target: { value: 'A' } });
      fireEvent.blur(nameInput);
      expect(screen.getByText('Name must be at least 2 characters')).toBeInTheDocument();

      // Type valid name
      fireEvent.change(nameInput, { target: { value: 'Alice' } });

      await waitFor(() => {
        expect(screen.queryByText('Name must be at least 2 characters')).not.toBeInTheDocument();
      });
    });

    it('should validate password strength in real-time', async () => {
      renderSignupPage();

      const passwordInput = screen.getByLabelText(/^password$/i);

      fireEvent.change(passwordInput, { target: { value: 'weak' } });
      fireEvent.blur(passwordInput);

      // Type stronger password
      fireEvent.change(passwordInput, { target: { value: 'StrongPass123!' } });

      await waitFor(() => {
        expect(screen.getByText('Strong')).toBeInTheDocument();
      });
    });

    it('should not validate untouched fields on input', () => {
      renderSignupPage();

      const nameInput = screen.getByLabelText(/^name$/i);

      // Type without blurring
      fireEvent.change(nameInput, { target: { value: 'A' } });

      // Should not show error yet
      expect(screen.queryByText('Name must be at least 2 characters')).not.toBeInTheDocument();
    });
  });

  describe('Submit Button State (TS-SIGNUP-010, TS-SIGNUP-011)', () => {
    it('should keep submit button disabled with invalid fields', () => {
      renderSignupPage();

      const nameInput = screen.getByLabelText(/^name$/i);
      const submitButton = screen.getByRole('button', { name: /sign up/i });

      fireEvent.change(nameInput, { target: { value: 'A' } });
      fireEvent.blur(nameInput);

      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveClass('button-disabled');
    });

    it('should enable submit button when all fields are valid', async () => {
      renderSignupPage();

      const nameInput = screen.getByLabelText(/^name$/i);
      const emailInput = screen.getByLabelText(/^email$/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const submitButton = screen.getByRole('button', { name: /sign up/i });

      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.blur(nameInput);

      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      fireEvent.blur(emailInput);

      fireEvent.change(passwordInput, { target: { value: 'ValidPassword123!' } });
      fireEvent.blur(passwordInput);

      fireEvent.change(confirmPasswordInput, { target: { value: 'ValidPassword123!' } });
      fireEvent.blur(confirmPasswordInput);

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
        expect(submitButton).not.toHaveClass('button-disabled');
      });
    });

    it('should keep button disabled with empty fields', () => {
      renderSignupPage();

      const submitButton = screen.getByRole('button', { name: /sign up/i });

      expect(submitButton).toBeDisabled();
    });

    it('should disable button when only some fields are valid', async () => {
      renderSignupPage();

      const nameInput = screen.getByLabelText(/^name$/i);
      const emailInput = screen.getByLabelText(/^email$/i);
      const submitButton = screen.getByRole('button', { name: /sign up/i });

      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.blur(nameInput);

      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      fireEvent.blur(emailInput);

      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });
    });
  });

  describe('Accessibility (TS-SIGNUP-012)', () => {
    it('should have error messages with role alert', () => {
      renderSignupPage();

      const nameInput = screen.getByLabelText(/^name$/i);

      fireEvent.change(nameInput, { target: { value: 'A' } });
      fireEvent.blur(nameInput);

      const errorMessage = screen.getByText('Name must be at least 2 characters');
      expect(errorMessage).toHaveAttribute('role', 'alert');
      expect(errorMessage).toHaveAttribute('aria-live', 'polite');
    });

    it('should have proper id for error messages matching aria-describedby', () => {
      renderSignupPage();

      const nameInput = screen.getByLabelText(/^name$/i);

      fireEvent.change(nameInput, { target: { value: 'A' } });
      fireEvent.blur(nameInput);

      const errorMessage = screen.getByText('Name must be at least 2 characters');
      expect(errorMessage).toHaveAttribute('id', 'name-error');
    });

    it('should update aria-invalid when validation state changes', async () => {
      renderSignupPage();

      const nameInput = screen.getByLabelText(/^name$/i);

      // Invalid state
      fireEvent.change(nameInput, { target: { value: 'A' } });
      fireEvent.blur(nameInput);
      expect(nameInput).toHaveAttribute('aria-invalid', 'true');

      // Valid state
      fireEvent.change(nameInput, { target: { value: 'Alice' } });
      await waitFor(() => {
        expect(nameInput).toHaveAttribute('aria-invalid', 'false');
      });
    });

    it('should have all error IDs matching aria-describedby', () => {
      renderSignupPage();

      const nameInput = screen.getByLabelText(/^name$/i);
      const emailInput = screen.getByLabelText(/^email$/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

      expect(nameInput.getAttribute('aria-describedby')).toBe('name-error');
      expect(emailInput.getAttribute('aria-describedby')).toBe('email-error');
      expect(passwordInput.getAttribute('aria-describedby')).toBe('password-error');
      expect(confirmPasswordInput.getAttribute('aria-describedby')).toBe('confirmPassword-error');
    });
  });

  describe('Form Submission', () => {
    it('should not submit form with invalid fields', async () => {
      renderSignupPage();

      const nameInput = screen.getByLabelText(/^name$/i);
      const submitButton = screen.getByRole('button', { name: /sign up/i });

      fireEvent.change(nameInput, { target: { value: 'A' } });
      fireEvent.blur(nameInput);

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(axios.post).not.toHaveBeenCalled();
      });
    });

    it('should call API with valid credentials', async () => {
      axios.post.mockResolvedValue({
        status: 201,
        data: {
          _id: '123',
        },
      });

      renderSignupPage();

      const nameInput = screen.getByLabelText(/^name$/i);
      const emailInput = screen.getByLabelText(/^email$/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const submitButton = screen.getByRole('button', { name: /sign up/i });

      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.blur(nameInput);

      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      fireEvent.blur(emailInput);

      fireEvent.change(passwordInput, { target: { value: 'ValidPassword123!' } });
      fireEvent.blur(passwordInput);

      fireEvent.change(confirmPasswordInput, { target: { value: 'ValidPassword123!' } });
      fireEvent.blur(confirmPasswordInput);

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          'http://test-api.com/signup',
          {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'ValidPassword123!',
            confirmPassword: 'ValidPassword123!',
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

  describe('API Error Handling', () => {
    it('should handle successful registration', async () => {
      axios.post.mockResolvedValue({
        status: 201,
        data: {
          _id: '123',
        },
      });

      renderSignupPage();

      const nameInput = screen.getByLabelText(/^name$/i);
      const emailInput = screen.getByLabelText(/^email$/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const submitButton = screen.getByRole('button', { name: /sign up/i });

      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'ValidPassword123!' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'ValidPassword123!' } });
      fireEvent.blur(confirmPasswordInput);

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('Registration successful');
      });
    });

    it('should handle user already exists error (400)', async () => {
      axios.post.mockRejectedValue({
        response: {
          status: 400,
        },
      });

      renderSignupPage();

      const nameInput = screen.getByLabelText(/^name$/i);
      const emailInput = screen.getByLabelText(/^email$/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const submitButton = screen.getByRole('button', { name: /sign up/i });

      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'existing@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'ValidPassword123!' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'ValidPassword123!' } });
      fireEvent.blur(confirmPasswordInput);

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('User already exists');
      });
    });

    it('should handle generic registration error', async () => {
      axios.post.mockRejectedValue(new Error('Network error'));

      renderSignupPage();

      const nameInput = screen.getByLabelText(/^name$/i);
      const emailInput = screen.getByLabelText(/^email$/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const submitButton = screen.getByRole('button', { name: /sign up/i });

      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'ValidPassword123!' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'ValidPassword123!' } });
      fireEvent.blur(confirmPasswordInput);

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Error during registration');
      });
    });

    it('should handle non-201 response status', async () => {
      axios.post.mockResolvedValue({
        status: 500,
        data: {},
      });

      renderSignupPage();

      const nameInput = screen.getByLabelText(/^name$/i);
      const emailInput = screen.getByLabelText(/^email$/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const submitButton = screen.getByRole('button', { name: /sign up/i });

      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'ValidPassword123!' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'ValidPassword123!' } });
      fireEvent.blur(confirmPasswordInput);

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Registration failed');
      });
    });
  });

  describe('Multiple Fields Validation', () => {
    it('should show errors for multiple invalid fields', () => {
      renderSignupPage();

      const nameInput = screen.getByLabelText(/^name$/i);
      const emailInput = screen.getByLabelText(/^email$/i);
      const passwordInput = screen.getByLabelText(/^password$/i);

      fireEvent.change(nameInput, { target: { value: 'A' } });
      fireEvent.blur(nameInput);

      fireEvent.change(emailInput, { target: { value: 'invalid' } });
      fireEvent.blur(emailInput);

      fireEvent.change(passwordInput, { target: { value: 'weak' } });
      fireEvent.blur(passwordInput);

      expect(screen.getByText('Name must be at least 2 characters')).toBeInTheDocument();
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
      expect(screen.getByText(/8 characters/i)).toBeInTheDocument();
    });

    it('should remove error message when field becomes valid', async () => {
      renderSignupPage();

      const nameInput = screen.getByLabelText(/^name$/i);

      // Create error
      fireEvent.change(nameInput, { target: { value: 'A' } });
      fireEvent.blur(nameInput);
      expect(screen.getByText('Name must be at least 2 characters')).toBeInTheDocument();

      // Fix error
      fireEvent.change(nameInput, { target: { value: 'Alice Smith' } });

      await waitFor(() => {
        expect(screen.queryByText('Name must be at least 2 characters')).not.toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid input changes', async () => {
      renderSignupPage();

      const nameInput = screen.getByLabelText(/^name$/i);

      fireEvent.change(nameInput, { target: { value: 'A' } });
      fireEvent.blur(nameInput);

      fireEvent.change(nameInput, { target: { value: 'AB' } });
      fireEvent.change(nameInput, { target: { value: 'ABC' } });
      fireEvent.change(nameInput, { target: { value: 'John Doe' } });

      await waitFor(() => {
        expect(nameInput).toHaveClass('input-success');
      });
    });

    it('should handle empty input after having value', async () => {
      renderSignupPage();

      const nameInput = screen.getByLabelText(/^name$/i);

      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.blur(nameInput);

      fireEvent.change(nameInput, { target: { value: '' } });

      await waitFor(() => {
        expect(screen.getByText('Name is required')).toBeInTheDocument();
      });
    });

    it('should update password strength as user types', async () => {
      renderSignupPage();

      const passwordInput = screen.getByLabelText(/^password$/i);

      fireEvent.change(passwordInput, { target: { value: 'password' } });
      fireEvent.blur(passwordInput);

      expect(screen.getByText('Weak')).toBeInTheDocument();

      fireEvent.change(passwordInput, { target: { value: 'Password1' } });

      await waitFor(() => {
        expect(screen.getByText('Medium')).toBeInTheDocument();
      });

      fireEvent.change(passwordInput, { target: { value: 'Password123!' } });

      await waitFor(() => {
        expect(screen.getByText('Strong')).toBeInTheDocument();
      });
    });
  });
});
