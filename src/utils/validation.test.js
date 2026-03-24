import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  validatePassword,
  validatePasswordLogin,
  validateName,
  validatePasswordMatch
} from './validation';

describe('validateEmail', () => {
  // TS-VAL-001: Test validateEmail with valid emails
  describe('valid email addresses', () => {
    it('should validate test@example.com as valid', () => {
      const result = validateEmail('test@example.com');
      expect(result.isValid).toBe(true);
      expect(result.error).toBe('');
    });

    it('should validate user.name@domain.co.uk as valid', () => {
      const result = validateEmail('user.name@domain.co.uk');
      expect(result.isValid).toBe(true);
      expect(result.error).toBe('');
    });

    it('should validate user+tag@example.com as valid', () => {
      const result = validateEmail('user+tag@example.com');
      expect(result.isValid).toBe(true);
      expect(result.error).toBe('');
    });

    it('should validate user_name@domain.com as valid', () => {
      const result = validateEmail('user_name@domain.com');
      expect(result.isValid).toBe(true);
      expect(result.error).toBe('');
    });

    it('should trim whitespace and validate email', () => {
      const result = validateEmail('  test@example.com  ');
      expect(result.isValid).toBe(true);
      expect(result.error).toBe('');
    });
  });

  // TS-VAL-002: Test validateEmail with invalid emails
  describe('invalid email addresses', () => {
    it('should invalidate "notanemail"', () => {
      const result = validateEmail('notanemail');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Please enter a valid email address');
    });

    it('should invalidate "test@"', () => {
      const result = validateEmail('test@');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Please enter a valid email address');
    });

    it('should invalidate "@domain.com"', () => {
      const result = validateEmail('@domain.com');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Please enter a valid email address');
    });

    it('should invalidate "test@domain"', () => {
      const result = validateEmail('test@domain');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Please enter a valid email address');
    });

    it('should invalidate email with spaces', () => {
      const result = validateEmail('test @example.com');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Please enter a valid email address');
    });
  });

  // Edge cases
  describe('edge cases', () => {
    it('should return error for empty string', () => {
      const result = validateEmail('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Email is required');
    });

    it('should return error for null', () => {
      const result = validateEmail(null);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Email is required');
    });

    it('should return error for undefined', () => {
      const result = validateEmail(undefined);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Email is required');
    });

    it('should return error for whitespace only', () => {
      const result = validateEmail('   ');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Email is required');
    });
  });
});

describe('validatePassword', () => {
  // TS-VAL-003: Test validatePassword with strong password
  describe('strong passwords', () => {
    it('should validate "Password123!" as strong', () => {
      const result = validatePassword('Password123!');
      expect(result.isValid).toBe(true);
      expect(result.error).toBe('');
      expect(result.strength).toBe('strong');
    });

    it('should validate "MyP@ssw0rd" as strong', () => {
      const result = validatePassword('MyP@ssw0rd');
      expect(result.isValid).toBe(true);
      expect(result.error).toBe('');
      expect(result.strength).toBe('strong');
    });

    it('should validate "Str0ng!Pass" as strong', () => {
      const result = validatePassword('Str0ng!Pass');
      expect(result.isValid).toBe(true);
      expect(result.error).toBe('');
      expect(result.strength).toBe('strong');
    });
  });

  // TS-VAL-004: Test validatePassword with weak password
  describe('weak/invalid passwords', () => {
    it('should invalidate "password" (no uppercase, number, special char)', () => {
      const result = validatePassword('password');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('uppercase');
      expect(result.strength).toBe('weak');
    });

    it('should invalidate "PASSWORD" (no lowercase, number, special char)', () => {
      const result = validatePassword('PASSWORD');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('lowercase');
    });

    it('should invalidate "Password" (no number, special char)', () => {
      const result = validatePassword('Password');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('number');
    });

    it('should invalidate "Password1" (no special char)', () => {
      const result = validatePassword('Password1');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('special character');
    });

    it('should invalidate "Pass1!" (too short)', () => {
      const result = validatePassword('Pass1!');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Password must be at least 8 characters');
    });
  });

  // Medium strength passwords
  describe('medium strength passwords', () => {
    it('should validate "Password1" as medium (missing special char)', () => {
      const result = validatePassword('Password1');
      expect(result.isValid).toBe(false);
      expect(result.strength).toBe('medium');
    });

    it('should validate "password1!" as medium (missing uppercase)', () => {
      const result = validatePassword('password1!');
      expect(result.isValid).toBe(false);
      expect(result.strength).toBe('medium');
    });
  });

  // Edge cases
  describe('edge cases', () => {
    it('should return error for empty string', () => {
      const result = validatePassword('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Password is required');
      expect(result.strength).toBe('');
    });

    it('should return error for null', () => {
      const result = validatePassword(null);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Password is required');
      expect(result.strength).toBe('');
    });

    it('should return error for undefined', () => {
      const result = validatePassword(undefined);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Password is required');
      expect(result.strength).toBe('');
    });

    it('should handle all special characters', () => {
      const specialChars = '!@#$%^&*()_+-=[]{}|;:\',.<>?';
      for (const char of specialChars) {
        const result = validatePassword(`Password1${char}`);
        expect(result.isValid).toBe(true);
        expect(result.strength).toBe('strong');
      }
    });
  });
});

