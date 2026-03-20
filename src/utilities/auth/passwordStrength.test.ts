import { describe, it, expect } from 'vitest';
import { calculatePasswordStrength, getStrengthLabel, getStrengthColor } from './passwordStrength';

describe('passwordStrength', () => {
  describe('calculatePasswordStrength', () => {
    it('should return 0 for empty password', () => {
      expect(calculatePasswordStrength('')).toBe(0);
    });

    it('should return 1 for password with only length >= 8', () => {
      expect(calculatePasswordStrength('12345678')).toBe(2); // length 8 + numbers
    });

    it('should return score for password with length >= 12', () => {
      expect(calculatePasswordStrength('123456789012')).toBe(3); // length 8 + length 12 + numbers
    });

    it('should add point for uppercase letter', () => {
      expect(calculatePasswordStrength('Abc')).toBe(2); // uppercase + lowercase
    });

    it('should add point for lowercase letter', () => {
      expect(calculatePasswordStrength('abc')).toBe(1); // lowercase only
    });

    it('should add point for number', () => {
      expect(calculatePasswordStrength('123')).toBe(1); // numbers only
    });

    it('should add point for special character', () => {
      expect(calculatePasswordStrength('!@#')).toBe(1); // special char only
    });

    it('should return max score 6 for strong password', () => {
      expect(calculatePasswordStrength('MyP@ss123456!')).toBe(6);
    });

    it('should return correct score for medium password', () => {
      expect(calculatePasswordStrength('password123')).toBe(3); // length 8 + lowercase + numbers
    });
  });

  describe('getStrengthLabel', () => {
    it('should return "weak" for score 0-2', () => {
      expect(getStrengthLabel(0)).toBe('weak');
      expect(getStrengthLabel(1)).toBe('weak');
      expect(getStrengthLabel(2)).toBe('weak');
    });

    it('should return "medium" for score 3-4', () => {
      expect(getStrengthLabel(3)).toBe('medium');
      expect(getStrengthLabel(4)).toBe('medium');
    });

    it('should return "strong" for score 5-6', () => {
      expect(getStrengthLabel(5)).toBe('strong');
      expect(getStrengthLabel(6)).toBe('strong');
    });
  });

  describe('getStrengthColor', () => {
    it('should return red color for weak', () => {
      expect(getStrengthColor('weak')).toBe('#ef4444');
    });

    it('should return yellow color for medium', () => {
      expect(getStrengthColor('medium')).toBe('#f59e0b');
    });

    it('should return green color for strong', () => {
      expect(getStrengthColor('strong')).toBe('#10b981');
    });
  });
});
