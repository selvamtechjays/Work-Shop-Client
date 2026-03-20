import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import SignupPage from './signup-page';

// Mock axios
vi.mock('axios');

// Mock react-router-dom navigate
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
  ToastContainer: () => <div data-testid="toast-container" />,
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('SignupPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  const renderSignupPage = () => {
    return render(
      <BrowserRouter>
        <SignupPage />
      </BrowserRouter>
    );
  };

  describe('Component Rendering', () => {
    it('should render the signup form', () => {
      renderSignupPage();

      expect(screen.getByText('Signup Form')).toBeInTheDocument();
      expect(screen.getByLabelText('Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument();
    });

    it('should render promotional content on the left column', () => {
      renderSignupPage();

      expect(screen.getByText('500+ FREE Mock Tests for All Govt. Exams')).toBeInTheDocument();
      expect(screen.getByText(/Attempt 500\+ Free Mock tests/)).toBeInTheDocument();
    });

    it('should render the login link', () => {
      renderSignupPage();

      const loginLink = screen.getByRole('link', { name: 'Log In' });
      expect(loginLink).toBeInTheDocument();
      expect(loginLink).toHaveAttribute('href', '/');
    });

    it('should render the ToastContainer', () => {
      renderSignupPage();

      expect(screen.getByTestId('toast-container')).toBeInTheDocument();
    });
  });

  describe('Styling and CSS Classes', () => {
    it('should have main-content class without inline styles', () => {
      const { container } = renderSignupPage();

      const mainContent = container.querySelector('.main-content');
      expect(mainContent).toBeInTheDocument();
      expect(mainContent).not.toHaveAttribute('style', expect.stringContaining('color'));
      expect(mainContent).not.toHaveAttribute('style', expect.stringContaining('marginTop'));
    });

    it('should have signup-link class on the login link', () => {
      renderSignupPage();

      const loginLink = screen.getByRole('link', { name: 'Log In' });
      expect(loginLink).toHaveClass('signup-link');
      expect(loginLink).not.toHaveAttribute('style');
    });

    it('should have correct CSS classes on form elements', () => {
      const { container } = renderSignupPage();

      expect(container.querySelector('.left-column')).toBeInTheDocument();
      expect(container.querySelector('.right-column')).toBeInTheDocument();
      expect(container.querySelectorAll('.form-group')).toHaveLength(2);
      expect(container.querySelector('.login-button')).toBeInTheDocument();
    });

    it('should have text class on the login link paragraph', () => {
      const { container } = renderSignupPage();

      const textParagraph = container.querySelector('.text');
      expect(textParagraph).toBeInTheDocument();
      expect(textParagraph).toHaveTextContent('Already Have an Account?');
    });
  });

  describe('Form Inputs', () => {
    it('should update name input value on change', () => {
      renderSignupPage();

      const nameInput = screen.getByLabelText('Name');
      fireEvent.change(nameInput, { target: { value: 'John Doe' } });

      expect(nameInput.value).toBe('John Doe');
    });

    it('should update email input value on change', () => {
      renderSignupPage();

      const emailInput = screen.getByLabelText('Email');
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });

      expect(emailInput.value).toBe('john@example.com');
    });

    it('should update password input value on change', () => {
      renderSignupPage();

      const passwordInput = screen.getByLabelText('Password');
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      expect(passwordInput.value).toBe('password123');
    });

    it('should have required attribute on all inputs', () => {
      renderSignupPage();

      expect(screen.getByLabelText('Name')).toBeRequired();
      expect(screen.getByLabelText('Email')).toBeRequired();
      expect(screen.getByLabelText('Password')).toBeRequired();
    });

    it('should have correct input types', () => {
      renderSignupPage();

      expect(screen.getByLabelText('Name')).toHaveAttribute('type', 'text');
      expect(screen.getByLabelText('Email')).toHaveAttribute('type', 'email');
      expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password');
    });
  });

  describe('Form Submission', () => {
    it('should submit form with valid data successfully', async () => {
      const mockResponse = {
        status: 201,
        data: { _id: 'user123' },
      };
      axios.post.mockResolvedValueOnce(mockResponse);

      renderSignupPage();

      fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });

      const submitButton = screen.getByRole('button', { name: 'Sign Up' });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          expect.stringContaining('/signup'),
          {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
      });

      expect(localStorage.getItem('userInfo')).toBe(JSON.stringify('user123'));
    });

    it('should handle user already exists error', async () => {
      const { toast } = await import('react-toastify');

      axios.post.mockRejectedValueOnce({
        response: { status: 400 },
      });

      renderSignupPage();

      fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'existing@example.com' } });
      fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });

      const submitButton = screen.getByRole('button', { name: 'Sign Up' });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('User already exists');
      });
    });

    it('should handle registration failure (non-201 status)', async () => {
      const { toast } = await import('react-toastify');

      axios.post.mockResolvedValueOnce({
        status: 500,
      });

      renderSignupPage();

      fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });

      const submitButton = screen.getByRole('button', { name: 'Sign Up' });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Registration failed');
      });
    });

    it('should handle generic error during registration', async () => {
      const { toast } = await import('react-toastify');

      axios.post.mockRejectedValueOnce(new Error('Network error'));

      renderSignupPage();

      fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });

      const submitButton = screen.getByRole('button', { name: 'Sign Up' });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Error during registration');
      });
    });

    it('should navigate to dashboard after successful registration', async () => {
      const mockResponse = {
        status: 201,
        data: { _id: 'user123' },
      };
      axios.post.mockResolvedValueOnce(mockResponse);

      renderSignupPage();

      fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });

      const submitButton = screen.getByRole('button', { name: 'Sign Up' });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
      });

      // Wait for setTimeout to complete (3 seconds + buffer)
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      }, { timeout: 4000 });
    });
  });

  describe('Accessibility', () => {
    it('should have proper label associations', () => {
      renderSignupPage();

      const nameInput = screen.getByLabelText('Name');
      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');

      expect(nameInput).toHaveAttribute('id', 'name');
      expect(emailInput).toHaveAttribute('id', 'email');
      expect(passwordInput).toHaveAttribute('id', 'password');
    });

    it('should have accessible button', () => {
      renderSignupPage();

      const submitButton = screen.getByRole('button', { name: 'Sign Up' });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveClass('login-button');
    });

    it('should have accessible link', () => {
      renderSignupPage();

      const loginLink = screen.getByRole('link', { name: 'Log In' });
      expect(loginLink).toBeInTheDocument();
      expect(loginLink).toHaveClass('signup-link');
    });
  });

  describe('Edge Cases', () => {
    it('should submit form with empty values', async () => {
      // HTML5 validation doesn't work in test environment like it does in browser
      // The form will actually submit with empty values
      axios.post.mockRejectedValueOnce(new Error('Validation error'));

      renderSignupPage();

      const submitButton = screen.getByRole('button', { name: 'Sign Up' });
      fireEvent.click(submitButton);

      // Form submits with empty values
      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          expect.stringContaining('/signup'),
          {
            name: '',
            email: '',
            password: '',
          },
          expect.any(Object)
        );
      });
    });

    it('should handle rapid form changes', () => {
      renderSignupPage();

      const nameInput = screen.getByLabelText('Name');

      fireEvent.change(nameInput, { target: { value: 'J' } });
      fireEvent.change(nameInput, { target: { value: 'Jo' } });
      fireEvent.change(nameInput, { target: { value: 'Joh' } });
      fireEvent.change(nameInput, { target: { value: 'John' } });

      expect(nameInput.value).toBe('John');
    });
  });
});