describe('validatePasswordLogin', () => {
  describe('valid passwords', () => {
    it('should validate password with 8 characters', () => {
      const result = validatePasswordLogin('12345678');
      expect(result.isValid).toBe(true);
      expect(result.error).toBe('');
    });

    it('should validate password with more than 8 characters', () => {
      const result = validatePasswordLogin('password123');
      expect(result.isValid).toBe(true);
      expect(result.error).toBe('');
    });
  });

  describe('invalid passwords', () => {
    it('should invalidate password shorter than 8 characters', () => {
      const result = validatePasswordLogin('1234567');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Password must be at least 8 characters');
    });

    it('should invalidate empty string', () => {
      const result = validatePasswordLogin('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Password is required');
    });

    it('should invalidate null', () => {
      const result = validatePasswordLogin(null);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Password is required');
    });

    it('should invalidate undefined', () => {
      const result = validatePasswordLogin(undefined);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Password is required');
    });
  });
});

describe('validateName', () => {
  // TS-VAL-007: Test validateName with valid names
  describe('valid names', () => {
    it('should validate "John Doe"', () => {
      const result = validateName('John Doe');
      expect(result.isValid).toBe(true);
      expect(result.error).toBe('');
    });

    it('should validate "Jane"', () => {
      const result = validateName('Jane');
      expect(result.isValid).toBe(true);
      expect(result.error).toBe('');
    });

    it('should validate "Mary-Jane"', () => {
      const result = validateName('Mary-Jane');
      expect(result.isValid).toBe(true);
      expect(result.error).toBe('');
    });

    it('should validate "O\'Brien"', () => {
      const result = validateName("O'Brien");
      expect(result.isValid).toBe(true);
      expect(result.error).toBe('');
    });

    it('should validate "Jean-Paul Smith"', () => {
      const result = validateName('Jean-Paul Smith');
      expect(result.isValid).toBe(true);
      expect(result.error).toBe('');
    });

    it('should trim whitespace and validate', () => {
      const result = validateName('  John Doe  ');
      expect(result.isValid).toBe(true);
      expect(result.error).toBe('');
    });
  });

  // TS-VAL-008: Test validateName with invalid names
  describe('invalid names', () => {
    it('should invalidate "J" (too short)', () => {
      const result = validateName('J');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Name must be at least 2 characters');
    });

    it('should invalidate "John123" (contains numbers)', () => {
      const result = validateName('John123');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('must start with a letter');
    });

    it('should invalidate "123John" (starts with number)', () => {
      const result = validateName('123John');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('must start with a letter');
    });

    it('should invalidate "John@Doe" (contains special characters)', () => {
      const result = validateName('John@Doe');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('must start with a letter');
    });

    it('should invalidate empty string', () => {
      const result = validateName('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Name is required');
    });

    it('should invalidate null', () => {
      const result = validateName(null);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Name is required');
    });

    it('should invalidate undefined', () => {
      const result = validateName(undefined);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Name is required');
    });

    it('should invalidate whitespace only', () => {
      const result = validateName('   ');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Name is required');
    });

    it('should invalidate names longer than 50 characters', () => {
      const longName = 'A'.repeat(51);
      const result = validateName(longName);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Name must be no more than 50 characters');
    });
  });
});

