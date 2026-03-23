/**
 * Validation utilities for form inputs
 * Each function returns { valid: boolean, message: string }
 */

/**
 * Validates email format
 * @param {string} email - Email address to validate
 * @returns {{ valid: boolean, message: string }}
 */
export const validateEmail = (email) => {
  if (!email || !email.trim()) {
    return { valid: false, message: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, message: 'Please enter a valid email address' };
  }

  return { valid: true, message: '' };
};

/**
 * Validates password for login (minimum 6 characters)
 * @param {string} password - Password to validate
 * @returns {{ valid: boolean, message: string }}
 */
export const validatePassword = (password) => {
  if (!password || !password.trim()) {
    return { valid: false, message: 'Password is required' };
  }

  if (password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters' };
  }

  return { valid: true, message: '' };
};

/**
 * Validates password for signup with strength requirements
 * Minimum 8 characters, at least one uppercase, one lowercase, one number
 * @param {string} password - Password to validate
 * @returns {{ valid: boolean, message: string }}
 */
export const validateSignupPassword = (password) => {
  if (!password || !password.trim()) {
    return { valid: false, message: 'Password is required' };
  }

  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters' };
  }

  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }

  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }

  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }

  return { valid: true, message: '' };
};

/**
 * Validates name field
 * Minimum 2 characters, allows letters, spaces, hyphens, apostrophes
 * @param {string} name - Name to validate
 * @returns {{ valid: boolean, message: string }}
 */
export const validateName = (name) => {
  if (!name || !name.trim()) {
    return { valid: false, message: 'Name is required' };
  }

  if (name.trim().length < 2) {
    return { valid: false, message: 'Name must be at least 2 characters' };
  }

  const nameRegex = /^[a-zA-Z\s'-]+$/;
  if (!nameRegex.test(name)) {
    return { valid: false, message: 'Name can only contain letters, spaces, hyphens, and apostrophes' };
  }

  return { valid: true, message: '' };
};

/**
 * Validates required field
 * @param {string} value - Value to validate
 * @returns {{ valid: boolean, message: string }}
 */
export const validateRequired = (value) => {
  if (!value || !value.trim()) {
    return { valid: false, message: 'This field is required' };
  }

  return { valid: true, message: '' };
};
