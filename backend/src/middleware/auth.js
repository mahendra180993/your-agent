// src/middleware/auth.js
import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';

export const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    logger.error(`Authentication error: ${error.message}`);
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token',
    });
  }
};

export const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// Middleware to check if user is admin (can be enhanced later)
export const requireAdmin = (req, res, next) => {
  // This will be enhanced when we load user from database
  // For now, we'll check in the controller
  next();
};
