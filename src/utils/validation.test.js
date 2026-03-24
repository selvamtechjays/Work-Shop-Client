/**
 * Comprehensive tests for validation utilities
 */

import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  validatePassword,
  validatePasswordLogin,
  validateName,
  validatePasswordMatch,
  calculatePasswordStrength,
  validateEmailDomain
} from './validation.js';

describe('validateEmail', () => {
  describe('valid emails', () => {
    it('should pass with valid email', () => {
      const result = validateEmail('test@example.com');
      expect(result.isValid).toBe(true);
      expect(result.error).toBe('');
    });

    it('should pass with email containing plus sign', () => {
      const result = validateEmail('test+tag@example.com');
      expect(result.isValid).toBe(true);
    });

    it('should pass with subdomain', () => {
      const result = validateEmail('test@mail.example.com');
      expect(result.isValid).toBe(true);
    });

    it('should pass with numbers', () => {
      const result = validateEmail('test123@example456.com');
      expect(result.isValid).toBe(true);
    });
  });

  describe('invalid emails', () => {
    it('should fail with empty string', () => {
      const result = validateEmail('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Email is required');
    });

    it('should fail with null', () => {
      const result = validateEmail(null);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Email is required');
    });

    it('should fail with undefined', () => {
      const result = validateEmail(undefined);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Email is required');
    });

    it('should fail with whitespace only', () => {
      const result = validateEmail('   ');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Email is required');
    });

    it('should fail with missing @', () => {
      const result = validateEmail('testexample.com');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Please enter a valid email address');
    });

    it('should fail with missing domain', () => {
      const result = validateEmail('test@');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Please enter a valid email address');
    });

    it('should fail with missing username', () => {
      const result = validateEmail('@example.com');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Please enter a valid email address');
    });

    it('should fail with spaces', () => {
      const result = validateEmail('test @example.com');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Please enter a valid email address');
    });

    it('should fail with very long email (>1000 chars)', () => {
      const longEmail = 'a'.repeat(1001) + '@example.com';
      const result = validateEmail(longEmail);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Email is too long');
    });
  });

  describe('edge cases', () => {
    it('should trim whitespace', () => {
      const result = validateEmail('  test@example.com  ');
      expect(result.isValid).toBe(true);
    });

    it('should handle tabs and newlines as whitespace', () => {
      const result = validateEmail('\t\ntest@example.com\n\t');
      expect(result.isValid).toBe(true);
    });
  });
});

describe('validatePassword', () => {
  describe('valid passwords', () => {
    it('should pass with valid password', () => {
      const result = validatePassword('Test@123');
      expect(result.isValid).toBe(true);
      expect(result.error).toBe('');
      expect(result.strength).toBeDefined();
    });

    it('should pass with strong password', () => {
      const result = validatePassword('StrongPass@123');
      expect(result.isValid).toBe(true);
      expect(result.strength).toBe('strong');
    });

    it('should pass with all special characters', () => {
      const result = validatePassword('Test@123!#$%');
      expect(result.isValid).toBe(true);
    });
  });

  describe('invalid passwords', () => {
    it('should fail with empty string', () => {
      const result = validatePassword('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Password is required');
    });

    it('should fail with null', () => {
      const result = validatePassword(null);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Password is required');
    });

    it('should fail with undefined', () => {
      const result = validatePassword(undefined);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Password is required');
    });

    it('should fail with password too short', () => {
      const result = validatePassword('Test@12');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Password must be at least 8 characters');
    });

    it('should fail without uppercase', () => {
      const result = validatePassword('test@123');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Password must contain at least one uppercase letter');
    });

    it('should fail without lowercase', () => {
      const result = validatePassword('TEST@123');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Password must contain at least one lowercase letter');
    });

    it('should fail without number', () => {
      const result = validatePassword('Test@abc');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Password must contain at least one number');
    });

    it('should fail without special character', () => {
      const result = validatePassword('Test1234');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Password must contain at least one special character');
    });

    it('should fail with very long password (>1000 chars)', () => {
      const longPassword = 'A@1' + 'a'.repeat(1001);
      const result = validatePassword(longPassword);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Password is too long');
    });
  });

  describe('password strength', () => {
    it('should return weak for passwords with <3 requirements', () => {
      const result = validatePassword('test');
      expect(result.strength).toBe('weak');
    });

    it('should return medium for passwords with 3-4 requirements', () => {
      const result = calculatePasswordStrength('Test1234');
      expect(result).toBe('medium');
    });

    it('should return strong for passwords with all 5 requirements', () => {
      const result = calculatePasswordStrength('Test@123');
      expect(result).toBe('strong');
    });
  });
});

describe('validatePasswordLogin', () => {
  describe('valid passwords', () => {
    it('should pass with valid password', () => {
      const result = validatePasswordLogin('password123');
      expect(result.isValid).toBe(true);
      expect(result.error).toBe('');
    });

    it('should pass without complexity requirements', () => {
      const result = validatePasswordLogin('simplepassword');
      expect(result.isValid).toBe(true);
    });
  });

  describe('invalid passwords', () => {
    it('should fail with empty string', () => {
      const result = validatePasswordLogin('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Password is required');
    });

    it('should fail with null', () => {
      const result = validatePasswordLogin(null);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Password is required');
    });

    it('should fail with password too short', () => {
      const result = validatePasswordLogin('test123');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Password must be at least 8 characters');
    });

    it('should fail with very long password', () => {
      const longPassword = 'a'.repeat(1001);
      const result = validatePasswordLogin(longPassword);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Password is too long');
    });
  });
});

