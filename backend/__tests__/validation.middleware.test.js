/**
 * Tests for Validation Middleware
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validateRequest } from '../middleware/validation.middleware.js';
import { validationResult } from 'express-validator';

// Mock express-validator
vi.mock('express-validator', () => ({
  validationResult: vi.fn(),
  check: vi.fn()
}));

describe('Validation Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis()
    };
    next = vi.fn();
  });

  describe('validateRequest', () => {
    it('should call next() when there are no validation errors', () => {
      // Mock validationResult to return empty errors
      validationResult.mockReturnValue({
        isEmpty: () => true,
        array: () => []
      });

      validateRequest(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should return 400 with formatted errors when validation fails', () => {
      // Mock validationResult to return errors
      const mockErrors = [
        { path: 'email', msg: 'Invalid email format' },
        { path: 'password', msg: 'Password too short' }
      ];

      validationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => mockErrors
      });

      validateRequest(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          { field: 'email', message: 'Invalid email format' },
          { field: 'password', message: 'Password too short' }
        ]
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle errors with param field instead of path', () => {
      const mockErrors = [
        { param: 'name', msg: 'Name is required' }
      ];

      validationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => mockErrors
      });

      validateRequest(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          { field: 'name', message: 'Name is required' }
        ]
      });
    });

    it('should handle multiple validation errors', () => {
      const mockErrors = [
        { path: 'email', msg: 'Email is required' },
        { path: 'password', msg: 'Password is required' },
        { path: 'name', msg: 'Name is required' }
      ];

      validationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => mockErrors
      });

      validateRequest(req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        errors: [
          { field: 'email', message: 'Email is required' },
          { field: 'password', message: 'Password is required' },
          { field: 'name', message: 'Name is required' }
        ]
      });
    });
  });
});
