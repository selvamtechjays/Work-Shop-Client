/**
 * Tests for Auth Validators
 */

import { describe, it, expect } from 'vitest';
import { validationResult } from 'express-validator';
import { signupValidation, loginValidation } from '../validators/auth.validators.js';

/**
 * Helper function to run validation chains
 */
const runValidation = async (validationChain, req) => {
  for (const validation of validationChain) {
    await validation.run(req);
  }
  return validationResult(req);
};

describe('Auth Validators', () => {
  describe('signupValidation', () => {
    describe('name validation', () => {
      it('should pass with valid name', async () => {
        const req = {
          body: {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'Test@123',
            confirmPassword: 'Test@123'
          }
        };

        const result = await runValidation(signupValidation, req);
        const nameErrors = result.array().filter(e => e.path === 'name');
        expect(nameErrors).toHaveLength(0);
      });

      it('should fail when name is empty', async () => {
        const req = {
          body: {
            name: '',
            email: 'john@example.com',
            password: 'Test@123',
            confirmPassword: 'Test@123'
          }
        };

        const result = await runValidation(signupValidation, req);
        const nameErrors = result.array().filter(e => e.path === 'name');
        expect(nameErrors.length).toBeGreaterThan(0);
        expect(nameErrors[0].msg).toBe('Name is required');
      });

      it('should fail when name is too short', async () => {
        const req = {
          body: {
            name: 'J',
            email: 'john@example.com',
            password: 'Test@123',
            confirmPassword: 'Test@123'
          }
        };

        const result = await runValidation(signupValidation, req);
        const nameErrors = result.array().filter(e => e.path === 'name');
        expect(nameErrors.some(e => e.msg === 'Name must be 2-50 characters')).toBe(true);
      });

      it('should fail when name is too long', async () => {
        const req = {
          body: {
            name: 'A'.repeat(51),
            email: 'john@example.com',
            password: 'Test@123',
            confirmPassword: 'Test@123'
          }
        };

        const result = await runValidation(signupValidation, req);
        const nameErrors = result.array().filter(e => e.path === 'name');
        expect(nameErrors.some(e => e.msg === 'Name must be 2-50 characters')).toBe(true);
      });

      it('should fail when name does not start with a letter', async () => {
        const req = {
          body: {
            name: '1John',
            email: 'john@example.com',
            password: 'Test@123',
            confirmPassword: 'Test@123'
          }
        };

        const result = await runValidation(signupValidation, req);
        const nameErrors = result.array().filter(e => e.path === 'name');
        expect(nameErrors.some(e => e.msg.includes('must start with a letter'))).toBe(true);
      });

      it('should pass with name containing spaces', async () => {
        const req = {
          body: {
            name: 'John Doe Smith',
            email: 'john@example.com',
            password: 'Test@123',
            confirmPassword: 'Test@123'
          }
        };

        const result = await runValidation(signupValidation, req);
        const nameErrors = result.array().filter(e => e.path === 'name');
        expect(nameErrors).toHaveLength(0);
      });

      it('should pass with name containing hyphens and apostrophes', async () => {
        const req = {
          body: {
            name: "O'Brien-Smith",
            email: 'john@example.com',
            password: 'Test@123',
            confirmPassword: 'Test@123'
          }
        };

        const result = await runValidation(signupValidation, req);
        const nameErrors = result.array().filter(e => e.path === 'name');
        expect(nameErrors).toHaveLength(0);
      });
    });

    describe('email validation', () => {
      it('should pass with valid email', async () => {
        const req = {
          body: {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'Test@123',
            confirmPassword: 'Test@123'
          }
        };

        const result = await runValidation(signupValidation, req);
        const emailErrors = result.array().filter(e => e.path === 'email');
        expect(emailErrors).toHaveLength(0);
      });

      it('should fail when email is empty', async () => {
        const req = {
          body: {
            name: 'John Doe',
            email: '',
            password: 'Test@123',
            confirmPassword: 'Test@123'
          }
        };

        const result = await runValidation(signupValidation, req);
        const emailErrors = result.array().filter(e => e.path === 'email');
        expect(emailErrors.length).toBeGreaterThan(0);
        expect(emailErrors[0].msg).toBe('Email is required');
      });

      it('should fail with invalid email format', async () => {
        const req = {
          body: {
            name: 'John Doe',
            email: 'notanemail',
            password: 'Test@123',
            confirmPassword: 'Test@123'
          }
        };

        const result = await runValidation(signupValidation, req);
        const emailErrors = result.array().filter(e => e.path === 'email');
        expect(emailErrors.some(e => e.msg === 'Please enter a valid email address')).toBe(true);
      });

      it('should fail with email missing @', async () => {
        const req = {
          body: {
            name: 'John Doe',
            email: 'johnexample.com',
            password: 'Test@123',
            confirmPassword: 'Test@123'
          }
        };

        const result = await runValidation(signupValidation, req);
        const emailErrors = result.array().filter(e => e.path === 'email');
        expect(emailErrors.some(e => e.msg === 'Please enter a valid email address')).toBe(true);
      });
    });

    describe('password validation', () => {
      it('should pass with valid password', async () => {
        const req = {
          body: {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'Test@123',
            confirmPassword: 'Test@123'
          }
        };

        const result = await runValidation(signupValidation, req);
        const passwordErrors = result.array().filter(e => e.path === 'password');
        expect(passwordErrors).toHaveLength(0);
      });

      it('should fail when password is empty', async () => {
        const req = {
          body: {
            name: 'John Doe',
            email: 'john@example.com',
            password: '',
            confirmPassword: ''
          }
        };

        const result = await runValidation(signupValidation, req);
        const passwordErrors = result.array().filter(e => e.path === 'password');
        expect(passwordErrors.length).toBeGreaterThan(0);
        expect(passwordErrors[0].msg).toBe('Password is required');
      });

      it('should fail when password is too short', async () => {
        const req = {
          body: {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'Test@12',
            confirmPassword: 'Test@12'
          }
        };

        const result = await runValidation(signupValidation, req);
        const passwordErrors = result.array().filter(e => e.path === 'password');
        expect(passwordErrors.some(e => e.msg === 'Password must be at least 8 characters')).toBe(true);
      });

      it('should fail when password lacks uppercase letter', async () => {
        const req = {
          body: {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'test@123',
            confirmPassword: 'test@123'
          }
        };

        const result = await runValidation(signupValidation, req);
        const passwordErrors = result.array().filter(e => e.path === 'password');
        expect(passwordErrors.some(e => e.msg === 'Password must contain at least one uppercase letter')).toBe(true);
      });

      it('should fail when password lacks lowercase letter', async () => {
        const req = {
          body: {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'TEST@123',
            confirmPassword: 'TEST@123'
          }
        };

        const result = await runValidation(signupValidation, req);
        const passwordErrors = result.array().filter(e => e.path === 'password');
        expect(passwordErrors.some(e => e.msg === 'Password must contain at least one lowercase letter')).toBe(true);
      });

      it('should fail when password lacks number', async () => {
        const req = {
          body: {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'Test@abc',
            confirmPassword: 'Test@abc'
          }
        };

        const result = await runValidation(signupValidation, req);
        const passwordErrors = result.array().filter(e => e.path === 'password');
        expect(passwordErrors.some(e => e.msg === 'Password must contain at least one number')).toBe(true);
      });

      it('should fail when password lacks special character', async () => {
        const req = {
          body: {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'Test1234',
            confirmPassword: 'Test1234'
          }
        };

        const result = await runValidation(signupValidation, req);
        const passwordErrors = result.array().filter(e => e.path === 'password');
        expect(passwordErrors.some(e => e.msg === 'Password must contain at least one special character')).toBe(true);
      });
    });

    describe('confirmPassword validation', () => {
      it('should pass when passwords match', async () => {
        const req = {
          body: {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'Test@123',
            confirmPassword: 'Test@123'
          }
        };

        const result = await runValidation(signupValidation, req);
        const confirmErrors = result.array().filter(e => e.path === 'confirmPassword');
        expect(confirmErrors).toHaveLength(0);
      });

      it('should fail when confirmPassword is empty', async () => {
        const req = {
          body: {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'Test@123',
            confirmPassword: ''
          }
        };

        const result = await runValidation(signupValidation, req);
        const confirmErrors = result.array().filter(e => e.path === 'confirmPassword');
        expect(confirmErrors.length).toBeGreaterThan(0);
        expect(confirmErrors[0].msg).toBe('Please confirm password');
      });

      it('should fail when passwords do not match', async () => {
        const req = {
          body: {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'Test@123',
            confirmPassword: 'Test@124'
          }
        };

        const result = await runValidation(signupValidation, req);
        const confirmErrors = result.array().filter(e => e.path === 'confirmPassword');
        expect(confirmErrors.some(e => e.msg === 'Passwords do not match')).toBe(true);
      });
    });
  });

  describe('loginValidation', () => {
    describe('email validation', () => {
      it('should pass with valid email', async () => {
        const req = {
          body: {
            email: 'john@example.com',
            password: 'password123'
          }
        };

        const result = await runValidation(loginValidation, req);
        const emailErrors = result.array().filter(e => e.path === 'email');
        expect(emailErrors).toHaveLength(0);
      });

      it('should fail when email is empty', async () => {
        const req = {
          body: {
            email: '',
            password: 'password123'
          }
        };

        const result = await runValidation(loginValidation, req);
        const emailErrors = result.array().filter(e => e.path === 'email');
        expect(emailErrors.length).toBeGreaterThan(0);
        expect(emailErrors[0].msg).toBe('Email is required');
      });

      it('should fail with invalid email format', async () => {
        const req = {
          body: {
            email: 'notanemail',
            password: 'password123'
          }
        };

        const result = await runValidation(loginValidation, req);
        const emailErrors = result.array().filter(e => e.path === 'email');
        expect(emailErrors.some(e => e.msg === 'Please enter a valid email address')).toBe(true);
      });
    });

    describe('password validation', () => {
      it('should pass with valid password', async () => {
        const req = {
          body: {
            email: 'john@example.com',
            password: 'password123'
          }
        };

        const result = await runValidation(loginValidation, req);
        const passwordErrors = result.array().filter(e => e.path === 'password');
        expect(passwordErrors).toHaveLength(0);
      });

      it('should fail when password is empty', async () => {
        const req = {
          body: {
            email: 'john@example.com',
            password: ''
          }
        };

        const result = await runValidation(loginValidation, req);
        const passwordErrors = result.array().filter(e => e.path === 'password');
        expect(passwordErrors.length).toBeGreaterThan(0);
        expect(passwordErrors[0].msg).toBe('Password is required');
      });

      it('should fail when password is too short', async () => {
        const req = {
          body: {
            email: 'john@example.com',
            password: 'test123'
          }
        };

        const result = await runValidation(loginValidation, req);
        const passwordErrors = result.array().filter(e => e.path === 'password');
        expect(passwordErrors.some(e => e.msg === 'Password must be at least 8 characters')).toBe(true);
      });

      it('should not check for complexity requirements on login', async () => {
        // Login should only check length, not complexity
        const req = {
          body: {
            email: 'john@example.com',
            password: 'simplepassword'
          }
        };

        const result = await runValidation(loginValidation, req);
        const passwordErrors = result.array().filter(e => e.path === 'password');
        // Should pass because it's 8+ characters, complexity not required for login
        expect(passwordErrors).toHaveLength(0);
      });
    });
  });
});
