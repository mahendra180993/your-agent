// src/controllers/adminController.js
import mongoose from 'mongoose';
import ChatMessage from '../models/ChatMessage.js';
import Session from '../models/Session.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../middleware/auth.js';
import logger from '../utils/logger.js';

// Legacy login - checks for database users first, then falls back to env vars
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Try database users only if MongoDB is connected (avoids hanging on cold start / disconnected DB)
    const dbReady = mongoose.connection.readyState === 1;
    if (dbReady) {
      try {
        const User = (await import('../models/User.js')).default;
        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (user && user.isActive) {
          const isMatch = await user.comparePassword(password);
          if (isMatch) {
            user.lastLogin = new Date();
            await user.save();
            const token = generateToken(user._id.toString());
            return res.json({
              success: true,
              token,
              user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
              },
            });
          }
        }
      } catch (dbError) {
        // Database error, fall back to env
        logger.debug('Database users not available, using env fallback');
      }
    }
    
    // Fallback to environment variables (for backward compatibility)
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@example.com').trim().toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const inputEmail = (email || '').trim().toLowerCase();
    
    if (inputEmail === adminEmail && password === adminPassword) {
      const token = generateToken('admin');
      res.json({
        success: true,
        token,
        user: { email: adminEmail, name: 'Admin', role: 'admin' },
      });
    } else {
      res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }
  } catch (error) {
    logger.error(`Admin Login Error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const totalMessages = await ChatMessage.countDocuments();
    const totalSessions = await Session.countDocuments();
    const activeSessions = await Session.countDocuments({ isActive: true });
    
    // Get messages from last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentMessages = await ChatMessage.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });
    
    res.json({
      success: true,
      stats: {
        totalMessages,
        totalSessions,
        activeSessions,
        recentMessages,
      },
    });
  } catch (error) {
    logger.error(`Get Dashboard Stats Error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

export const getAllChats = async (req, res) => {
  try {
    const { website, sessionId, page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;
    
    const query = {};
    if (website) query.website = website.toLowerCase().trim();
    if (sessionId) query.sessionId = sessionId;
    
    const messages = await ChatMessage.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('sessionId website message reply sender createdAt metadata');
    
    const total = await ChatMessage.countDocuments(query);
    
    res.json({
      success: true,
      data: messages,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error(`Get All Chats Error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

export const getAllSessions = async (req, res) => {
  try {
    const { website, page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;
    
    const query = {};
    if (website) query.website = website.toLowerCase().trim();
    
    const sessions = await Session.find(query)
      .sort({ 'metadata.lastActivity': -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('sessionId website metadata messageCount isActive createdAt');
    
    const total = await Session.countDocuments(query);
    
    res.json({
      success: true,
      data: sessions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error(`Get All Sessions Error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};
