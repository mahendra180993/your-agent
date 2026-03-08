// src/routes/chatRoutes.js
import express from 'express';
import { sendMessage, getChatHistory, getClientConfig } from '../controllers/chatController.js';
import { chatLimiter } from '../middleware/rateLimiter.js';
import { validateChatMessage, handleValidationErrors } from '../utils/validation.js';

const router = express.Router();

// Chat endpoint with rate limiting
router.post(
  '/',
  chatLimiter,
  validateChatMessage,
  handleValidationErrors,
  sendMessage
);

// Get chat history
router.get('/history', getChatHistory);

// Get client configuration
router.get('/config/:website', getClientConfig);

export default router;
