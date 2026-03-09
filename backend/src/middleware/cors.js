// src/middleware/cors.js
import cors from 'cors';

export const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g. same-origin, mobile apps, curl)
    if (!origin) return callback(null, true);
    // Allow all origins so the chatbot can be embedded on any client site.
    // If you ever need to restrict, reintroduce an ALLOWED_ORIGINS check here.
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

export default cors(corsOptions);
