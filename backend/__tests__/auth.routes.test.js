/**
 * Integration Tests for Auth Routes
 */

import { describe, it, expect, beforeAll } from 'vitest';
import express from 'express';
import request from 'supertest';
import authRoutes from '../routes/auth.routes.js';

describe('Auth Routes Integration Tests', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api', authRoutes);
  });

  describe('POST /api/signup', () => {
    it('should return 201 with valid signup data', async () => {
      const response = await request(app)
        .post('/api/signup')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'Test@123',
          confirmPassword: 'Test@123'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('_id');
      expect(response.body.user).toHaveProperty('email', 'john@example.com');
    });

    it('should return 400 with invalid email format', async () => {
      const response = await request(app)
        .post('/api/signup')
        .send({
          name: 'John Doe',
          email: 'notanemail',
          password: 'Test@123',
          confirmPassword: 'Test@123'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors).toBeInstanceOf(Array);
      expect(response.body.errors.some(e => e.field === 'email')).toBe(true);
    });

    it('should return 400 with weak password (missing uppercase)', async () => {
      const response = await request(app)
        .post('/api/signup')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'test@123',
          confirmPassword: 'test@123'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
      const passwordErrors = response.body.errors.filter(e => e.field === 'password');
      expect(passwordErrors.some(e => e.message.includes('uppercase'))).toBe(true);
    });

    it('should return 400 with weak password (missing special character)', async () => {
      const response = await request(app)
        .post('/api/signup')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'Test1234',
          confirmPassword: 'Test1234'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
      const passwordErrors = response.body.errors.filter(e => e.field === 'password');
      expect(passwordErrors.some(e => e.message.includes('special character'))).toBe(true);
    });

    it('should return 400 when passwords do not match', async () => {
      const response = await request(app)
        .post('/api/signup')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'Test@123',
          confirmPassword: 'Test@124'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors.some(e => e.field === 'confirmPassword')).toBe(true);
    });

    it('should return 400 with invalid name (too short)', async () => {
      const response = await request(app)
        .post('/api/signup')
        .send({
          name: 'J',
          email: 'john@example.com',
          password: 'Test@123',
          confirmPassword: 'Test@123'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors.some(e => e.field === 'name')).toBe(true);
    });

    it('should return 400 with invalid name (starts with number)', async () => {
      const response = await request(app)
        .post('/api/signup')
        .send({
          name: '1John',
          email: 'john@example.com',
          password: 'Test@123',
          confirmPassword: 'Test@123'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors.some(e => e.field === 'name')).toBe(true);
    });

    it('should return 400 when name is missing', async () => {
      const response = await request(app)
        .post('/api/signup')
        .send({
          email: 'john@example.com',
          password: 'Test@123',
          confirmPassword: 'Test@123'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors.some(e => e.field === 'name')).toBe(true);
    });

    it('should return 400 when email is missing', async () => {
      const response = await request(app)
        .post('/api/signup')
        .send({
          name: 'John Doe',
          password: 'Test@123',
          confirmPassword: 'Test@123'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors.some(e => e.field === 'email')).toBe(true);
    });

    it('should return 400 when password is missing', async () => {
      const response = await request(app)
        .post('/api/signup')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          confirmPassword: 'Test@123'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors.some(e => e.field === 'password')).toBe(true);
    });

    it('should return 400 with password shorter than 8 characters', async () => {
      const response = await request(app)
        .post('/api/signup')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'Test@12',
          confirmPassword: 'Test@12'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
      const passwordErrors = response.body.errors.filter(e => e.field === 'password');
      expect(passwordErrors.some(e => e.message.includes('8 characters'))).toBe(true);
    });
  });

  describe('POST /api/login', () => {
    it('should return 200 with valid login credentials', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          email: 'john@example.com',
          password: 'Test@123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('_id');
      expect(response.body.user).toHaveProperty('email', 'john@example.com');
    });

    it('should return 400 with invalid email format', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          email: 'notanemail',
          password: 'password123'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors.some(e => e.field === 'email')).toBe(true);
    });

    it('should return 400 with password shorter than 8 characters', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          email: 'john@example.com',
          password: 'test123'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors.some(e => e.field === 'password')).toBe(true);
    });

    it('should return 400 when email is missing', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          password: 'password123'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors.some(e => e.field === 'email')).toBe(true);
    });

    it('should return 400 when password is missing', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          email: 'john@example.com'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors.some(e => e.field === 'password')).toBe(true);
    });

    it('should not enforce password complexity on login', async () => {
      // Login should only check minimum length, not complexity
      const response = await request(app)
        .post('/api/login')
        .send({
          email: 'john@example.com',
          password: 'simplepassword'
        });

      // Should pass validation (not 400)
      // Might be 200 (success) or 401 (invalid creds) but not 400 (validation error)
      expect(response.status).not.toBe(400);
    });

    it('should handle empty request body', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Error response structure', () => {
    it('should return errors in consistent format', async () => {
      const response = await request(app)
        .post('/api/signup')
        .send({
          name: '',
          email: 'notanemail',
          password: 'weak',
          confirmPassword: 'different'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
      expect(Array.isArray(response.body.errors)).toBe(true);

      // Check that each error has field and message properties
      response.body.errors.forEach(error => {
        expect(error).toHaveProperty('field');
        expect(error).toHaveProperty('message');
        expect(typeof error.field).toBe('string');
        expect(typeof error.message).toBe('string');
      });
    });
  });
});