describe('validatePasswordMatch', () => {
  // TS-VAL-005: Test validatePasswordMatch with matching passwords
  describe('matching passwords', () => {
    it('should validate matching passwords', () => {
      const result = validatePasswordMatch('Password123!', 'Password123!');
      expect(result.isValid).toBe(true);
      expect(result.error).toBe('');
    });

    it('should validate matching simple passwords', () => {
      const result = validatePasswordMatch('password', 'password');
      expect(result.isValid).toBe(true);
      expect(result.error).toBe('');
    });
  });

  // TS-VAL-006: Test validatePasswordMatch with non-matching passwords
  describe('non-matching passwords', () => {
    it('should invalidate non-matching passwords', () => {
      const result = validatePasswordMatch('Password123!', 'Password123');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Passwords do not match');
    });

    it('should be case-sensitive', () => {
      const result = validatePasswordMatch('Password', 'password');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Passwords do not match');
    });

    it('should invalidate when confirmPassword is different', () => {
      const result = validatePasswordMatch('abc123', 'xyz789');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Passwords do not match');
    });
  });

  // Edge cases
  describe('edge cases', () => {
    it('should return error for empty confirmPassword', () => {
      const result = validatePasswordMatch('Password123!', '');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Please confirm your password');
    });

    it('should return error for null confirmPassword', () => {
      const result = validatePasswordMatch('Password123!', null);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Please confirm your password');
    });

    it('should return error for undefined confirmPassword', () => {
      const result = validatePasswordMatch('Password123!', undefined);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Please confirm your password');
    });

    it('should handle empty password and confirmPassword', () => {
      const result = validatePasswordMatch('', '');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Please confirm your password');
    });

    it('should handle whitespace differences', () => {
      const result = validatePasswordMatch('password', 'password ');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Passwords do not match');
    });
  });
});

// Integration tests - testing combinations
describe('Integration tests', () => {
  it('should validate complete signup form data', () => {
    const name = 'John Doe';
    const email = 'john.doe@example.com';
    const password = 'SecurePass123!';
    const confirmPassword = 'SecurePass123!';

    const nameResult = validateName(name);
    const emailResult = validateEmail(email);
    const passwordResult = validatePassword(password);
    const matchResult = validatePasswordMatch(password, confirmPassword);

    expect(nameResult.isValid).toBe(true);
    expect(emailResult.isValid).toBe(true);
    expect(passwordResult.isValid).toBe(true);
    expect(passwordResult.strength).toBe('strong');
    expect(matchResult.isValid).toBe(true);
  });

  it('should validate complete login form data', () => {
    const email = 'user@example.com';
    const password = 'mypassword123';

    const emailResult = validateEmail(email);
    const passwordResult = validatePasswordLogin(password);

    expect(emailResult.isValid).toBe(true);
    expect(passwordResult.isValid).toBe(true);
  });

  it('should catch all errors in invalid signup form', () => {
    const name = 'J';
    const email = 'invalid-email';
    const password = 'weak';
    const confirmPassword = 'different';

    const nameResult = validateName(name);
    const emailResult = validateEmail(email);
    const passwordResult = validatePassword(password);
    const matchResult = validatePasswordMatch(password, confirmPassword);

    expect(nameResult.isValid).toBe(false);
    expect(emailResult.isValid).toBe(false);
    expect(passwordResult.isValid).toBe(false);
    expect(matchResult.isValid).toBe(false);
  });
});
