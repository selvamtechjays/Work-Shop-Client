import { describe, it, expect, beforeEach } from 'vitest';
import {
  setRememberMePreference,
  getRememberMePreference,
  shouldRememberSession,
  clearRememberMePreference,
} from './rememberMe';

describe('rememberMe', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe('setRememberMePreference', () => {
    it('should store true preference in localStorage', () => {
      setRememberMePreference(true);
      expect(localStorage.getItem('rememberMe')).toBe('true');
    });

    it('should store false preference in localStorage', () => {
      setRememberMePreference(false);
      expect(localStorage.getItem('rememberMe')).toBe('false');
    });
  });

  describe('getRememberMePreference', () => {
    it('should return false by default when nothing is stored', () => {
      expect(getRememberMePreference()).toBe(false);
    });

    it('should return true when true is stored', () => {
      localStorage.setItem('rememberMe', 'true');
      expect(getRememberMePreference()).toBe(true);
    });

    it('should return false when false is stored', () => {
      localStorage.setItem('rememberMe', 'false');
      expect(getRememberMePreference()).toBe(false);
    });

    it('should return false for invalid values', () => {
      localStorage.setItem('rememberMe', 'invalid');
      expect(getRememberMePreference()).toBe(false);
    });
  });

  describe('shouldRememberSession', () => {
    it('should be an alias for getRememberMePreference', () => {
      setRememberMePreference(true);
      expect(shouldRememberSession()).toBe(true);

      setRememberMePreference(false);
      expect(shouldRememberSession()).toBe(false);
    });
  });

  describe('clearRememberMePreference', () => {
    it('should remove preference from localStorage', () => {
      setRememberMePreference(true);
      expect(localStorage.getItem('rememberMe')).toBe('true');

      clearRememberMePreference();
      expect(localStorage.getItem('rememberMe')).toBeNull();
    });
  });
});
