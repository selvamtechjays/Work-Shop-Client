import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RememberMeCheckbox } from './RememberMeCheckbox';

describe('RememberMeCheckbox', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
    localStorage.clear();
  });

  it('should render checkbox with label', () => {
    render(<RememberMeCheckbox checked={false} onChange={mockOnChange} />);

    expect(screen.getByLabelText('Remember me for 30 days')).toBeInTheDocument();
  });

  it('should be checked when checked prop is true', () => {
    render(<RememberMeCheckbox checked={true} onChange={mockOnChange} />);

    const checkbox = screen.getByLabelText('Remember me for 30 days') as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });

  it('should be unchecked when checked prop is false', () => {
    render(<RememberMeCheckbox checked={false} onChange={mockOnChange} />);

    const checkbox = screen.getByLabelText('Remember me for 30 days') as HTMLInputElement;
    expect(checkbox.checked).toBe(false);
  });

  it('should call onChange when clicked', () => {
    render(<RememberMeCheckbox checked={false} onChange={mockOnChange} />);

    const checkbox = screen.getByLabelText('Remember me for 30 days');
    fireEvent.click(checkbox);

    expect(mockOnChange).toHaveBeenCalledWith(true);
  });

  it('should save preference to localStorage when checked', () => {
    render(<RememberMeCheckbox checked={false} onChange={mockOnChange} />);

    const checkbox = screen.getByLabelText('Remember me for 30 days');
    fireEvent.click(checkbox);

    expect(localStorage.getItem('rememberMe')).toBe('true');
  });

  it('should save preference to localStorage when unchecked', () => {
    render(<RememberMeCheckbox checked={true} onChange={mockOnChange} />);

    const checkbox = screen.getByLabelText('Remember me for 30 days');
    fireEvent.click(checkbox);

    expect(localStorage.getItem('rememberMe')).toBe('false');
    expect(mockOnChange).toHaveBeenCalledWith(false);
  });
});
