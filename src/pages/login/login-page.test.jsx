import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
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

// Helper function to render with router
const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

// Helper to get password field
const getPasswordField = (container) => container.querySelector('input[name="password"]');

describe('LoginPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Rendering', () => {
    it('should render email and password fields', () => {
      const { container } = renderWithRouter(<LoginPage />);
      expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
      expect(getPasswordField(container)).toBeInTheDocument();
    });

    it('should render the title and subtitle', () => {
      renderWithRouter(<LoginPage />);
      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
      expect(screen.getByText(/Sign in to continue/i)).toBeInTheDocument();
    });

    it('should render promotional content', () => {
      renderWithRouter(<LoginPage />);
      expect(screen.getAllByText(/500\+ FREE Mock Tests/i)[0]).toBeInTheDocument();
    });

    it('should render submit button', () => {
      renderWithRouter(<LoginPage />);
      expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
    });

    it('should render remember me checkbox', () => {
      renderWithRouter(<LoginPage />);
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
      expect(screen.getByText('Remember me')).toBeInTheDocument();
    });

    it('should render forgot password link', () => {
      renderWithRouter(<LoginPage />);
      expect(screen.getByRole('link', { name: /Forgot password/i })).toBeInTheDocument();
    });

    it('should render link to signup page', () => {
      renderWithRouter(<LoginPage />);
      expect(screen.getByText(/New here/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Sign up/i })).toBeInTheDocument();
    });

    it('should have form with proper role', () => {
      renderWithRouter(<LoginPage />);
      const form = screen.getByRole('form');
      expect(form).toHaveAttribute('aria-label', 'Login form');
    });
  });

  describe('Input Handling', () => {
    it('should update email field when typing', () => {
      renderWithRouter(<LoginPage />);
      const emailInput = screen.getByLabelText(/Email Address/i);
      fireEvent.change(emailInput, { target: { value: 'john@test.com' } });
      expect(emailInput).toHaveValue('john@test.com');
    });

    it('should update password field when typing', () => {
      const { container } = renderWithRouter(<LoginPage />);
      const passwordInput = getPasswordField(container);
      fireEvent.change(passwordInput, { target: { value: 'Test@1234' } });
      expect(passwordInput).toHaveValue('Test@1234');
    });
  });

  describe('Validation', () => {
    it('should show error for invalid email on blur', async () => {
      renderWithRouter(<LoginPage />);
      const emailInput = screen.getByLabelText(/Email Address/i);
      fireEvent.change(emailInput, { target: { value: 'notanemail' } });
      fireEvent.blur(emailInput);
      await waitFor(() => {
        expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument();
      });
    });

    it('should clear error when user starts typing after validation', async () => {
      renderWithRouter(<LoginPage />);
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

    it('should disable submit button when email is invalid', () => {
      renderWithRouter(<LoginPage />);
      const emailInput = screen.getByLabelText(/Email Address/i);
      fireEvent.change(emailInput, { target: { value: 'notanemail' } });

      const submitButton = screen.getByRole('button', { name: /Sign In/i });
      expect(submitButton).toBeDisabled();
    });

    it('should disable submit button when password is empty', () => {
      renderWithRouter(<LoginPage />);
      const emailInput = screen.getByLabelText(/Email Address/i);
      fireEvent.change(emailInput, { target: { value: 'john@test.com' } });

      const submitButton = screen.getByRole('button', { name: /Sign In/i });
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Password Visibility Toggle', () => {
    it('should toggle password visibility when eye icon is clicked', () => {
      const { container } = renderWithRouter(<LoginPage />);
      const passwordInput = getPasswordField(container);
      const toggleButton = screen.getByRole('button', { name: /password/i });

      expect(passwordInput).toHaveAttribute('type', 'password');

      fireEvent.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'text');

      fireEvent.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'password');
    });
  });

  describe('Remember Me Functionality', () => {
    it('should toggle remember me checkbox', () => {
      renderWithRouter(<LoginPage />);
      const checkbox = screen.getByRole('checkbox');

      expect(checkbox).not.toBeChecked();

      fireEvent.click(checkbox);
      expect(checkbox).toBeChecked();

      fireEvent.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });

    it('should load remember me state from localStorage on mount', () => {
      localStorage.setItem('rememberMe', 'true');

      renderWithRouter(<LoginPage />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
    });

    it('should not check remember me if not in localStorage', () => {
      renderWithRouter(<LoginPage />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
    });

    it('should save remember me to localStorage on successful login', async () => {
      const mockResponse = {
        status: 200,
        data: { user: { _id: '12345', email: 'john@test.com' } },
      };
      axios.post.mockResolvedValue(mockResponse);

      const { container } = renderWithRouter(<LoginPage />);

      fireEvent.change(screen.getByLabelText(/Email Address/i), {
        target: { value: 'john@test.com' },
      });
      fireEvent.change(getPasswordField(container), { target: { value: 'Test@1234' } });

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      const submitButton = screen.getByRole('button', { name: /Sign In/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(localStorage.getItem('rememberMe')).toBe('true');
      });
    });

    it('should remove remember me from localStorage when unchecked', async () => {
      localStorage.setItem('rememberMe', 'true');

      const mockResponse = {
        status: 200,
        data: { user: { _id: '12345', email: 'john@test.com' } },
      };
      axios.post.mockResolvedValue(mockResponse);

      const { container } = renderWithRouter(<LoginPage />);

      fireEvent.change(screen.getByLabelText(/Email Address/i), {
        target: { value: 'john@test.com' },
      });
      fireEvent.change(getPasswordField(container), { target: { value: 'Test@1234' } });

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox); // Uncheck it

      const submitButton = screen.getByRole('button', { name: /Sign In/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(localStorage.getItem('rememberMe')).toBeNull();
      });
    });
  });

  describe('Form Submission', () => {
    it('should disable submit button when form is invalid', () => {
      renderWithRouter(<LoginPage />);
      const submitButton = screen.getByRole('button', { name: /Sign In/i });
      expect(submitButton).toBeDisabled();
    });

    it('should enable submit button when all fields are valid', async () => {
      const { container } = renderWithRouter(<LoginPage />);
      const emailInput = screen.getByLabelText(/Email Address/i);
      const passwordInput = getPasswordField(container);

      fireEvent.change(emailInput, { target: { value: 'john@test.com' } });
      fireEvent.change(passwordInput, { target: { value: 'Test@1234' } });

      await waitFor(() => {
        const submitButton = screen.getByRole('button', { name: /Sign In/i });
        expect(submitButton).not.toBeDisabled();
      });
    });

    it('should show loading state during submission', async () => {
      axios.post.mockImplementation(() => new Promise(() => {})); // Never resolves

      const { container } = renderWithRouter(<LoginPage />);

      fireEvent.change(screen.getByLabelText(/Email Address/i), {
        target: { value: 'john@test.com' },
      });
      fireEvent.change(getPasswordField(container), { target: { value: 'Test@1234' } });

      const submitButton = screen.getByRole('button', { name: /Sign In/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Signing in...')).toBeInTheDocument();
      });
    });

    it('should call API with correct data on submission', async () => {
      const mockResponse = {
        status: 200,
        data: { user: { _id: '12345', email: 'john@test.com' } },
      };
      axios.post.mockResolvedValue(mockResponse);

      const { container } = renderWithRouter(<LoginPage />);

      fireEvent.change(screen.getByLabelText(/Email Address/i), {
        target: { value: 'john@test.com' },
      });
      fireEvent.change(getPasswordField(container), { target: { value: 'Test@1234' } });

      const submitButton = screen.getByRole('button', { name: /Sign In/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          expect.stringContaining('/login'),
          {
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

    it('should show success toast and navigate on successful login', async () => {
      const mockResponse = {
        status: 200,
        data: { user: { _id: '12345', email: 'john@test.com' } },
      };
      axios.post.mockResolvedValue(mockResponse);

      const { container } = renderWithRouter(<LoginPage />);

      fireEvent.change(screen.getByLabelText(/Email Address/i), {
        target: { value: 'john@test.com' },
      });
      fireEvent.change(getPasswordField(container), { target: { value: 'Test@1234' } });

      const submitButton = screen.getByRole('button', { name: /Sign In/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('Login successful');
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
        expect(localStorage.getItem('userInfo')).toBeTruthy();
      });
    });

    it('should store user info in localStorage on success', async () => {
      const mockResponse = {
        status: 200,
        data: { user: { _id: '12345', email: 'john@test.com' } },
      };
      axios.post.mockResolvedValue(mockResponse);

      const { container } = renderWithRouter(<LoginPage />);

      fireEvent.change(screen.getByLabelText(/Email Address/i), {
        target: { value: 'john@test.com' },
      });
      fireEvent.change(getPasswordField(container), { target: { value: 'Test@1234' } });

      fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

      await waitFor(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        expect(userInfo).toEqual({ userId: '12345', userEmail: 'john@test.com' });
      });
    });

    it('should show error message for invalid credentials (401)', async () => {
      axios.post.mockRejectedValue({
        response: { status: 401 },
      });

      const { container } = renderWithRouter(<LoginPage />);

      fireEvent.change(screen.getByLabelText(/Email Address/i), {
        target: { value: 'wrong@test.com' },
      });
      fireEvent.change(getPasswordField(container), { target: { value: 'wrongpass' } });

      const submitButton = screen.getByRole('button', { name: /Sign In/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Invalid email or password/i)).toBeInTheDocument();
        expect(toast.error).toHaveBeenCalledWith('Invalid email or password');
      });
    });

    it('should show error message for user not found (404)', async () => {
      axios.post.mockRejectedValue({
        response: { status: 404 },
      });

      const { container } = renderWithRouter(<LoginPage />);

      fireEvent.change(screen.getByLabelText(/Email Address/i), {
        target: { value: 'notfound@test.com' },
      });
      fireEvent.change(getPasswordField(container), { target: { value: 'Test@1234' } });

      fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

      await waitFor(() => {
        expect(screen.getByText(/Invalid email or password/i)).toBeInTheDocument();
        expect(toast.error).toHaveBeenCalledWith('Invalid email or password');
      });
    });

    it('should show error message for network errors', async () => {
      axios.post.mockRejectedValue(new Error('Network error'));

      const { container } = renderWithRouter(<LoginPage />);

      fireEvent.change(screen.getByLabelText(/Email Address/i), {
        target: { value: 'john@test.com' },
      });
      fireEvent.change(getPasswordField(container), { target: { value: 'Test@1234' } });

      fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

      await waitFor(() => {
        expect(screen.getByText(/Unable to connect/i)).toBeInTheDocument();
        expect(toast.error).toHaveBeenCalledWith('Unable to connect. Please try again.');
      });
    });

    it('should clear API error when user changes input', async () => {
      axios.post.mockRejectedValue({
        response: { status: 401 },
      });

      const { container } = renderWithRouter(<LoginPage />);

      fireEvent.change(screen.getByLabelText(/Email Address/i), {
        target: { value: 'wrong@test.com' },
      });
      fireEvent.change(getPasswordField(container), { target: { value: 'wrongpass' } });

      fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

      await waitFor(() => {
        expect(screen.getByText(/Invalid email or password/i)).toBeInTheDocument();
      });

      // Change email
      fireEvent.change(screen.getByLabelText(/Email Address/i), {
        target: { value: 'newemail@test.com' },
      });

      await waitFor(() => {
        expect(screen.queryByText(/Invalid email or password/i)).not.toBeInTheDocument();
      });
    });

    it('should prevent submission with invalid email', async () => {
      const { container } = renderWithRouter(<LoginPage />);

      fireEvent.change(screen.getByLabelText(/Email Address/i), {
        target: { value: 'notanemail' },
      });
      fireEvent.change(getPasswordField(container), { target: { value: 'Test@1234' } });

      const submitButton = screen.getByRole('button', { name: /Sign In/i });
      fireEvent.click(submitButton);

      expect(axios.post).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper autocomplete attributes', () => {
      const { container } = renderWithRouter(<LoginPage />);
      expect(screen.getByLabelText(/Email Address/i)).toHaveAttribute('autocomplete', 'email');
      expect(getPasswordField(container)).toHaveAttribute('autocomplete', 'current-password');
    });

    it('should set autofocus on email field', () => {
      renderWithRouter(<LoginPage />);
      const emailInput = screen.getByLabelText(/Email Address/i);
      expect(emailInput).toHaveFocus();
    });

    it('should have aria-label on form', () => {
      renderWithRouter(<LoginPage />);
      const form = screen.getByRole('form');
      expect(form).toHaveAttribute('aria-label', 'Login form');
    });

    it('should have role="alert" on API error message', async () => {
      axios.post.mockRejectedValue({
        response: { status: 401 },
      });

      const { container } = renderWithRouter(<LoginPage />);

      fireEvent.change(screen.getByLabelText(/Email Address/i), {
        target: { value: 'test@test.com' },
      });
      fireEvent.change(getPasswordField(container), { target: { value: 'Test@1234' } });
      fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

      await waitFor(() => {
        const errorElement = screen.getByText(/Invalid email or password/i);
        expect(errorElement).toHaveAttribute('role', 'alert');
      });
    });
  });

  describe('Navigation', () => {
    it('should have working link to signup page', () => {
      renderWithRouter(<LoginPage />);
      const signupLink = screen.getByRole('link', { name: /Sign up/i });
      expect(signupLink).toHaveAttribute('href', '/signup');
    });

    it('should have working link to forgot password page', () => {
      renderWithRouter(<LoginPage />);
      const forgotLink = screen.getByRole('link', { name: /Forgot password/i });
      expect(forgotLink).toHaveAttribute('href', '/forgetPassword');
    });
  });
});
