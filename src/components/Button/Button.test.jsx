import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button Component', () => {
  it('should render button with children text', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByRole('button', { name: 'Click Me' })).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should not call onClick when disabled', () => {
    const handleClick = vi.fn();
    render(
      <Button onClick={handleClick} disabled>
        Click Me
      </Button>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should not call onClick when loading', () => {
    const handleClick = vi.fn();
    render(
      <Button onClick={handleClick} isLoading>
        Click Me
      </Button>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should have type="button" by default', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('should support type="submit"', () => {
    render(<Button type="submit">Submit</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('should support type="reset"', () => {
    render(<Button type="reset">Reset</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'reset');
  });

  it('should apply primary variant class by default', () => {
    const { container } = render(<Button>Click Me</Button>);
    const button = container.querySelector('button');
    expect(button.className).toContain('primary');
  });

  it('should apply secondary variant class when specified', () => {
    const { container } = render(<Button variant="secondary">Click Me</Button>);
    const button = container.querySelector('button');
    expect(button.className).toContain('secondary');
  });

  it('should show spinner when isLoading is true', () => {
    const { container } = render(<Button isLoading>Loading</Button>);
    const spinner = container.querySelector('svg');
    expect(spinner).toBeInTheDocument();
  });

  it('should have aria-busy="true" when loading', () => {
    render(<Button isLoading>Loading</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
  });

  it('should have aria-busy="false" when not loading', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'false');
  });

  it('should have aria-disabled="true" when disabled', () => {
    render(<Button disabled>Click Me</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true');
  });

  it('should have aria-disabled="true" when loading', () => {
    render(<Button isLoading>Click Me</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Click Me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should be disabled when isLoading is true', () => {
    render(<Button isLoading>Loading</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should apply fullWidth class when fullWidth prop is true', () => {
    const { container } = render(<Button fullWidth>Click Me</Button>);
    const button = container.querySelector('button');
    expect(button.className).toContain('fullWidth');
  });

  it('should not apply fullWidth class by default', () => {
    const { container } = render(<Button>Click Me</Button>);
    const button = container.querySelector('button');
    expect(button.className).not.toContain('fullWidth');
  });

  it('should render children correctly', () => {
    render(
      <Button>
        <span>Click</span> Me
      </Button>
    );
    expect(screen.getByText('Click')).toBeInTheDocument();
    expect(screen.getByText('Me')).toBeInTheDocument();
  });

  it('should not show spinner when isLoading is false', () => {
    const { container } = render(<Button>Click Me</Button>);
    const spinner = container.querySelector('svg');
    expect(spinner).not.toBeInTheDocument();
  });

  it('should display children text when loading', () => {
    render(<Button isLoading>Loading...</Button>);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should apply loadingText class to children when loading', () => {
    const { container } = render(<Button isLoading>Loading</Button>);
    const textSpan = container.querySelector('span:last-child');
    expect(textSpan.className).toContain('loadingText');
  });

  it('should handle onClick with event parameter', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledWith(expect.any(Object));
  });

  it('should work without onClick handler', () => {
    render(<Button>Click Me</Button>);
    const button = screen.getByRole('button');
    expect(() => fireEvent.click(button)).not.toThrow();
  });
});
