import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import FormField from './FormField';

describe('FormField Component', () => {
  it('should render children', () => {
    render(
      <FormField label="Email" htmlFor="email">
        <input id="email" type="email" />
      </FormField>
    );

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  it('should render label when provided', () => {
    render(
      <FormField label="Email Address" htmlFor="email">
        <input id="email" type="email" />
      </FormField>
    );

    const label = screen.getByText('Email Address');
    expect(label).toBeInTheDocument();
  });

  it('should associate label with input using htmlFor', () => {
    render(
      <FormField label="Email" htmlFor="email">
        <input id="email" type="email" />
      </FormField>
    );

    const label = screen.getByText('Email');
    expect(label).toHaveAttribute('for', 'email');
  });

  it('should show required indicator when required prop is true', () => {
    render(
      <FormField label="Email" htmlFor="email" required>
        <input id="email" type="email" />
      </FormField>
    );

    const requiredIndicator = screen.getByText('*');
    expect(requiredIndicator).toBeInTheDocument();
    expect(requiredIndicator).toHaveAttribute('aria-label', 'required');
  });

  it('should not show required indicator when required prop is false', () => {
    render(
      <FormField label="Email" htmlFor="email" required={false}>
        <input id="email" type="email" />
      </FormField>
    );

    const requiredIndicator = screen.queryByText('*');
    expect(requiredIndicator).not.toBeInTheDocument();
  });

  it('should display error message when error prop is provided', () => {
    render(
      <FormField label="Email" htmlFor="email" error="Email is required">
        <input id="email" type="email" />
      </FormField>
    );

    const errorMessage = screen.getByText('Email is required');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass('form-error');
  });

  it('should have error div with role="alert" and aria-live="polite"', () => {
    render(
      <FormField label="Email" htmlFor="email" error="Invalid email">
        <input id="email" type="email" />
      </FormField>
    );

    const errorDiv = screen.getByRole('alert');
    expect(errorDiv).toHaveAttribute('aria-live', 'polite');
    expect(errorDiv).toHaveTextContent('Invalid email');
  });

  it('should display helper text when no error', () => {
    render(
      <FormField label="Email" htmlFor="email" helperText="Enter a valid email address">
        <input id="email" type="email" />
      </FormField>
    );

    const helperText = screen.getByText('Enter a valid email address');
    expect(helperText).toBeInTheDocument();
    expect(helperText).toHaveClass('form-helper-text');
  });

  it('should not display helper text when error exists', () => {
    render(
      <FormField
        label="Email"
        htmlFor="email"
        error="Email is required"
        helperText="Enter a valid email address"
      >
        <input id="email" type="email" />
      </FormField>
    );

    const helperText = screen.queryByText('Enter a valid email address');
    expect(helperText).not.toBeInTheDocument();

    const errorMessage = screen.getByText('Email is required');
    expect(errorMessage).toBeInTheDocument();
  });

  it('should have correct error ID format', () => {
    render(
      <FormField label="Email" htmlFor="email-input" error="Invalid email">
        <input id="email-input" type="email" />
      </FormField>
    );

    const errorDiv = screen.getByRole('alert');
    expect(errorDiv).toHaveAttribute('id', 'error-email-input');
  });

  it('should render without label', () => {
    render(
      <FormField htmlFor="email">
        <input id="email" type="email" />
      </FormField>
    );

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();

    const label = screen.queryByRole('label');
    expect(label).not.toBeInTheDocument();
  });

  it('should have form-field class', () => {
    const { container } = render(
      <FormField label="Email" htmlFor="email">
        <input id="email" type="email" />
      </FormField>
    );

    const formField = container.querySelector('.form-field');
    expect(formField).toBeInTheDocument();
  });
});
