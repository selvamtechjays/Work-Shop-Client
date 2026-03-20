import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';

describe('PasswordStrengthIndicator', () => {
  it('should not render when password is empty', () => {
    const { container } = render(<PasswordStrengthIndicator password="" />);
    expect(container.firstChild).toBeNull();
  });

  it('should render weak strength for weak password', () => {
    render(<PasswordStrengthIndicator password="pass" />);
    expect(screen.getByText('Weak')).toBeInTheDocument();
  });

  it('should render medium strength for medium password', () => {
    render(<PasswordStrengthIndicator password="password123" />);
    expect(screen.getByText('Medium')).toBeInTheDocument();
  });

  it('should render strong strength for strong password', () => {
    render(<PasswordStrengthIndicator password="MyP@ss123456!" />);
    expect(screen.getByText('Strong')).toBeInTheDocument();
  });

  it('should have proper ARIA attributes', () => {
    render(<PasswordStrengthIndicator password="test" />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveAttribute('aria-valuenow');
    expect(progressbar).toHaveAttribute('aria-valuemin', '0');
    expect(progressbar).toHaveAttribute('aria-valuemax', '6');
    expect(progressbar).toHaveAttribute('aria-label', 'Password strength');
  });
});
