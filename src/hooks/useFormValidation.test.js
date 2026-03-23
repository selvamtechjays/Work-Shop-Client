import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useFormValidation from './useFormValidation';

describe('useFormValidation', () => {
  const mockValidationRules = {
    email: (value) => {
      if (!value) return { valid: false, message: 'Email is required' };
      if (!value.includes('@')) return { valid: false, message: 'Invalid email' };
      return { valid: true, message: '' };
    },
    password: (value) => {
      if (!value) return { valid: false, message: 'Password is required' };
      if (value.length < 6) return { valid: false, message: 'Too short' };
      return { valid: true, message: '' };
    },
  };

  const initialValues = { email: '', password: '' };

  it('should initialize with correct default values', () => {
    const { result } = renderHook(() =>
      useFormValidation(initialValues, mockValidationRules)
    );

    expect(result.current.values).toEqual({ email: '', password: '' });
    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
    expect(result.current.isSubmitting).toBe(false);
  });

  it('should update values on handleChange', () => {
    const { result } = renderHook(() =>
      useFormValidation(initialValues, mockValidationRules)
    );

    act(() => {
      result.current.handleChange({
        target: { name: 'email', value: 'test@example.com' },
      });
    });

    expect(result.current.values.email).toBe('test@example.com');
  });

  it('should clear error when field value changes', () => {
    const { result } = renderHook(() =>
      useFormValidation(initialValues, mockValidationRules)
    );

    // Set an error first
    act(() => {
      result.current.handleBlur({ target: { name: 'email' } });
    });

    expect(result.current.errors.email).toBe('Email is required');

    // Change the value - error should clear
    act(() => {
      result.current.handleChange({
        target: { name: 'email', value: 'test@example.com' },
      });
    });

    expect(result.current.errors.email).toBe('');
  });

  it('should mark field as touched on handleBlur', () => {
    const { result } = renderHook(() =>
      useFormValidation(initialValues, mockValidationRules)
    );

    act(() => {
      result.current.handleBlur({ target: { name: 'email' } });
    });

    expect(result.current.touched.email).toBe(true);
  });

  it('should validate field on blur', () => {
    const { result } = renderHook(() =>
      useFormValidation(initialValues, mockValidationRules)
    );

    act(() => {
      result.current.handleBlur({ target: { name: 'email' } });
    });

    expect(result.current.errors.email).toBe('Email is required');
  });

  it('should validate all fields on form submission', async () => {
    const { result } = renderHook(() =>
      useFormValidation(initialValues, mockValidationRules)
    );

    const mockOnSubmit = vi.fn();

    await act(async () => {
      const handleSubmit = result.current.handleSubmit(mockOnSubmit);
      await handleSubmit({ preventDefault: () => {} });
    });

    expect(result.current.errors.email).toBe('Email is required');
    expect(result.current.errors.password).toBe('Password is required');
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should call onSubmit when form is valid', async () => {
    const { result } = renderHook(() =>
      useFormValidation(initialValues, mockValidationRules)
    );

    const mockOnSubmit = vi.fn().mockResolvedValue(undefined);

    // Set valid values
    act(() => {
      result.current.handleChange({
        target: { name: 'email', value: 'test@example.com' },
      });
      result.current.handleChange({
        target: { name: 'password', value: 'password123' },
      });
    });

    await act(async () => {
      const handleSubmit = result.current.handleSubmit(mockOnSubmit);
      await handleSubmit({ preventDefault: () => {} });
    });

    expect(mockOnSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });

  it('should reset isSubmitting after submission completes', async () => {
    const { result } = renderHook(() =>
      useFormValidation(
        { email: 'test@example.com', password: 'password123' },
        mockValidationRules
      )
    );

    const mockOnSubmit = vi.fn().mockResolvedValue(undefined);

    expect(result.current.isSubmitting).toBe(false);

    await act(async () => {
      const handleSubmit = result.current.handleSubmit(mockOnSubmit);
      await handleSubmit({ preventDefault: () => {} });
    });

    expect(mockOnSubmit).toHaveBeenCalled();
    expect(result.current.isSubmitting).toBe(false);
  });

  it('should allow setting field error manually', () => {
    const { result } = renderHook(() =>
      useFormValidation(initialValues, mockValidationRules)
    );

    act(() => {
      result.current.setFieldError('email', 'Server error');
    });

    expect(result.current.errors.email).toBe('Server error');
  });

  it('should mark all fields as touched on validation', async () => {
    const { result } = renderHook(() =>
      useFormValidation(initialValues, mockValidationRules)
    );

    const mockOnSubmit = vi.fn();

    await act(async () => {
      const handleSubmit = result.current.handleSubmit(mockOnSubmit);
      await handleSubmit({ preventDefault: () => {} });
    });

    expect(result.current.touched.email).toBe(true);
    expect(result.current.touched.password).toBe(true);
  });
});
