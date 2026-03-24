/**
 * Auth Routes
 * Defines authentication routes with validation middleware
 */

import express from 'express';
import { signupValidation, loginValidation } from '../validators/auth.validators.js';
import { validateRequest } from '../middleware/validation.middleware.js';
import { signupController, loginController } from '../controllers/auth.controller.js';

const router = express.Router();

/**
 * POST /signup
 * Register a new user
 * Validates: name, email, password, confirmPassword
 * Returns: 201 with user data on success, 400 for validation errors, 409 for duplicate email
 */
router.post('/signup', signupValidation, validateRequest, signupController);

/**
 * POST /login
 * Authenticate existing user
 * Validates: email, password
 * Returns: 200 with user data on success, 400 for validation errors, 401 for invalid credentials
 */
router.post('/login', loginValidation, validateRequest, loginController);

export default router;
