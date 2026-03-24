/**
 * Tests for Error Handler Utility
 */

import { describe, it, expect, vi } from 'vitest';
import {
  formatValidationErrors,
  handleDatabaseError,
  asyncHandler
} from '../utils/error-handler.js';

describe('Error Handler Utility', () => {
  describe('formatValidationErrors', () => {
    it('should format errors with path field', () => {
      const errors = [
        { path: 'email', msg: 'Invalid email' },
        { path: 'password', msg: 'Password too short' }
      ];

      const result = formatValidationErrors(errors);

      expect(result).toEqual([
        { field: 'email', message: 'Invalid email' },
        { field: 'password', message: 'Password too short' }
      ]);
    });

    it('should format errors with param field', () => {
      const errors = [
        { param: 'name', msg: 'Name is required' }
      ];

      const result = formatValidationErrors(errors);

      expect(result).toEqual([
        { field: 'name', message: 'Name is required' }
      ]);
    });

    it('should handle empty errors array', () => {
      const errors = [];
      const result = formatValidationErrors(errors);
      expect(result).toEqual([]);
    });

    it('should prefer path over param if both exist', () => {
      const errors = [
        { path: 'email', param: 'differentField', msg: 'Test message' }
      ];

      const result = formatValidationErrors(errors);

      expect(result[0].field).toBe('email');
    });
  });

  describe('handleDatabaseError', () => {
    it('should handle MongoDB duplicate key error (code 11000)', () => {
      const error = {
        code: 11000,
        keyPattern: { email: 1 }
      };

      const result = handleDatabaseError(error);

      expect(result).toEqual({
        field: 'email',
        message: 'Email already registered'
      });
    });

    it('should handle MongoDB duplicate key error without keyPattern', () => {
      const error = {
        code: 11000
      };

      const result = handleDatabaseError(error);

      expect(result).toEqual({
        field: 'email',
        message: 'Email already registered'
      });
    });

    it('should handle MySQL duplicate entry error', () => {
      const error = {
        code: 'ER_DUP_ENTRY',
        message: "Duplicate entry 'test@example.com' for key 'users.email'"
      };

      const result = handleDatabaseError(error);

      expect(result).toEqual({
        field: 'email',
        message: 'Email already registered'
      });
    });

    it('should handle MySQL duplicate entry error with different field', () => {
      const error = {
        code: 'ER_DUP_ENTRY',
        message: "Duplicate entry 'username123' for key 'users.username'"
      };

      const result = handleDatabaseError(error);

      expect(result).toEqual({
        field: 'username',
        message: 'Username already registered'
      });
    });

    it('should handle MySQL foreign key constraint error', () => {
      const error = {
        code: 'ER_NO_REFERENCED_ROW'
      };

      const result = handleDatabaseError(error);

      expect(result).toEqual({
        field: 'general',
        message: 'Invalid reference in data'
      });
    });

    it('should handle MySQL row referenced error', () => {
      const error = {
        code: 'ER_ROW_IS_REFERENCED'
      };

      const result = handleDatabaseError(error);

      expect(result).toEqual({
        field: 'general',
        message: 'Invalid reference in data'
      });
    });

    it('should return null for unrecognized errors', () => {
      const error = {
        code: 'UNKNOWN_ERROR'
      };

      const result = handleDatabaseError(error);

      expect(result).toBeNull();
    });

    it('should return null for errors without code', () => {
      const error = {
        message: 'Some error'
      };

      const result = handleDatabaseError(error);

      expect(result).toBeNull();
    });
  });

  describe('asyncHandler', () => {
    it('should call the wrapped function with req, res, next', async () => {
      const mockFn = vi.fn().mockResolvedValue('success');
      const req = {};
      const res = {};
      const next = vi.fn();

      const wrappedFn = asyncHandler(mockFn);
      await wrappedFn(req, res, next);

      expect(mockFn).toHaveBeenCalledWith(req, res, next);
      expect(next).not.toHaveBeenCalled();
    });

    it('should catch errors and call next with error', async () => {
      const mockError = new Error('Test error');
      const mockFn = vi.fn().mockRejectedValue(mockError);
      const req = {};
      const res = {};
      const next = vi.fn();

      const wrappedFn = asyncHandler(mockFn);
      await wrappedFn(req, res, next);

      expect(next).toHaveBeenCalledWith(mockError);
    });

    it('should return a function', () => {
      const mockFn = vi.fn();
      const wrappedFn = asyncHandler(mockFn);

      expect(typeof wrappedFn).toBe('function');
    });

    it('should pass through successful executions', async () => {
      const mockFn = vi.fn().mockResolvedValue(undefined);
      const req = { body: { test: 'data' } };
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      const next = vi.fn();

      const wrappedFn = asyncHandler(mockFn);
      await wrappedFn(req, res, next);

      expect(mockFn).toHaveBeenCalledWith(req, res, next);
      expect(next).not.toHaveBeenCalled();
    });
  });
});
