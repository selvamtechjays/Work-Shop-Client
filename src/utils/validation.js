/**
 * Validates email format
 * @param {string} email - The email address to validate
 * @returns {Object} - { isValid: boolean, error: string }
 */
export const validateEmail = (email) => {
  // Handle empty/null values
  if (!email || email.trim() === '') {
    return {
      isValid: false,
      error: 'Email is required'
    };
  }

  // Trim whitespace
  const trimmedEmail = email.trim();

  // Email regex pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Test email against pattern
  if (!emailRegex.test(trimmedEmail)) {
    return {
      isValid: false,
      error: 'Please enter a valid email address'
    };
  }

  return {
    isValid: true,
    error: ''
  };
};

/**
 * Validates password for signup with complexity requirements
 * @param {string} password - The password to validate
 * @returns {Object} - { isValid: boolean, error: string, strength: string }
 */
export const validatePassword = (password) => {
  // Handle empty/null values
  if (!password) {
    return {
      isValid: false,
      error: 'Password is required',
      strength: ''
    };
  }

  const errors = [];
  let requirementsMet = 0;

  // Check length (minimum 8 characters)
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  } else {
    requirementsMet++;
  }

  // Check for uppercase letter
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  } else {
    requirementsMet++;
  }

  // Check for lowercase letter
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  } else {
    requirementsMet++;
  }

  // Check for number
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  } else {
    requirementsMet++;
  }

  // Check for special character
  if (!/[!@#$%^&*()_+\-=\[\]{}|;:',.<>?]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*()_+-=[]{}|;:\',.<>?)');
  } else {
    requirementsMet++;
  }

  // Calculate strength
  let strength = '';
  if (password.length >= 8) {
    if (requirementsMet === 5) {
      strength = 'strong';
    } else if (requirementsMet >= 3) {
      strength = 'medium';
    } else {
      strength = 'weak';
    }
  }

  // Return validation result
  if (errors.length > 0) {
    return {
      isValid: false,
      error: errors[0], // Return first error
      strength
    };
  }

  return {
    isValid: true,
    error: '',
    strength
  };
};

/**
 * Validates password for login (simpler validation)
 * @param {string} password - The password to validate
 * @returns {Object} - { isValid: boolean, error: string }
 */
export const validatePasswordLogin = (password) => {
  // Handle empty/null values
  if (!password || password === '') {
    return {
      isValid: false,
      error: 'Password is required'
    };
  }

  // Check minimum length
  if (password.length < 8) {
    return {
      isValid: false,
      error: 'Password must be at least 8 characters'
    };
  }

  return {
    isValid: true,
    error: ''
  };
};

/**
 * Validates name field
 * @param {string} name - The name to validate
 * @returns {Object} - { isValid: boolean, error: string }
 */
export const validateName = (name) => {
  // Handle empty/null values
  if (!name || name.trim() === '') {
    return {
      isValid: false,
      error: 'Name is required'
    };
  }

  // Trim whitespace
  const trimmedName = name.trim();

  // Check minimum length
  if (trimmedName.length < 2) {
    return {
      isValid: false,
      error: 'Name must be at least 2 characters'
    };
  }

  // Check maximum length
  if (trimmedName.length > 50) {
    return {
      isValid: false,
      error: 'Name must be no more than 50 characters'
    };
  }

  // Check for valid characters (letters, spaces, hyphens, apostrophes)
  // Must start with a letter
  const nameRegex = /^[a-zA-Z][a-zA-Z\s'\-]*$/;
  if (!nameRegex.test(trimmedName)) {
    return {
      isValid: false,
      error: 'Name must start with a letter and contain only letters, spaces, hyphens, and apostrophes'
    };
  }

  return {
    isValid: true,
    error: ''
  };
};

/**
 * Validates password confirmation
 * @param {string} password - The original password
 * @param {string} confirmPassword - The confirmation password
 * @returns {Object} - { isValid: boolean, error: string }
 */
export const validatePasswordMatch = (password, confirmPassword) => {
  // Handle empty confirmPassword
  if (!confirmPassword || confirmPassword === '') {
    return {
      isValid: false,
      error: 'Please confirm your password'
    };
  }

  // Check if passwords match (case-sensitive)
  if (password !== confirmPassword) {
    return {
      isValid: false,
      error: 'Passwords do not match'
    };
  }

  return {
    isValid: true,
    error: ''
  };
};
