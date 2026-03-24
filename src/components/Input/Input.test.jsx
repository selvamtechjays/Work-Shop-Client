import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Input from './Input';

describe('Input Component', () => {
  const defaultProps = {
    name: 'email',
    value: '',
    onChange: vi.fn(),
    label: 'Email Address',
  };

  it('should render input with label', () => {
    render(<Input {...defaultProps} />);
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
  });

  it('should render required asterisk when required prop is true', () => {
    render(<Input {...defaultProps} required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('should render with correct type attribute', () => {
    render(<Input {...defaultProps} type="password" />);
    const input = screen.getByLabelText('Email Address');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('should render with placeholder', () => {
    render(<Input {...defaultProps} placeholder="Enter your email" />);
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
  });

  it('should call onChange when input value changes', () => {
    const handleChange = vi.fn();
    render(<Input {...defaultProps} onChange={handleChange} />);
    const input = screen.getByLabelText('Email Address');
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('should call onBlur when input loses focus', () => {
    const handleBlur = vi.fn();
    render(<Input {...defaultProps} onBlur={handleBlur} />);
    const input = screen.getByLabelText('Email Address');
    fireEvent.blur(input);
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('should display error message when error prop is provided', () => {
    render(<Input {...defaultProps} error="Invalid email address" />);
    expect(screen.getByText('Invalid email address')).toBeInTheDocument();
  });

  it('should have aria-invalid="true" when error is present', () => {
    render(<Input {...defaultProps} error="Invalid email" />);
    const input = screen.getByLabelText('Email Address');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('should have aria-describedby pointing to error message', () => {
    render(<Input {...defaultProps} error="Invalid email" />);
    const input = screen.getByLabelText('Email Address');
    const errorElement = screen.getByText('Invalid email');
    expect(input).toHaveAttribute('aria-describedby', errorElement.id);
  });

  it('should render icon when provided', () => {
    const icon = <span data-testid="test-icon">📧</span>;
    render(<Input {...defaultProps} icon={icon} />);
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('should have correct value attribute', () => {
    render(<Input {...defaultProps} value="test@example.com" />);
    const input = screen.getByLabelText('Email Address');
    expect(input).toHaveValue('test@example.com');
  });

  it('should support autoComplete attribute', () => {
    render(<Input {...defaultProps} autoComplete="email" />);
    const input = screen.getByLabelText('Email Address');
    expect(input).toHaveAttribute('autocomplete', 'email');
  });

  it('should support autoFocus attribute', () => {
    render(<Input {...defaultProps} autoFocus />);
    const input = screen.getByLabelText('Email Address');
    expect(input).toHaveFocus();
  });

  it('should apply error styling class when error is present', () => {
    const { container } = render(<Input {...defaultProps} error="Error message" />);
    const input = container.querySelector('input');
    expect(input.className).toContain('error');
  });

  it('should apply hasIcon class when icon is provided', () => {
    const icon = <span>📧</span>;
    const { container } = render(<Input {...defaultProps} icon={icon} />);
    const input = container.querySelector('input');
    expect(input.className).toContain('hasIcon');
  });

  it('should have role="alert" on error message', () => {
    render(<Input {...defaultProps} error="Invalid input" />);
    const errorElement = screen.getByText('Invalid input');
    expect(errorElement).toHaveAttribute('role', 'alert');
  });

  it('should generate unique IDs based on name prop', () => {
    render(<Input {...defaultProps} name="username" />);
    const input = screen.getByLabelText('Email Address');
    expect(input).toHaveAttribute('id', 'input-username');
  });

  it('should not render error message when error is null', () => {
    const { container } = render(<Input {...defaultProps} error={null} />);
    const errorText = container.querySelector('[role="alert"]');
    expect(errorText).not.toBeInTheDocument();
  });

  it('should not render error message when error is empty string', () => {
    const { container } = render(<Input {...defaultProps} error="" />);
    const errorText = container.querySelector('[role="alert"]');
    expect(errorText).not.toBeInTheDocument();
  });
});
