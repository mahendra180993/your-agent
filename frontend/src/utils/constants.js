// src/utils/constants.js
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

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
