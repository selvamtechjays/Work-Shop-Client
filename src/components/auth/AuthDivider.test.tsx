import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AuthDivider } from './AuthDivider';

describe('AuthDivider', () => {
  it('should render with default text "or"', () => {
    render(<AuthDivider />);
    expect(screen.getByText('or')).toBeInTheDocument();
  });

  it('should render with custom text', () => {
    render(<AuthDivider text="or continue with" />);
    expect(screen.getByText('or continue with')).toBeInTheDocument();
  });

  it('should have proper styling', () => {
    const { container } = render(<AuthDivider />);
    const divider = container.querySelector('.border-white\\/20');
    expect(divider).toBeInTheDocument();
  });
});
