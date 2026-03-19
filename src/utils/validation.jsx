// Validation utility functions

/**
 * Validates display name
 * @param {string} name - Display name to validate
 * @returns {string|null} - Error message if invalid, null if valid
 */
export const validateDisplayName = (name) => {
  if (!name || name.trim().length === 0) {
    return 'Display name is required';
  }
  if (name.trim().length < 2) {
    return 'Display name must be at least 2 characters';
  }
  if (name.trim().length > 50) {
    return 'Display name must be 50 characters or less';
  }
  return null;
};

/**
 * Validates photo URL
 * @param {string} url - Photo URL to validate
 * @returns {string|null} - Error message if invalid, null if valid
 */
export const validatePhotoURL = (url) => {
  if (!url || url.trim().length === 0) {
    return null; // Optional field
  }
  if (!url.startsWith('https://')) {
    return 'Photo URL must use HTTPS';
  }
  try {
    new URL(url);
    return null;
  } catch (error) {
    return 'Please enter a valid URL';
  }
};

/**
 * Formats a date string to a readable format
 * @param {string} dateString - Date string to format
 * @returns {string} - Formatted date string
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (error) {
    return 'N/A';
  }
};

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {string|null} - Error message if invalid, null if valid
 */
export const validateEmail = (email) => {
  if (!email || email.trim().length === 0) {
    return 'Email is required';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  return null;
};

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @returns {string|null} - Error message if invalid, null if valid
 */
export const validatePassword = (password) => {
  if (!password || password.length === 0) {
    return 'Password is required';
  }
  if (password.length < 6) {
    return 'Password must be at least 6 characters';
  }
  return null;
};
