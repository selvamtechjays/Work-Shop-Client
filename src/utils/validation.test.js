import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  validatePassword,
  validateSignupPassword,
  validateName,
  validateRequired,
} from './validation';

describe('validateEmail', () => {
  it('should return valid for a correct email', () => {
    const result = validateEmail('test@example.com');
    expect(result.valid).toBe(true);
    expect(result.message).toBe('');
  });

  it('should return invalid for empty email', () => {
    const result = validateEmail('');
    expect(result.valid).toBe(false);
    expect(result.message).toBe('Email is required');
  });

  it('should return invalid for email without @', () => {
    const result = validateEmail('testexample.com');
    expect(result.valid).toBe(false);
    expect(result.message).toBe('Please enter a valid email address');
  });

  it('should return invalid for email without domain', () => {
    const result = validateEmail('test@');
    expect(result.valid).toBe(false);
    expect(result.message).toBe('Please enter a valid email address');
  });

  it('should return invalid for whitespace-only email', () => {
    const result = validateEmail('   ');
    expect(result.valid).toBe(false);
    expect(result.message).toBe('Email is required');
  });
});

describe('validatePassword', () => {
  it('should return valid for password with 6+ characters', () => {
    const result = validatePassword('password123');
    expect(result.valid).toBe(true);
    expect(result.message).toBe('');
  });

  it('should return invalid for empty password', () => {
    const result = validatePassword('');
    expect(result.valid).toBe(false);
    expect(result.message).toBe('Password is required');
  });

  it('should return invalid for password less than 6 characters', () => {
    const result = validatePassword('12345');
    expect(result.valid).toBe(false);
    expect(result.message).toBe('Password must be at least 6 characters');
  });

  it('should return valid for exactly 6 characters', () => {
    const result = validatePassword('123456');
    expect(result.valid).toBe(true);
    expect(result.message).toBe('');
  });
});

describe('validateSignupPassword', () => {
  it('should return valid for strong password', () => {
    const result = validateSignupPassword('Password123');
    expect(result.valid).toBe(true);
    expect(result.message).toBe('');
  });

  it('should return invalid for empty password', () => {
    const result = validateSignupPassword('');
    expect(result.valid).toBe(false);
    expect(result.message).toBe('Password is required');
  });

  it('should return invalid for password less than 8 characters', () => {
    const result = validateSignupPassword('Pass1');
    expect(result.valid).toBe(false);
    expect(result.message).toBe('Password must be at least 8 characters');
  });

  it('should return invalid for password without uppercase', () => {
    const result = validateSignupPassword('password123');
    expect(result.valid).toBe(false);
    expect(result.message).toBe('Password must contain at least one uppercase letter');
  });

  it('should return invalid for password without lowercase', () => {
    const result = validateSignupPassword('PASSWORD123');
    expect(result.valid).toBe(false);
    expect(result.message).toBe('Password must contain at least one lowercase letter');
  });

  it('should return invalid for password without number', () => {
    const result = validateSignupPassword('PasswordABC');
    expect(result.valid).toBe(false);
    expect(result.message).toBe('Password must contain at least one number');
  });
});

describe('validateName', () => {
  it('should return valid for correct name', () => {
    const result = validateName('John Doe');
    expect(result.valid).toBe(true);
    expect(result.message).toBe('');
  });

  it('should return invalid for empty name', () => {
    const result = validateName('');
    expect(result.valid).toBe(false);
    expect(result.message).toBe('Name is required');
  });

  it('should return invalid for name less than 2 characters', () => {
    const result = validateName('A');
    expect(result.valid).toBe(false);
    expect(result.message).toBe('Name must be at least 2 characters');
  });

  it('should return valid for name with hyphens', () => {
    const result = validateName('Mary-Jane');
    expect(result.valid).toBe(true);
    expect(result.message).toBe('');
  });

  it('should return valid for name with apostrophes', () => {
    const result = validateName("O'Brien");
    expect(result.valid).toBe(true);
    expect(result.message).toBe('');
  });

  it('should return invalid for name with numbers', () => {
    const result = validateName('John123');
    expect(result.valid).toBe(false);
    expect(result.message).toBe('Name can only contain letters, spaces, hyphens, and apostrophes');
  });

  it('should return invalid for name with special characters', () => {
    const result = validateName('John@Doe');
    expect(result.valid).toBe(false);
    expect(result.message).toBe('Name can only contain letters, spaces, hyphens, and apostrophes');
  });
});

describe('validateRequired', () => {
  it('should return valid for non-empty value', () => {
    const result = validateRequired('some value');
    expect(result.valid).toBe(true);
    expect(result.message).toBe('');
  });

  it('should return invalid for empty value', () => {
    const result = validateRequired('');
    expect(result.valid).toBe(false);
    expect(result.message).toBe('This field is required');
  });

  it('should return invalid for whitespace-only value', () => {
    const result = validateRequired('   ');
    expect(result.valid).toBe(false);
    expect(result.message).toBe('This field is required');
  });
});
