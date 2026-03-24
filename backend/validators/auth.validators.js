/**
 * Auth Validators
 * Defines validation schemas for signup and login requests using express-validator
 */

import { check } from 'express-validator';

/**
 * Validation rules for user signup
 * Validates: name, email, password, confirmPassword
 */
export const signupValidation = [
  check('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be 2-50 characters')
    .matches(/^[a-zA-Z][a-zA-Z\s'\-]*$/)
    .withMessage('Name must start with a letter and contain only letters, spaces, hyphens, and apostrophes'),

  check('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),

  check('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number')
    .matches(/[!@#$%^&*()_+\-=\[\]{}|;:'",.<>?]/)
    .withMessage('Password must contain at least one special character'),

  check('confirmPassword')
    .notEmpty()
    .withMessage('Please confirm password')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    })
];

/**
 * Validation rules for user login
 * Validates: email, password (basic validation only)
 */
export const loginValidation = [
  check('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),

  check('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
];
