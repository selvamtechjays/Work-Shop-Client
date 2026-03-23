import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Input from './Input';

describe('Input Component', () => {
  it('should render input with correct type and placeholder', () => {
    render(
      <Input
        name="email"
        type="email"
        placeholder="Enter email"
        value=""
        onChange={() => {}}
      />
    );

    const input = screen.getByPlaceholderText('Enter email');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'email');
  });

  it('should display the correct value', () => {
    render(
      <Input
        name="email"
        type="email"
        placeholder="Enter email"
        value="test@example.com"
        onChange={() => {}}
      />
    );

    const input = screen.getByPlaceholderText('Enter email');
    expect(input).toHaveValue('test@example.com');
  });

  it('should call onChange handler when user types', () => {
    const handleChange = vi.fn();
    render(
      <Input
        name="email"
        type="email"
        placeholder="Enter email"
        value=""
        onChange={handleChange}
      />
    );

    const input = screen.getByPlaceholderText('Enter email');
    fireEvent.change(input, { target: { value: 'test@example.com' } });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('should call onBlur handler when input loses focus', () => {
    const handleBlur = vi.fn();
    render(
      <Input
        name="email"
        type="email"
        placeholder="Enter email"
        value=""
        onChange={() => {}}
        onBlur={handleBlur}
      />
    );

    const input = screen.getByPlaceholderText('Enter email');
    fireEvent.blur(input);

    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('should apply error className when error prop is provided', () => {
    render(
      <Input
        name="email"
        type="email"
        placeholder="Enter email"
        value=""
        onChange={() => {}}
        error="Invalid email"
      />
    );

    const input = screen.getByPlaceholderText('Enter email');
    expect(input).toHaveClass('error');
  });

  it('should set aria-invalid attribute when error exists', () => {
    render(
      <Input
        name="email"
        type="email"
        placeholder="Enter email"
        value=""
        onChange={() => {}}
        error="Invalid email"
      />
    );

    const input = screen.getByPlaceholderText('Enter email');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('should set aria-invalid to false when no error', () => {
    render(
      <Input
        name="email"
        type="email"
        placeholder="Enter email"
        value=""
        onChange={() => {}}
      />
    );

    const input = screen.getByPlaceholderText('Enter email');
    expect(input).toHaveAttribute('aria-invalid', 'false');
  });

  it('should respect disabled prop', () => {
    render(
      <Input
        name="email"
        type="email"
        placeholder="Enter email"
        value=""
        onChange={() => {}}
        disabled
      />
    );

    const input = screen.getByPlaceholderText('Enter email');
    expect(input).toBeDisabled();
  });

  it('should set autoComplete attribute', () => {
    render(
      <Input
        name="email"
        type="email"
        placeholder="Enter email"
        value=""
        onChange={() => {}}
        autoComplete="email"
      />
    );

    const input = screen.getByPlaceholderText('Enter email');
    expect(input).toHaveAttribute('autocomplete', 'email');
  });

  it('should set aria-label', () => {
    render(
      <Input
        name="email"
        type="email"
        placeholder="Enter email"
        value=""
        onChange={() => {}}
        ariaLabel="Email address"
      />
    );

    const input = screen.getByPlaceholderText('Enter email');
    expect(input).toHaveAttribute('aria-label', 'Email address');
  });

  it('should use placeholder as aria-label when ariaLabel not provided', () => {
    render(
      <Input
        name="email"
        type="email"
        placeholder="Enter email"
        value=""
        onChange={() => {}}
      />
    );

    const input = screen.getByPlaceholderText('Enter email');
    expect(input).toHaveAttribute('aria-label', 'Enter email');
  });

  it('should set required attribute', () => {
    render(
      <Input
        name="email"
        type="email"
        placeholder="Enter email"
        value=""
        onChange={() => {}}
        required
      />
    );

    const input = screen.getByPlaceholderText('Enter email');
    expect(input).toBeRequired();
  });
});
