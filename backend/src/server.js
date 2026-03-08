// src/server.js
// Load environment variables FIRST, before any other imports
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from '../config/database.js';
import corsOptions from './middleware/cors.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import logger from './utils/logger.js';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import routes
import chatRoutes from './routes/chatRoutes.js';
import clientRoutes from './routes/clientRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';

// Initialize Express app
const app = express();

// Serve static files (for chatbot.js)
app.use(express.static('public'));

// Serve frontend static files (if built frontend exists)
const frontendDistPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendDistPath));

// Connect to database (non-blocking)
connectDB().catch(err => {
  logger.warn('Database connection failed, but server will continue running');
  logger.warn('Some features may not work until MongoDB is connected');
});

// Security middleware
app.use(corsOptions);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Trust proxy (required for Render; enables correct req.secure / X-Forwarded-Proto)
app.set('trust proxy', 1);

// Force HTTPS in production so the site is never served over HTTP (avoids "not secure" warning)
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    const proto = req.get('x-forwarded-proto');
    if (proto && proto !== 'https') {
      return res.redirect(301, `https://${req.get('host')}${req.url}`);
    }
    next();
  });
}

// Security headers: HSTS and safe defaults so browsers treat the site as secure
const helmetOptions = process.env.NODE_ENV === 'production'
  ? {
      strictTransportSecurity: {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true,
      },
      contentSecurityPolicy: false, // avoid breaking inline scripts/embeds; enable and tune if needed
    }
  : {};
app.use(helmet(helmetOptions));

// Apply rate limiting to all routes
app.use('/api', apiLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/chat', chatRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);

// Serve embeddable script (served from public folder)
app.get('/chatbot.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
  // The actual script is served from public/chatbot.js via static middleware
  // If file doesn't exist, send a fallback
  res.sendFile('chatbot.js', { root: './public' }, (err) => {
    if (err) {
      logger.warn('Chatbot.js not found in public folder, serving placeholder');
      res.send(`console.log('Chatbot script not found. Please build the embed script first.');`);
    }
  });
});

// Serve React app for all non-API routes (SPA routing)
// This must be AFTER all API routes and BEFORE error handlers
app.get('*', (req, res, next) => {
  // Skip API routes
  if (req.path.startsWith('/api')) {
    return next();
  }
  // Skip health check
  if (req.path === '/health') {
    return next();
  }
  // Skip chatbot.js
  if (req.path === '/chatbot.js') {
    return next();
  }
  
  // Serve React app index.html for all other routes
  const indexPath = path.join(frontendDistPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      // If frontend not built, just continue to 404 handler
      logger.warn('Frontend not found, serving 404');
      next();
    }
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

export default app;
