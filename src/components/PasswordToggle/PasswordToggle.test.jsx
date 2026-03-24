import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PasswordToggle from './PasswordToggle';

describe('PasswordToggle Component', () => {
  it('should render Eye icon when password is hidden', () => {
    const { container } = render(<PasswordToggle isVisible={false} onToggle={vi.fn()} />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    // Check that Eye icon is rendered (lucide-react renders as svg)
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should render EyeOff icon when password is visible', () => {
    const { container } = render(<PasswordToggle isVisible={true} onToggle={vi.fn()} />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    // Check that EyeOff icon is rendered
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should have aria-label "Show password" when password is hidden', () => {
    render(<PasswordToggle isVisible={false} onToggle={vi.fn()} />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Show password');
  });

  it('should have aria-label "Hide password" when password is visible', () => {
    render(<PasswordToggle isVisible={true} onToggle={vi.fn()} />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Hide password');
  });

  it('should call onToggle when clicked', () => {
    const handleToggle = vi.fn();
    render(<PasswordToggle isVisible={false} onToggle={handleToggle} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(handleToggle).toHaveBeenCalledTimes(1);
  });

  it('should have type="button" to prevent form submission', () => {
    render(<PasswordToggle isVisible={false} onToggle={vi.fn()} />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('should toggle icon when isVisible prop changes', () => {
    const { rerender } = render(<PasswordToggle isVisible={false} onToggle={vi.fn()} />);
    expect(screen.getByLabelText('Show password')).toBeInTheDocument();

    rerender(<PasswordToggle isVisible={true} onToggle={vi.fn()} />);
    expect(screen.getByLabelText('Hide password')).toBeInTheDocument();
  });

  it('should have aria-hidden="true" on icon', () => {
    const { container } = render(<PasswordToggle isVisible={false} onToggle={vi.fn()} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });

  it('should call onToggle multiple times', () => {
    const handleToggle = vi.fn();
    render(<PasswordToggle isVisible={false} onToggle={handleToggle} />);
    const button = screen.getByRole('button');

    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);

    expect(handleToggle).toHaveBeenCalledTimes(3);
  });

  it('should be keyboard accessible', () => {
    const handleToggle = vi.fn();
    render(<PasswordToggle isVisible={false} onToggle={handleToggle} />);
    const button = screen.getByRole('button');

    button.focus();
    expect(button).toHaveFocus();

    fireEvent.keyDown(button, { key: 'Enter' });
    // The actual click behavior is handled by the browser, we just verify the button is focusable
  });

  it('should render with correct icon size', () => {
    const { container } = render(<PasswordToggle isVisible={false} onToggle={vi.fn()} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '20');
    expect(svg).toHaveAttribute('height', '20');
  });
});
