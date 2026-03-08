// src/routes/adminRoutes.js
import express from 'express';
import {
  login,
  getDashboardStats,
  getAllChats,
  getAllSessions,
} from '../controllers/adminController.js';
import { authenticate } from '../middleware/auth.js';
import { adminLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Public route
router.post('/login', adminLimiter, login);

// Protected routes
router.use(authenticate);
router.get('/stats', getDashboardStats);
router.get('/chats', getAllChats);
router.get('/sessions', getAllSessions);

export default router;
