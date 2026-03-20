import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AuthCard } from './AuthCard';

describe('AuthCard', () => {
  it('should render children', () => {
    render(
      <AuthCard>
        <div>Test Content</div>
      </AuthCard>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <AuthCard className="custom-class">
        <div>Test Content</div>
      </AuthCard>
    );

    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('custom-class');
  });

  it('should have glassmorphism styling', () => {
    const { container } = render(
      <AuthCard>
        <div>Test Content</div>
      </AuthCard>
    );

    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('backdrop-blur-lg');
    expect(card.className).toContain('bg-white/10');
    expect(card.className).toContain('border-white/20');
  });

  it('should have proper max width', () => {
    const { container } = render(
      <AuthCard>
        <div>Test Content</div>
      </AuthCard>
    );

    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('max-w-md');
    expect(card.className).toContain('w-full');
  });
});
