import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PasswordInput from './PasswordInput';

describe('PasswordInput Component', () => {
  it('should render password input masked by default', () => {
    render(
      <PasswordInput
        name="password"
        value=""
        onChange={() => {}}
        placeholder="Enter password"
      />
    );

    const input = screen.getByPlaceholderText('Enter password');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('should toggle password visibility when eye icon is clicked', () => {
    render(
      <PasswordInput
        name="password"
        value="secret123"
        onChange={() => {}}
        placeholder="Enter password"
      />
    );

    const input = screen.getByPlaceholderText('Enter password');
    const toggleButton = screen.getByRole('button', { name: /show password/i });

    // Initially password should be hidden
    expect(input).toHaveAttribute('type', 'password');

    // Click to show password
    fireEvent.click(toggleButton);
    expect(input).toHaveAttribute('type', 'text');

    // Click again to hide password
    fireEvent.click(toggleButton);
    expect(input).toHaveAttribute('type', 'password');
  });

  it('should change toggle button aria-label based on visibility', () => {
    render(
      <PasswordInput
        name="password"
        value="secret123"
        onChange={() => {}}
        placeholder="Enter password"
      />
    );

    let toggleButton = screen.getByRole('button', { name: /show password/i });
    expect(toggleButton).toHaveAttribute('aria-label', 'Show password');

    fireEvent.click(toggleButton);

    toggleButton = screen.getByRole('button', { name: /hide password/i });
    expect(toggleButton).toHaveAttribute('aria-label', 'Hide password');
  });

  it('should call onChange when user types', () => {
    const handleChange = vi.fn();
    render(
      <PasswordInput
        name="password"
        value=""
        onChange={handleChange}
        placeholder="Enter password"
      />
    );

    const input = screen.getByPlaceholderText('Enter password');
    fireEvent.change(input, { target: { value: 'newpassword' } });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('should call onBlur when input loses focus', () => {
    const handleBlur = vi.fn();
    render(
      <PasswordInput
        name="password"
        value=""
        onChange={() => {}}
        onBlur={handleBlur}
        placeholder="Enter password"
      />
    );

    const input = screen.getByPlaceholderText('Enter password');
    fireEvent.blur(input);

    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('should pass error prop to Input component', () => {
    render(
      <PasswordInput
        name="password"
        value=""
        onChange={() => {}}
        placeholder="Enter password"
        error="Password is required"
      />
    );

    const input = screen.getByPlaceholderText('Enter password');
    expect(input).toHaveClass('error');
  });

  it('should set autoComplete attribute', () => {
    render(
      <PasswordInput
        name="password"
        value=""
        onChange={() => {}}
        placeholder="Enter password"
        autoComplete="current-password"
      />
    );

    const input = screen.getByPlaceholderText('Enter password');
    expect(input).toHaveAttribute('autocomplete', 'current-password');
  });

  it('should have toggle button with tabIndex 0', () => {
    render(
      <PasswordInput
        name="password"
        value=""
        onChange={() => {}}
        placeholder="Enter password"
      />
    );

    const toggleButton = screen.getByRole('button', { name: /show password/i });
    expect(toggleButton).toHaveAttribute('tabindex', '0');
  });

  it('should be wrapped in password-input-wrapper', () => {
    const { container } = render(
      <PasswordInput
        name="password"
        value=""
        onChange={() => {}}
        placeholder="Enter password"
      />
    );

    const wrapper = container.querySelector('.password-input-wrapper');
    expect(wrapper).toBeInTheDocument();
  });
});
