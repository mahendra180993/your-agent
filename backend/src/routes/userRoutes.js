// src/routes/userRoutes.js
import express from 'express';
import {
  createUser,
  getAllUsers,
  getCurrentUser,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';
import { adminLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get current user
router.get('/me', getCurrentUser);

// Get all users (admin only)
router.get('/', adminLimiter, getAllUsers);

// Create user (admin only)
router.post('/', adminLimiter, createUser);

// Update user
router.put('/:userId', adminLimiter, updateUser);

// Delete user
router.delete('/:userId', adminLimiter, deleteUser);

export default router;
