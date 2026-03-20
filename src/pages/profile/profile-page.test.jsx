import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import ProfilePage from './profile-page';
import { toast } from 'react-toastify';

// Mock react-toastify
vi.mock('react-toastify', () => ({
  toast: {
    info: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Helper function to render component with router
const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('ProfilePage Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Loading State', () => {
    it('should complete loading and display appropriate content', async () => {
      const userInfo = {
        userId: '12345',
        userEmail: 'test@example.com',
        userName: 'Test User',
      };
      localStorage.setItem('userInfo', JSON.stringify(userInfo));

      renderWithRouter(<ProfilePage />);

      // Wait for loading to complete and profile to display
      await waitFor(() => {
        expect(screen.getByText('My Profile')).toBeInTheDocument();
      });

      expect(screen.queryByText('Loading profile...')).not.toBeInTheDocument();
    });
  });

  describe('Valid User Data', () => {
    it('should display user profile with userName, email, and userId', async () => {
      const userInfo = {
        userId: '12345',
        userEmail: 'john.doe@example.com',
        userName: 'John Doe',
      };
      localStorage.setItem('userInfo', JSON.stringify(userInfo));

      renderWithRouter(<ProfilePage />);

      await waitFor(() => {
        expect(screen.getByText('My Profile')).toBeInTheDocument();
      });

      expect(screen.getByText('Name:')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Email:')).toBeInTheDocument();
      expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
      expect(screen.getByText('User ID:')).toBeInTheDocument();
      expect(screen.getByText('12345')).toBeInTheDocument();
    });

    it('should extract name from email when userName is not provided', async () => {
      const userInfo = {
        userId: '67890',
        userEmail: 'jane.smith@example.com',
      };
      localStorage.setItem('userInfo', JSON.stringify(userInfo));

      renderWithRouter(<ProfilePage />);

      await waitFor(() => {
        expect(screen.getByText('My Profile')).toBeInTheDocument();
      });

      expect(screen.getByText('jane.smith')).toBeInTheDocument();
      expect(screen.getByText('jane.smith@example.com')).toBeInTheDocument();
    });

    it('should show error when userName is not provided and email is empty', async () => {
      const userInfo = {
        userId: '99999',
        userEmail: '',
        userName: '',
      };
      localStorage.setItem('userInfo', JSON.stringify(userInfo));

      renderWithRouter(<ProfilePage />);

      await waitFor(() => {
        expect(screen.getByText('Profile Error')).toBeInTheDocument();
      });

      // Empty email is treated as invalid, so error message should be displayed
      expect(
        screen.getByText('Unable to load profile data. Please log in again.')
      ).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should show error message when localStorage is empty', async () => {
      renderWithRouter(<ProfilePage />);

      await waitFor(() => {
        expect(screen.getByText('Profile Error')).toBeInTheDocument();
      });

      expect(
        screen.getByText('Unable to load profile data. Please log in again.')
      ).toBeInTheDocument();
      expect(screen.getByText('Return to Login')).toBeInTheDocument();
    });

    it('should show error message when userInfo is corrupted/invalid JSON', async () => {
      localStorage.setItem('userInfo', 'invalid-json{{{');

      renderWithRouter(<ProfilePage />);

      await waitFor(() => {
        expect(screen.getByText('Profile Error')).toBeInTheDocument();
      });

      expect(
        screen.getByText('Unable to load profile data. Please log in again.')
      ).toBeInTheDocument();
    });

    it('should show error message when userEmail is missing', async () => {
      const userInfo = {
        userId: '12345',
      };
      localStorage.setItem('userInfo', JSON.stringify(userInfo));

      renderWithRouter(<ProfilePage />);

      await waitFor(() => {
        expect(screen.getByText('Profile Error')).toBeInTheDocument();
      });

      expect(
        screen.getByText('Unable to load profile data. Please log in again.')
      ).toBeInTheDocument();
    });

    it('should show error message when userId is missing', async () => {
      const userInfo = {
        userEmail: 'test@example.com',
      };
      localStorage.setItem('userInfo', JSON.stringify(userInfo));

      renderWithRouter(<ProfilePage />);

      await waitFor(() => {
        expect(screen.getByText('Profile Error')).toBeInTheDocument();
      });

      expect(
        screen.getByText('Unable to load profile data. Please log in again.')
      ).toBeInTheDocument();
    });

    it('should handle Return to Login button click', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ProfilePage />);

      await waitFor(() => {
        expect(screen.getByText('Return to Login')).toBeInTheDocument();
      });

      const loginButton = screen.getByText('Return to Login');
      await user.click(loginButton);

      expect(localStorage.getItem('userInfo')).toBeNull();
      expect(toast.info).toHaveBeenCalledWith('Please log in again');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  describe('Edge Cases', () => {
    it('should handle email without @ symbol gracefully', async () => {
      const userInfo = {
        userId: '11111',
        userEmail: 'invalidemail',
      };
      localStorage.setItem('userInfo', JSON.stringify(userInfo));

      renderWithRouter(<ProfilePage />);

      await waitFor(() => {
        expect(screen.getByText('My Profile')).toBeInTheDocument();
      });

      // Should return the full email as name when @ is not found
      // The text appears twice - once as name (extracted from email) and once as email itself
      const matches = screen.getAllByText('invalidemail');
      expect(matches).toHaveLength(2); // Name and Email fields both show "invalidemail"
    });

    it('should handle very long userId and email', async () => {
      const userInfo = {
        userId: 'a'.repeat(100),
        userEmail: 'very.long.email.address.that.should.wrap@example.com',
        userName: 'Test User',
      };
      localStorage.setItem('userInfo', JSON.stringify(userInfo));

      renderWithRouter(<ProfilePage />);

      await waitFor(() => {
        expect(screen.getByText('My Profile')).toBeInTheDocument();
      });

      expect(screen.getByText('a'.repeat(100))).toBeInTheDocument();
      expect(
        screen.getByText('very.long.email.address.that.should.wrap@example.com')
      ).toBeInTheDocument();
    });

    it('should handle userInfo as null object', async () => {
      localStorage.setItem('userInfo', JSON.stringify(null));

      renderWithRouter(<ProfilePage />);

      await waitFor(() => {
        expect(screen.getByText('Profile Error')).toBeInTheDocument();
      });
    });

    it('should handle userInfo as empty object', async () => {
      localStorage.setItem('userInfo', JSON.stringify({}));

      renderWithRouter(<ProfilePage />);

      await waitFor(() => {
        expect(screen.getByText('Profile Error')).toBeInTheDocument();
      });
    });
  });

  describe('UI Rendering', () => {
    it('should render profile card with proper structure', async () => {
      const userInfo = {
        userId: '12345',
        userEmail: 'test@example.com',
        userName: 'Test User',
      };
      localStorage.setItem('userInfo', JSON.stringify(userInfo));

      renderWithRouter(<ProfilePage />);

      await waitFor(() => {
        expect(screen.getByText('My Profile')).toBeInTheDocument();
      });

      // Check for proper semantic structure
      const heading = screen.getByRole('heading', { name: 'My Profile' });
      expect(heading.tagName).toBe('H2');

      // Check that all three fields are present
      const fields = screen.getAllByText(/:/);
      expect(fields).toHaveLength(3); // Name:, Email:, User ID:
    });

    it('should not display loading state after data loads', async () => {
      const userInfo = {
        userId: '12345',
        userEmail: 'test@example.com',
        userName: 'Test User',
      };
      localStorage.setItem('userInfo', JSON.stringify(userInfo));

      renderWithRouter(<ProfilePage />);

      await waitFor(() => {
        expect(screen.getByText('My Profile')).toBeInTheDocument();
      });

      expect(screen.queryByText('Loading profile...')).not.toBeInTheDocument();
    });
  });

  describe('Console Error Handling', () => {
    it('should log console error when JSON parsing fails', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      localStorage.setItem('userInfo', 'invalid-json');

      renderWithRouter(<ProfilePage />);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Error parsing userInfo:',
          expect.any(Error)
        );
      });

      consoleErrorSpy.mockRestore();
    });
  });
});
