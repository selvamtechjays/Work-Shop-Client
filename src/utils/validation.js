/**
 * Validation utility functions for form inputs
 */

/**
 * Validates email format using RFC 5322 compliant regex
 * @param {string} email - Email address to validate
 * @returns {Object} { valid: boolean, error: string }
 */
export const validateEmail = (email) => {
  if (!email) {
    return { valid: false, error: 'Email is required' };
  }

  // RFC 5322 compliant email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Please enter a valid email address' };
  }

  return { valid: true, error: '' };
};

/**
 * Validates password strength and returns detailed feedback
 * @param {string} password - Password to validate
 * @returns {Object} { valid: boolean, error: string, strength: string, meetsLength: boolean, hasUpper: boolean, hasLower: boolean, hasNumber: boolean, hasSpecial: boolean }
 */
export const validatePassword = (password) => {
  if (!password) {
    return {
      valid: false,
      error: 'Password is required',
      strength: 'weak',
      meetsLength: false,
      hasUpper: false,
      hasLower: false,
      hasNumber: false,
      hasSpecial: false,
    };
  }

  const meetsLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  const criteriaMet = [meetsLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;

  let strength = 'weak';
  if (criteriaMet >= 5) {
    strength = 'strong';
  } else if (criteriaMet >= 3) {
    strength = 'medium';
  }

  const valid = criteriaMet === 5;
  const errors = [];

  if (!meetsLength) errors.push('at least 8 characters');
  if (!hasUpper) errors.push('one uppercase letter');
  if (!hasLower) errors.push('one lowercase letter');
  if (!hasNumber) errors.push('one number');
  if (!hasSpecial) errors.push('one special character');

  const error = errors.length > 0 ? `Password must contain ${errors.join(', ')}` : '';

  return {
    valid,
    error,
    strength,
    meetsLength,
    hasUpper,
    hasLower,
    hasNumber,
    hasSpecial,
  };
};

/**
 * Validates name field
 * @param {string} name - Name to validate
 * @returns {Object} { valid: boolean, error: string }
 */
export const validateName = (name) => {
  if (!name) {
    return { valid: false, error: 'Name is required' };
  }

  const trimmedName = name.trim();

  if (trimmedName.length === 0) {
    return { valid: false, error: 'Name is required' };
  }

  if (trimmedName.length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters long' };
  }

  if (trimmedName.length > 50) {
    return { valid: false, error: 'Name must not exceed 50 characters' };
  }

  // Allow letters, spaces, hyphens, and apostrophes
  const nameRegex = /^[a-zA-Z\s'-]+$/;
  if (!nameRegex.test(trimmedName)) {
    return { valid: false, error: 'Name can only contain letters, spaces, hyphens, and apostrophes' };
  }

  return { valid: true, error: '' };
};

/**
 * Validates password confirmation match
 * @param {string} password - Original password
 * @param {string} confirmPassword - Confirmation password
 * @returns {Object} { valid: boolean, error: string }
 */
export const validatePasswordMatch = (password, confirmPassword) => {
  if (!confirmPassword) {
    return { valid: false, error: 'Please confirm your password' };
  }

  if (password !== confirmPassword) {
    return { valid: false, error: 'Passwords do not match' };
  }

  return { valid: true, error: '' };
};