describe('validateName', () => {
  describe('valid names', () => {
    it('should pass with valid name', () => {
      const result = validateName('John Doe');
      expect(result.isValid).toBe(true);
      expect(result.error).toBe('');
    });

    it('should pass with hyphenated name', () => {
      const result = validateName('Mary-Jane');
      expect(result.isValid).toBe(true);
    });

    it('should pass with apostrophe', () => {
      const result = validateName("O'Brien");
      expect(result.isValid).toBe(true);
    });

    it('should pass with unicode characters', () => {
      const result = validateName('José María');
      expect(result.isValid).toBe(true);
    });

    it('should pass with multiple spaces', () => {
      const result = validateName('Mary Jane Smith');
      expect(result.isValid).toBe(true);
    });

    it('should pass with minimum length', () => {
      const result = validateName('Jo');
      expect(result.isValid).toBe(true);
    });

    it('should pass with maximum length', () => {
      const result = validateName('A'.repeat(50));
      expect(result.isValid).toBe(true);
    });
  });

  describe('invalid names', () => {
    it('should fail with empty string', () => {
      const result = validateName('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Name is required');
    });

    it('should fail with null', () => {
      const result = validateName(null);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Name is required');
    });

    it('should fail with undefined', () => {
      const result = validateName(undefined);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Name is required');
    });

    it('should fail with whitespace only', () => {
      const result = validateName('   ');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Name is required');
    });

    it('should fail with single character', () => {
      const result = validateName('J');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Name must be at least 2 characters');
    });

    it('should fail with too long name', () => {
      const result = validateName('A'.repeat(51));
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Name must be 50 characters or less');
    });

    it('should fail with extremely long name', () => {
      const result = validateName('A'.repeat(1001));
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Name is too long');
    });

    it('should fail starting with number', () => {
      const result = validateName('1John');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('must start with a letter');
    });

    it('should fail with numbers in name', () => {
      const result = validateName('John123');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('must start with a letter');
    });

    it('should fail with special characters', () => {
      const result = validateName('John@Doe');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('must start with a letter');
    });
  });

  describe('edge cases', () => {
    it('should trim whitespace', () => {
      const result = validateName('  John Doe  ');
      expect(result.isValid).toBe(true);
    });
  });
});

describe('validatePasswordMatch', () => {
  describe('matching passwords', () => {
    it('should pass when passwords match', () => {
      const result = validatePasswordMatch('Test@123', 'Test@123');
      expect(result.isValid).toBe(true);
      expect(result.error).toBe('');
    });

    it('should pass with complex matching passwords', () => {
      const result = validatePasswordMatch('VeryComplex@Pass123!', 'VeryComplex@Pass123!');
      expect(result.isValid).toBe(true);
    });
  });

  describe('non-matching passwords', () => {
    it('should fail when passwords do not match', () => {
      const result = validatePasswordMatch('Test@123', 'Test@124');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Passwords do not match');
    });

    it('should fail with empty confirm password', () => {
      const result = validatePasswordMatch('Test@123', '');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Please confirm password');
    });

    it('should fail with null confirm password', () => {
      const result = validatePasswordMatch('Test@123', null);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Please confirm password');
    });

    it('should fail with undefined confirm password', () => {
      const result = validatePasswordMatch('Test@123', undefined);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Please confirm password');
    });

    it('should be case sensitive', () => {
      const result = validatePasswordMatch('Test@123', 'test@123');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Passwords do not match');
    });
  });
});

describe('calculatePasswordStrength', () => {
  it('should return weak for empty password', () => {
    expect(calculatePasswordStrength('')).toBe('weak');
  });

  it('should return weak for null', () => {
    expect(calculatePasswordStrength(null)).toBe('weak');
  });

  it('should return weak for password with 0-2 requirements', () => {
    expect(calculatePasswordStrength('test')).toBe('weak');
    expect(calculatePasswordStrength('test123')).toBe('weak');
  });

  it('should return medium for password with 3 requirements', () => {
    expect(calculatePasswordStrength('Test1234')).toBe('medium');
  });

  it('should return medium for password with 4 requirements', () => {
    expect(calculatePasswordStrength('Test@abc')).toBe('medium');
  });

  it('should return strong for password with all 5 requirements', () => {
    expect(calculatePasswordStrength('Test@123')).toBe('strong');
    expect(calculatePasswordStrength('VeryStrong@Pass123')).toBe('strong');
  });
});

describe('validateEmailDomain', () => {
  describe('valid domains', () => {
    it('should pass with standard email domain', () => {
      const result = validateEmailDomain('test@gmail.com');
      expect(result.isValid).toBe(true);
      expect(result.error).toBe('');
    });

    it('should pass with business email', () => {
      const result = validateEmailDomain('test@company.com');
      expect(result.isValid).toBe(true);
    });
  });

  describe('disposable domains', () => {
    it('should fail with tempmail.com', () => {
      const result = validateEmailDomain('test@tempmail.com');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Disposable email addresses are not allowed');
    });

    it('should fail with 10minutemail.com', () => {
      const result = validateEmailDomain('test@10minutemail.com');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Disposable email addresses are not allowed');
    });

    it('should be case insensitive', () => {
      const result = validateEmailDomain('test@TempMail.Com');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Disposable email addresses are not allowed');
    });
  });

  describe('edge cases', () => {
    it('should fail with empty email', () => {
      const result = validateEmailDomain('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Email is required');
    });

    it('should fail with null', () => {
      const result = validateEmailDomain(null);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Email is required');
    });

    it('should trim whitespace', () => {
      const result = validateEmailDomain('  test@gmail.com  ');
      expect(result.isValid).toBe(true);
    });
  });
});
