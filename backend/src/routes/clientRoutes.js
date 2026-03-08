// src/routes/clientRoutes.js
import express from 'express';
import {
  createClient,
  getAllClients,
  getClient,
  updateClient,
  deleteClient,
} from '../controllers/clientController.js';
import { authenticate } from '../middleware/auth.js';
import { adminLimiter } from '../middleware/rateLimiter.js';
import { validateClient, handleValidationErrors } from '../utils/validation.js';

const router = express.Router();

// All client routes require authentication
router.use(authenticate);
router.use(adminLimiter);

router.post('/', validateClient, handleValidationErrors, createClient);
router.get('/', getAllClients);
router.get('/:website', getClient);
router.put('/:website', validateClient, handleValidationErrors, updateClient);
router.delete('/:website', deleteClient);

export default router;
