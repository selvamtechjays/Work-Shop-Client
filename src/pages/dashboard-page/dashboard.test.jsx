import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Dashboard from './dashboard';
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

// Mock the child components
vi.mock('../../components/card', () => ({
  default: () => <div>Card Component</div>,
}));

vi.mock('../../components/test-card', () => ({
  default: () => <div>Test Card Component</div>,
}));

vi.mock('../history/user-histroy', () => ({
  default: () => <div>History Page</div>,
}));

vi.mock('../../components/chart-parent', () => ({
  default: () => <div>Progress Component</div>,
}));

vi.mock('../profile/profile-page', () => ({
  default: () => <div>Profile Page</div>,
}));

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Dashboard Component - Profile Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    // Set up valid user info
    const userInfo = {
      userId: '12345',
      userEmail: 'test@example.com',
    };
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
  });

  describe('Profile Navigation Link', () => {
    it('should display Profile link in sidebar', () => {
      renderWithRouter(<Dashboard />);

      const profileLink = screen.getByText(/Profile/i);
      expect(profileLink).toBeInTheDocument();
    });

    it('should display Profile link between Progress and Logout', () => {
      renderWithRouter(<Dashboard />);

      const sidebar = screen.getByRole('list');
      const listItems = sidebar.querySelectorAll('li');

      // Find the indices of Progress, Profile, and Logout
      let progressIndex = -1;
      let profileIndex = -1;
      let logoutIndex = -1;

      listItems.forEach((item, index) => {
        const text = item.textContent;
        if (text.includes('Progress')) progressIndex = index;
        if (text.includes('Profile')) profileIndex = index;
        if (text.includes('Logout')) logoutIndex = index;
      });

      expect(progressIndex).toBeLessThan(profileIndex);
      expect(profileIndex).toBeLessThan(logoutIndex);
    });

    it('should render Profile icon', () => {
      renderWithRouter(<Dashboard />);

      // The Profile link should contain text "Profile"
      const profileLink = screen.getByText(/Profile/i);
      expect(profileLink).toBeInTheDocument();
    });
  });

  describe('Profile Navigation Interaction', () => {
    it('should show active state when Profile link is clicked', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Dashboard />);

      const profileLink = screen.getByText(/Profile/i).closest('li');
      await user.click(profileLink);

      await waitFor(() => {
        expect(profileLink).toHaveClass('active');
      });
    });

    it('should render ProfilePage component when Profile is clicked', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Dashboard />);

      const profileLink = screen.getByText(/Profile/i).closest('li');
      await user.click(profileLink);

      await waitFor(() => {
        expect(screen.getByText('Profile Page')).toBeInTheDocument();
      });
    });

    it('should remove active state from Dashboard when Profile is clicked', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Dashboard />);

      const dashboardLink = screen.getByText(/Dashboard/i).closest('li');
      const profileLink = screen.getByText(/Profile/i).closest('li');

      // Initially Dashboard should be active
      expect(dashboardLink).toHaveClass('active');

      // Click Profile
      await user.click(profileLink);

      await waitFor(() => {
        expect(profileLink).toHaveClass('active');
        expect(dashboardLink).not.toHaveClass('active');
      });
    });

    it('should log console message when Profile link is clicked', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const user = userEvent.setup();
      renderWithRouter(<Dashboard />);

      const profileLink = screen.getByText(/Profile/i).closest('li');
      await user.click(profileLink);

      await waitFor(() => {
        expect(consoleLogSpy).toHaveBeenCalledWith('Profile link clicked');
      });

      consoleLogSpy.mockRestore();
    });
  });

  describe('Profile Page Rendering in Content Area', () => {
    it('should render ProfilePage in row-2 div when Profile is active', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Dashboard />);

      const profileLink = screen.getByText(/Profile/i).closest('li');
      await user.click(profileLink);

      await waitFor(() => {
        expect(screen.getByText('Profile Page')).toBeInTheDocument();
      });

      // Ensure other components are not rendered
      expect(screen.queryByText('Test Card Component')).not.toBeInTheDocument();
      expect(screen.queryByText('History Page')).not.toBeInTheDocument();
      expect(screen.queryByText('Progress Component')).not.toBeInTheDocument();
    });

    it('should not render ProfilePage when other links are active', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Dashboard />);

      // Click History
      const historyLink = screen.getByText(/History/i).closest('li');
      await user.click(historyLink);

      await waitFor(() => {
        expect(screen.getByText('History Page')).toBeInTheDocument();
      });

      expect(screen.queryByText('Profile Page')).not.toBeInTheDocument();
    });
  });

  describe('All Navigation Links', () => {
    it('should render all navigation links in correct order', () => {
      renderWithRouter(<Dashboard />);

      const sidebar = screen.getByRole('list');
      const listItems = sidebar.querySelectorAll('li');

      expect(listItems).toHaveLength(5); // Dashboard, History, Progress, Profile, Logout

      expect(listItems[0].textContent).toContain('Dashboard');
      expect(listItems[1].textContent).toContain('History');
      expect(listItems[2].textContent).toContain('Progress');
      expect(listItems[3].textContent).toContain('Profile');
      expect(listItems[4].textContent).toContain('Logout');
    });

    it('should navigate between all links correctly', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Dashboard />);

      // Test Dashboard (default)
      expect(screen.getByText('Test Card Component')).toBeInTheDocument();

      // Test History
      const historyLink = screen.getByText(/History/i).closest('li');
      await user.click(historyLink);
      await waitFor(() => {
        expect(screen.getByText('History Page')).toBeInTheDocument();
      });

      // Test Progress
      const progressLink = screen.getByText(/Progress/i).closest('li');
      await user.click(progressLink);
      await waitFor(() => {
        expect(screen.getByText('Progress Component')).toBeInTheDocument();
      });

      // Test Profile
      const profileLink = screen.getByText(/Profile/i).closest('li');
      await user.click(profileLink);
      await waitFor(() => {
        expect(screen.getByText('Profile Page')).toBeInTheDocument();
      });

      // Go back to Dashboard
      const dashboardLink = screen.getByText(/Dashboard/i).closest('li');
      await user.click(dashboardLink);
      await waitFor(() => {
        expect(screen.getByText('Test Card Component')).toBeInTheDocument();
      });
    });
  });

  describe('Sidebar Styling', () => {
    it('should apply correct CSS classes to Profile link', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Dashboard />);

      const profileLink = screen.getByText(/Profile/i).closest('li');

      // Initially should have side-link class
      expect(profileLink).toHaveClass('side-link');

      // After clicking should have active class
      await user.click(profileLink);
      await waitFor(() => {
        expect(profileLink).toHaveClass('active');
      });
    });

    it('should have correct marginTop style on Profile link', () => {
      renderWithRouter(<Dashboard />);

      const profileLink = screen.getByText(/Profile/i).closest('li');
      expect(profileLink).toHaveStyle({ marginTop: '30px' });
    });
  });
});
