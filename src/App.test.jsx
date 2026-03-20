import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App, { ProtectedRoutes } from './App';

// Mock all page components
vi.mock('./pages/login/landing-page', () => ({
  default: () => <div>Landing Page</div>,
}));

vi.mock('./pages/signup/signup-page', () => ({
  default: () => <div>Signup Page</div>,
}));

vi.mock('./pages/forget-password-page/forget-password', () => ({
  ForgetPasswordForm: () => <div>Forget Password Form</div>,
  UpdatePasswordForm: () => <div>Update Password Form</div>,
}));

vi.mock('./pages/dashboard-page/dashboard', () => ({
  default: ({ children }) => {
    // Mock react-router-dom for dashboard
    const { Outlet } = require('react-router-dom');
    return (
      <div>
        <div>Dashboard</div>
        <Outlet />
      </div>
    );
  },
}));

vi.mock('./pages/score-board/score-board-page', () => ({
  default: () => <div>Scoreboard Page</div>,
}));

vi.mock('./pages/history/user-histroy', () => ({
  default: () => <div>History Page</div>,
}));

vi.mock('./components/chart-parent', () => ({
  default: () => <div>Progress Component</div>,
}));

vi.mock('./components/test-card', () => ({
  default: () => <div>Test Component</div>,
}));

vi.mock('./pages/profile/profile-page', () => ({
  default: () => <div>Profile Page</div>,
}));

// Mock react-toastify
vi.mock('react-toastify', () => ({
  ToastContainer: () => <div>Toast Container</div>,
  toast: {
    info: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('App Component - Profile Route Configuration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Profile Route', () => {
    it('should render ProfilePage at /dashboard/profile when authenticated', async () => {
      const userInfo = {
        userId: '12345',
        userEmail: 'test@example.com',
      };
      localStorage.setItem('userInfo', JSON.stringify(userInfo));

      render(
        <MemoryRouter initialEntries={['/dashboard/profile']}>
          <App />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Profile Page')).toBeInTheDocument();
      });
    });

    it('should redirect to login when accessing /dashboard/profile without authentication', async () => {
      render(
        <MemoryRouter initialEntries={['/dashboard/profile']}>
          <App />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Landing Page')).toBeInTheDocument();
      });

      expect(screen.queryByText('Profile Page')).not.toBeInTheDocument();
    });
  });

  describe('Dashboard Child Routes', () => {
    it('should render default dashboard content at /dashboard', async () => {
      const userInfo = {
        userId: '12345',
        userEmail: 'test@example.com',
      };
      localStorage.setItem('userInfo', JSON.stringify(userInfo));

      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <App />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
      });
    });

    it('should render HistoryPage at /dashboard/history when authenticated', async () => {
      const userInfo = {
        userId: '12345',
        userEmail: 'test@example.com',
      };
      localStorage.setItem('userInfo', JSON.stringify(userInfo));

      render(
        <MemoryRouter initialEntries={['/dashboard/history']}>
          <App />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('History Page')).toBeInTheDocument();
      });
    });

    it('should render ParentComponent at /dashboard/progress when authenticated', async () => {
      const userInfo = {
        userId: '12345',
        userEmail: 'test@example.com',
      };
      localStorage.setItem('userInfo', JSON.stringify(userInfo));

      render(
        <MemoryRouter initialEntries={['/dashboard/progress']}>
          <App />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Progress Component')).toBeInTheDocument();
      });
    });
  });

  describe('Public Routes', () => {
    it('should render LandingPage at /', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );

      expect(screen.getByText('Landing Page')).toBeInTheDocument();
    });

    it('should render SignupPage at /signup', () => {
      render(
        <MemoryRouter initialEntries={['/signup']}>
          <App />
        </MemoryRouter>
      );

      expect(screen.getByText('Signup Page')).toBeInTheDocument();
    });

    it('should render ForgetPasswordForm at /forgetPassword', () => {
      render(
        <MemoryRouter initialEntries={['/forgetPassword']}>
          <App />
        </MemoryRouter>
      );

      expect(screen.getByText('Forget Password Form')).toBeInTheDocument();
    });
  });
});

describe('ProtectedRoutes Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should render children when user is authenticated', () => {
    const userInfo = {
      userId: '12345',
      userEmail: 'test@example.com',
    };
    localStorage.setItem('userInfo', JSON.stringify(userInfo));

    render(
      <MemoryRouter>
        <ProtectedRoutes>
          <div>Protected Content</div>
        </ProtectedRoutes>
      </MemoryRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should redirect to / when user is not authenticated', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <ProtectedRoutes>
          <div>Protected Content</div>
        </ProtectedRoutes>
      </MemoryRouter>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should redirect when userInfo exists but has no email', () => {
    const userInfo = {
      userId: '12345',
    };
    localStorage.setItem('userInfo', JSON.stringify(userInfo));

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <ProtectedRoutes>
          <div>Protected Content</div>
        </ProtectedRoutes>
      </MemoryRouter>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should redirect when userInfo is null', () => {
    localStorage.setItem('userInfo', JSON.stringify(null));

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <ProtectedRoutes>
          <div>Protected Content</div>
        </ProtectedRoutes>
      </MemoryRouter>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should redirect when localStorage has invalid JSON', () => {
    localStorage.setItem('userInfo', 'invalid-json');

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <ProtectedRoutes>
          <div>Protected Content</div>
        </ProtectedRoutes>
      </MemoryRouter>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});
