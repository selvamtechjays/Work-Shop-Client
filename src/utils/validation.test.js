import { describe, it, expect } from 'vitest';
import { validateEmail, validatePassword, validateName, validatePasswordMatch } from './validation';

describe('validateEmail', () => {
  it('should return valid for correct email format', () => {
    const result = validateEmail('test@example.com');
    expect(result.valid).toBe(true);
    expect(result.error).toBe('');
  });

  it('should return invalid for empty email', () => {
    const result = validateEmail('');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Email is required');
  });

  it('should return invalid for email without @', () => {
    const result = validateEmail('testexample.com');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Please enter a valid email address');
  });

  it('should return invalid for email without domain', () => {
    const result = validateEmail('test@');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Please enter a valid email address');
  });

  it('should return invalid for email without TLD', () => {
    const result = validateEmail('test@example');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Please enter a valid email address');
  });

  it('should return valid for email with subdomain', () => {
    const result = validateEmail('test@mail.example.com');
    expect(result.valid).toBe(true);
    expect(result.error).toBe('');
  });

  it('should return valid for email with plus sign', () => {
    const result = validateEmail('test+tag@example.com');
    expect(result.valid).toBe(true);
    expect(result.error).toBe('');
  });
});

describe('validatePassword', () => {
  it('should return strong for password meeting all criteria', () => {
    const result = validatePassword('Test@1234');
    expect(result.valid).toBe(true);
    expect(result.strength).toBe('strong');
    expect(result.meetsLength).toBe(true);
    expect(result.hasUpper).toBe(true);
    expect(result.hasLower).toBe(true);
    expect(result.hasNumber).toBe(true);
    expect(result.hasSpecial).toBe(true);
    expect(result.error).toBe('');
  });

  it('should return weak for empty password', () => {
    const result = validatePassword('');
    expect(result.valid).toBe(false);
    expect(result.strength).toBe('weak');
    expect(result.error).toBe('Password is required');
  });

  it('should return weak for short password', () => {
    const result = validatePassword('Test@1');
    expect(result.valid).toBe(false);
    expect(result.strength).toBe('medium'); // Has 4/5 criteria but still invalid
    expect(result.meetsLength).toBe(false);
    expect(result.error).toContain('at least 8 characters');
  });

  it('should return medium for password with 3-4 criteria', () => {
    const result = validatePassword('testpassword123');
    expect(result.valid).toBe(false);
    expect(result.strength).toBe('medium');
    expect(result.meetsLength).toBe(true);
    expect(result.hasLower).toBe(true);
    expect(result.hasNumber).toBe(true);
    expect(result.hasUpper).toBe(false);
    expect(result.hasSpecial).toBe(false);
  });

  it('should detect missing uppercase', () => {
    const result = validatePassword('test@1234');
    expect(result.valid).toBe(false);
    expect(result.hasUpper).toBe(false);
    expect(result.error).toContain('one uppercase letter');
  });

  it('should detect missing lowercase', () => {
    const result = validatePassword('TEST@1234');
    expect(result.valid).toBe(false);
    expect(result.hasLower).toBe(false);
    expect(result.error).toContain('one lowercase letter');
  });

  it('should detect missing number', () => {
    const result = validatePassword('Test@Pass');
    expect(result.valid).toBe(false);
    expect(result.hasNumber).toBe(false);
    expect(result.error).toContain('one number');
  });

  it('should detect missing special character', () => {
    const result = validatePassword('Test1234');
    expect(result.valid).toBe(false);
    expect(result.hasSpecial).toBe(false);
    expect(result.error).toContain('one special character');
  });

  it('should accept various special characters', () => {
    const specialChars = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '-', '='];
    specialChars.forEach(char => {
      const result = validatePassword(`Test${char}1234`);
      expect(result.hasSpecial).toBe(true);
    });
  });
});

describe('validateName', () => {
  it('should return valid for correct name', () => {
    const result = validateName('John Doe');
    expect(result.valid).toBe(true);
    expect(result.error).toBe('');
  });

  it('should return invalid for empty name', () => {
    const result = validateName('');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Name is required');
  });

  it('should return invalid for name with only spaces', () => {
    const result = validateName('   ');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Name is required');
  });

  it('should return invalid for name shorter than 2 characters', () => {
    const result = validateName('A');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Name must be at least 2 characters long');
  });

  it('should return invalid for name longer than 50 characters', () => {
    const result = validateName('A'.repeat(51));
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Name must not exceed 50 characters');
  });

  it('should return valid for name with hyphen', () => {
    const result = validateName('Mary-Jane');
    expect(result.valid).toBe(true);
    expect(result.error).toBe('');
  });

  it('should return valid for name with apostrophe', () => {
    const result = validateName("O'Brien");
    expect(result.valid).toBe(true);
    expect(result.error).toBe('');
  });

  it('should return invalid for name with numbers', () => {
    const result = validateName('John123');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('can only contain letters');
  });

  it('should return invalid for name with special characters', () => {
    const result = validateName('John@Doe');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('can only contain letters');
  });

  it('should trim whitespace and validate correctly', () => {
    const result = validateName('  John  ');
    expect(result.valid).toBe(true);
    expect(result.error).toBe('');
  });
});

describe('validatePasswordMatch', () => {
  it('should return valid for matching passwords', () => {
    const result = validatePasswordMatch('Test@1234', 'Test@1234');
    expect(result.valid).toBe(true);
    expect(result.error).toBe('');
  });

  it('should return invalid for empty confirmation password', () => {
    const result = validatePasswordMatch('Test@1234', '');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Please confirm your password');
  });

  it('should return invalid for non-matching passwords', () => {
    const result = validatePasswordMatch('Test@1234', 'Test@5678');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Passwords do not match');
  });

  it('should be case sensitive', () => {
    const result = validatePasswordMatch('Test@1234', 'test@1234');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Passwords do not match');
  });

  it('should handle special characters in password match', () => {
    const result = validatePasswordMatch('P@$$w0rd!', 'P@$$w0rd!');
    expect(result.valid).toBe(true);
    expect(result.error).toBe('');
  });
});
