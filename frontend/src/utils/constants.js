// src/utils/constants.js
// In production (or when served from same host), use relative /api so no env var needed on Render.
// In dev, use backend on localhost.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api');

export const STORAGE_KEYS = {
  SESSION_ID: 'chatbot_session_id',
  MESSAGES: 'chatbot_messages',
  THEME: 'chatbot_theme',
  WEBSITE: 'chatbot_website',
};

export const DEFAULT_CONFIG = {
  welcomeMessage: 'Hello! How can I help you today?',
  autoGreetDelay: 5000,
  offlineMessage: 'Sorry, I\'m currently offline. Please try again later.',
  primaryColor: '#007bff',
  position: 'bottom-right',
};
