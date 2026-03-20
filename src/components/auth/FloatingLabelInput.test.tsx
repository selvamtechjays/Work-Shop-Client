import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FloatingLabelInput } from './FloatingLabelInput';

describe('FloatingLabelInput', () => {
  const mockOnChange = vi.fn();
  const mockOnBlur = vi.fn();

  it('should render input with label', () => {
    render(
      <FloatingLabelInput
        id="test-input"
        label="Test Label"
        type="text"
        value=""
        onChange={mockOnChange}
      />
    );

    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
  });

  it('should show required asterisk when required is true', () => {
    render(
      <FloatingLabelInput
        id="test-input"
        label="Test Label"
        type="text"
        value=""
        onChange={mockOnChange}
        required
      />
    );

    const label = screen.getByText((content, element) => {
      return element?.tagName === 'LABEL' && content.includes('Test Label');
    });
    expect(label).toBeInTheDocument();
  });

  it('should call onChange when input value changes', () => {
    render(
      <FloatingLabelInput
        id="test-input"
        label="Test Label"
        type="text"
        value=""
        onChange={mockOnChange}
      />
    );

    const input = screen.getByLabelText('Test Label');
    fireEvent.change(input, { target: { value: 'test value' } });

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('should call onBlur when input loses focus', () => {
    render(
      <FloatingLabelInput
        id="test-input"
        label="Test Label"
        type="text"
        value=""
        onChange={mockOnChange}
        onBlur={mockOnBlur}
      />
    );

    const input = screen.getByLabelText('Test Label');
    fireEvent.blur(input);

    expect(mockOnBlur).toHaveBeenCalled();
  });

  it('should display error message when error prop is provided', () => {
    render(
      <FloatingLabelInput
        id="test-input"
        label="Test Label"
        type="text"
        value=""
        onChange={mockOnChange}
        error="This field is required"
      />
    );

    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('should have proper ARIA attributes when error is present', () => {
    render(
      <FloatingLabelInput
        id="test-input"
        label="Test Label"
        type="text"
        value=""
        onChange={mockOnChange}
        error="Error message"
      />
    );

    const input = screen.getByLabelText('Test Label');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', 'test-input-error');
  });

  it('should have proper ARIA attributes when required', () => {
    render(
      <FloatingLabelInput
        id="test-input"
        label="Test Label"
        type="text"
        value=""
        onChange={mockOnChange}
        required
      />
    );

    const input = screen.getByLabelText((content) => content.includes('Test Label'));
    expect(input).toHaveAttribute('aria-required', 'true');
  });
});
