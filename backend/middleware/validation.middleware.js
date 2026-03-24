/**
 * Validation Middleware
 * Processes validation results from express-validator and returns formatted errors
 */

import { validationResult } from 'express-validator';
import { formatValidationErrors } from '../utils/error-handler.js';

/**
 * Validates request and returns formatted error response if validation fails
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object|void} Returns error response if validation fails, otherwise calls next()
 */
export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = formatValidationErrors(errors.array());
    return res.status(400).json({ errors: formattedErrors });
  }

  next();
};
