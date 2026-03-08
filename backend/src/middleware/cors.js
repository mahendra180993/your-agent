// src/middleware/cors.js
import cors from 'cors';

const defaultOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://your-agent-5ti9.onrender.com',
];
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : defaultOrigins;

export const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g. same-origin, mobile apps, curl)
    if (!origin) return callback(null, true);
    // In production, allow any origin so the app works on Render and embed works on client sites
    if (process.env.NODE_ENV === 'production') return callback(null, true);
    // In development, only allow known dev origins
    if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

export default cors(corsOptions);
