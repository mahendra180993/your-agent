// src/utils/constants.js
// In browser production: use current origin so API always matches the deployed URL (fixes localhost on Render).
// In dev: use backend on localhost:5000. Build-time fallback for SSR: env or relative /api.
function getApiBaseUrl() {
  if (import.meta.env.VITE_API_BASE_URL) return import.meta.env.VITE_API_BASE_URL;
  if (import.meta.env.DEV) return 'http://localhost:5000/api';
  if (typeof window !== 'undefined' && window.location?.origin)
    return `${window.location.origin}/api`;
  return '/api';
}
export const API_BASE_URL = getApiBaseUrl();

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
