/**
 * Auth Controller
 * Handles authentication business logic for signup and login
 */

import { handleDatabaseError } from '../utils/error-handler.js';

/**
 * Handles user signup/registration
 * @param {Object} req - Express request object with name, email, password in body
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with user data or error
 */
export const signupController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // TODO: Add actual database logic here
    // This is a mock implementation showing the expected structure
    // In a real implementation, you would:
    // 1. Hash the password using bcrypt
    // 2. Create user in database
    // 3. Generate JWT token
    // 4. Return user data and token

    // Mock user creation (replace with actual DB logic)
    const mockUser = {
      _id: 'mock-user-id-' + Date.now(),
      name,
      email
    };

    // Return 201 Created with user data
    return res.status(201).json({
      user: {
        _id: mockUser._id,
        email: mockUser.email
      },
      token: 'mock-jwt-token' // Replace with actual JWT
    });
  } catch (error) {
    // Handle duplicate email error
    const dbError = handleDatabaseError(error);
    if (dbError) {
      return res.status(409).json({
        errors: [dbError]
      });
    }

    // Handle other errors
    console.error('Signup error:', error);
    return res.status(500).json({
      errors: [{
        field: 'general',
        message: 'An error occurred during registration'
      }]
    });
  }
};

/**
 * Handles user login/authentication
 * @param {Object} req - Express request object with email, password in body
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with user data or error
 */
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // TODO: Add actual authentication logic here
    // This is a mock implementation showing the expected structure
    // In a real implementation, you would:
    // 1. Find user by email in database
    // 2. Compare password hash using bcrypt
    // 3. Generate JWT token
    // 4. Return user data and token

    // Mock authentication (replace with actual DB logic)
    const mockUser = {
      _id: 'mock-user-id',
      email
    };

    // For security, always return generic error message
    // Don't reveal whether email or password was incorrect
    const isValidCredentials = true; // Replace with actual password comparison

    if (!isValidCredentials) {
      return res.status(401).json({
        errors: [{
          field: 'general',
          message: 'Invalid credentials'
        }]
      });
    }

    // Return 200 OK with user data
    return res.status(200).json({
      user: {
        _id: mockUser._id,
        email: mockUser.email
      },
      token: 'mock-jwt-token' // Replace with actual JWT
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      errors: [{
        field: 'general',
        message: 'An error occurred during login'
      }]
    });
  }
};
