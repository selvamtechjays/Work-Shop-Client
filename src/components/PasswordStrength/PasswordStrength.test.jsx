import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PasswordStrength from './PasswordStrength';

describe('PasswordStrength Component', () => {
  it('should render null when password is empty', () => {
    const { container } = render(<PasswordStrength password="" />);
    expect(container.firstChild).toBeNull();
  });

  it('should show weak strength for weak password', () => {
    render(<PasswordStrength password="test" />);
    expect(screen.getByText('Weak')).toBeInTheDocument();
  });

  it('should show medium strength for medium password', () => {
    render(<PasswordStrength password="testpassword123" />);
    expect(screen.getByText('Medium')).toBeInTheDocument();
  });

  it('should show strong strength for strong password', () => {
    render(<PasswordStrength password="Test@1234" />);
    expect(screen.getByText('Strong')).toBeInTheDocument();
  });

  it('should display all password requirements', () => {
    render(<PasswordStrength password="test" />);
    expect(screen.getByText(/At least 8 characters/)).toBeInTheDocument();
    expect(screen.getByText(/One uppercase letter/)).toBeInTheDocument();
    expect(screen.getByText(/One lowercase letter/)).toBeInTheDocument();
    expect(screen.getByText(/One number/)).toBeInTheDocument();
    expect(screen.getByText(/One special character/)).toBeInTheDocument();
  });

  it('should show checkmark for met length requirement', () => {
    const { container } = render(<PasswordStrength password="testtest" />);
    const requirements = container.querySelectorAll('li');
    const lengthRequirement = Array.from(requirements).find(li =>
      li.textContent.includes('At least 8 characters')
    );
    expect(lengthRequirement.textContent).toContain('✓');
  });

  it('should show circle for unmet length requirement', () => {
    const { container } = render(<PasswordStrength password="test" />);
    const requirements = container.querySelectorAll('li');
    const lengthRequirement = Array.from(requirements).find(li =>
      li.textContent.includes('At least 8 characters')
    );
    expect(lengthRequirement.textContent).toContain('○');
  });

  it('should show checkmark for met uppercase requirement', () => {
    const { container } = render(<PasswordStrength password="Test" />);
    const requirements = container.querySelectorAll('li');
    const uppercaseRequirement = Array.from(requirements).find(li =>
      li.textContent.includes('One uppercase letter')
    );
    expect(uppercaseRequirement.textContent).toContain('✓');
  });

  it('should show checkmark for met lowercase requirement', () => {
    const { container } = render(<PasswordStrength password="test" />);
    const requirements = container.querySelectorAll('li');
    const lowercaseRequirement = Array.from(requirements).find(li =>
      li.textContent.includes('One lowercase letter')
    );
    expect(lowercaseRequirement.textContent).toContain('✓');
  });

  it('should show checkmark for met number requirement', () => {
    const { container } = render(<PasswordStrength password="test123" />);
    const requirements = container.querySelectorAll('li');
    const numberRequirement = Array.from(requirements).find(li =>
      li.textContent.includes('One number')
    );
    expect(numberRequirement.textContent).toContain('✓');
  });

  it('should show checkmark for met special character requirement', () => {
    const { container } = render(<PasswordStrength password="test@" />);
    const requirements = container.querySelectorAll('li');
    const specialRequirement = Array.from(requirements).find(li =>
      li.textContent.includes('One special character')
    );
    expect(specialRequirement.textContent).toContain('✓');
  });

  it('should show all checkmarks for strong password', () => {
    const { container } = render(<PasswordStrength password="Test@1234" />);
    const requirements = container.querySelectorAll('li');
    // Count requirements that show checkmark (✓)
    const metRequirements = Array.from(requirements).filter(li => li.textContent.includes('✓'));
    expect(metRequirements).toHaveLength(5);
  });

  it('should have progress bar with correct aria attributes', () => {
    render(<PasswordStrength password="Test@1234" />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute('aria-valuenow', '100');
    expect(progressBar).toHaveAttribute('aria-valuemin', '0');
    expect(progressBar).toHaveAttribute('aria-valuemax', '100');
  });

  it('should have aria-valuenow=33 for weak password', () => {
    render(<PasswordStrength password="test" />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '33');
  });

  it('should have aria-valuenow=66 for medium password', () => {
    render(<PasswordStrength password="testpassword123" />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '66');
  });

  it('should have aria-live="polite" on strength label', () => {
    render(<PasswordStrength password="test" />);
    const label = screen.getByText('Weak');
    expect(label).toHaveAttribute('aria-live', 'polite');
  });

  it('should apply correct width for weak strength (33%)', () => {
    const { container } = render(<PasswordStrength password="test" />);
    const bar = container.querySelector('[role="progressbar"]');
    expect(bar).toHaveStyle({ width: '33%' });
  });

  it('should apply correct width for medium strength (66%)', () => {
    const { container } = render(<PasswordStrength password="testpassword123" />);
    const bar = container.querySelector('[role="progressbar"]');
    expect(bar).toHaveStyle({ width: '66%' });
  });

  it('should apply correct width for strong strength (100%)', () => {
    const { container } = render(<PasswordStrength password="Test@1234" />);
    const bar = container.querySelector('[role="progressbar"]');
    expect(bar).toHaveStyle({ width: '100%' });
  });

  it('should apply weak color class to bar and label for weak password', () => {
    const { container } = render(<PasswordStrength password="test" />);
    const bar = container.querySelector('[role="progressbar"]');
    const label = screen.getByText('Weak');
    expect(bar.className).toContain('weak');
    expect(label.className).toContain('weak');
  });

  it('should apply medium color class to bar and label for medium password', () => {
    const { container } = render(<PasswordStrength password="testpassword123" />);
    const bar = container.querySelector('[role="progressbar"]');
    const label = screen.getByText('Medium');
    expect(bar.className).toContain('medium');
    expect(label.className).toContain('medium');
  });

  it('should apply strong color class to bar and label for strong password', () => {
    const { container } = render(<PasswordStrength password="Test@1234" />);
    const bar = container.querySelector('[role="progressbar"]');
    const label = screen.getByText('Strong');
    expect(bar.className).toContain('strong');
    expect(label.className).toContain('strong');
  });

  it('should capitalize strength label correctly', () => {
    render(<PasswordStrength password="test" />);
    expect(screen.getByText('Weak')).toBeInTheDocument();
    expect(screen.queryByText('weak')).not.toBeInTheDocument();
  });
});
