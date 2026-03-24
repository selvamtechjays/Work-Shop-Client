/**
 * Error Handler Utility
 * Provides centralized error formatting for validation and database errors
 */

/**
 * Formats validation errors from express-validator into consistent structure
 * @param {Array} errors - Array of validation errors from express-validator
 * @returns {Array} Formatted errors array with {field, message} structure
 */
export const formatValidationErrors = (errors) => {
  return errors.map(error => ({
    field: error.path || error.param,
    message: error.msg
  }));
};

/**
 * Handles database-specific errors and converts them to user-friendly format
 * @param {Error} error - Database error object
 * @returns {Object|null} Formatted error object or null if not a recognized database error
 */
export const handleDatabaseError = (error) => {
  // MongoDB duplicate key error
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern || {})[0] || 'email';
    return {
      field,
      message: `${field.charAt(0).toUpperCase() + field.slice(1)} already registered`
    };
  }

  // MySQL duplicate entry error
  if (error.code === 'ER_DUP_ENTRY') {
    // Extract field name from error message
    const match = error.message.match(/for key '([^']+)'/);
    const field = match ? match[1].split('.').pop() : 'email';
    return {
      field,
      message: `${field.charAt(0).toUpperCase() + field.slice(1)} already registered`
    };
  }

  // MySQL foreign key constraint error
  if (error.code === 'ER_NO_REFERENCED_ROW' || error.code === 'ER_ROW_IS_REFERENCED') {
    return {
      field: 'general',
      message: 'Invalid reference in data'
    };
  }

  return null;
};

/**
 * Async handler wrapper to catch errors in async route handlers
 * @param {Function} fn - Async function to wrap
 * @returns {Function} Express middleware function
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
