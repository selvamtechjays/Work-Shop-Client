/**
 * Form Validation Utilities
 * Provides comprehensive validation for authentication forms with edge case handling
 */

/**
 * Validates email format
 * @param {string} email - Email address to validate
 * @returns {{isValid: boolean, error: string}} Validation result
 */
export const validateEmail = (email) => {
  // Handle null/undefined
  if (!email && email !== '') {
    return { isValid: false, error: 'Email is required' };
  }

  // Convert to string and trim
  const emailStr = String(email).trim();

  // Check if empty after trim (whitespace-only)
  if (emailStr === '') {
    return { isValid: false, error: 'Email is required' };
  }

  // Check max length (prevent extremely long inputs)
  if (emailStr.length > 1000) {
    return { isValid: false, error: 'Email is too long' };
  }

  // Email regex pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(emailStr)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  return { isValid: true, error: '' };
};

/**
 * Validates password complexity for signup
 * @param {string} password - Password to validate
 * @returns {{isValid: boolean, error: string, strength: string}} Validation result with strength
 */
export const validatePassword = (password) => {
  // Handle null/undefined
  if (!password && password !== '') {
    return { isValid: false, error: 'Password is required', strength: 'weak' };
  }

  // Convert to string
  const passwordStr = String(password);

  // Check if empty
  if (passwordStr === '') {
    return { isValid: false, error: 'Password is required', strength: 'weak' };
  }

  // Check max length
  if (passwordStr.length > 1000) {
    return { isValid: false, error: 'Password is too long', strength: 'weak' };
  }

  // Check minimum length
  if (passwordStr.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters', strength: 'weak' };
  }

  // Check for uppercase letter
  if (!/[A-Z]/.test(passwordStr)) {
    return { isValid: false, error: 'Password must contain at least one uppercase letter', strength: 'weak' };
  }

  // Check for lowercase letter
  if (!/[a-z]/.test(passwordStr)) {
    return { isValid: false, error: 'Password must contain at least one lowercase letter', strength: 'weak' };
  }

  // Check for number
  if (!/[0-9]/.test(passwordStr)) {
    return { isValid: false, error: 'Password must contain at least one number', strength: 'weak' };
  }

  // Check for special character
  if (!/[!@#$%^&*()_+\-=\[\]{}|;:'",.<>?]/.test(passwordStr)) {
    return { isValid: false, error: 'Password must contain at least one special character', strength: 'weak' };
  }

  // Calculate strength
  const strength = calculatePasswordStrength(passwordStr);

  return { isValid: true, error: '', strength };
};

/**
 * Validates password for login (less strict)
 * @param {string} password - Password to validate
 * @returns {{isValid: boolean, error: string}} Validation result
 */
export const validatePasswordLogin = (password) => {
  // Handle null/undefined
  if (!password && password !== '') {
    return { isValid: false, error: 'Password is required' };
  }

  // Convert to string
  const passwordStr = String(password);

  // Check if empty
  if (passwordStr === '') {
    return { isValid: false, error: 'Password is required' };
  }

  // Check max length
  if (passwordStr.length > 1000) {
    return { isValid: false, error: 'Password is too long' };
  }

  // Check minimum length only for login
  if (passwordStr.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters' };
  }

  return { isValid: true, error: '' };
};

/**
 * Validates name format
 * @param {string} name - Name to validate
 * @returns {{isValid: boolean, error: string}} Validation result
 */
export const validateName = (name) => {
  // Handle null/undefined
  if (!name && name !== '') {
    return { isValid: false, error: 'Name is required' };
  }

  // Convert to string and trim
  const nameStr = String(name).trim();

  // Check if empty after trim (whitespace-only)
  if (nameStr === '') {
    return { isValid: false, error: 'Name is required' };
  }

  // Check max length
  if (nameStr.length > 1000) {
    return { isValid: false, error: 'Name is too long' };
  }

  // Check minimum length
  if (nameStr.length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters' };
  }

  // Check maximum length
  if (nameStr.length > 50) {
    return { isValid: false, error: 'Name must be 50 characters or less' };
  }

  // Check format: must start with letter, can contain letters (including unicode), spaces, hyphens, apostrophes
  // Using \p{L} for Unicode letter support
  const nameRegex = /^[\p{L}][\p{L}\s'\-]*$/u;

  if (!nameRegex.test(nameStr)) {
    return { isValid: false, error: 'Name must start with a letter and contain only letters, spaces, hyphens, and apostrophes' };
  }

  return { isValid: true, error: '' };
};

/**
 * Validates password confirmation matches
 * @param {string} password - Original password
 * @param {string} confirmPassword - Confirmation password
 * @returns {{isValid: boolean, error: string}} Validation result
 */
export const validatePasswordMatch = (password, confirmPassword) => {
  // Handle null/undefined
  if (!confirmPassword && confirmPassword !== '') {
    return { isValid: false, error: 'Please confirm password' };
  }

  // Convert to string
  const confirmPasswordStr = String(confirmPassword);

  // Check if empty
  if (confirmPasswordStr === '') {
    return { isValid: false, error: 'Please confirm password' };
  }

  // Check if passwords match
  if (password !== confirmPassword) {
    return { isValid: false, error: 'Passwords do not match' };
  }

  return { isValid: true, error: '' };
};

/**
 * Calculates password strength based on requirements met
 * @param {string} password - Password to evaluate
 * @returns {string} Strength level: 'weak', 'medium', or 'strong'
 */
export const calculatePasswordStrength = (password) => {
  if (!password) return 'weak';

  let requirementsMet = 0;

  // Check each requirement
  if (password.length >= 8) requirementsMet++;
  if (/[A-Z]/.test(password)) requirementsMet++;
  if (/[a-z]/.test(password)) requirementsMet++;
  if (/[0-9]/.test(password)) requirementsMet++;
  if (/[!@#$%^&*()_+\-=\[\]{}|;:'",.<>?]/.test(password)) requirementsMet++;

  // Classify strength
  if (requirementsMet === 5) return 'strong';
  if (requirementsMet >= 3) return 'medium';
  return 'weak';
};

/**
 * Validates email domain (optional - checks for disposable email providers)
 * @param {string} email - Email address to validate
 * @returns {{isValid: boolean, error: string}} Validation result
 */
export const validateEmailDomain = (email) => {
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }

  const emailStr = String(email).trim().toLowerCase();

  // List of common disposable email providers
  const disposableDomains = [
    'tempmail.com',
    '10minutemail.com',
    'guerrillamail.com',
    'mailinator.com',
    'throwaway.email',
    'temp-mail.org'
  ];

  // Extract domain from email
  const domain = emailStr.split('@')[1];

  if (domain && disposableDomains.includes(domain)) {
    return { isValid: false, error: 'Disposable email addresses are not allowed' };
  }

  return { isValid: true, error: '' };
};
