// src/utils/constants.js
// API URL: use current page origin in browser so it always matches deployed URL (fixes Render/localhost).
// Only use localhost:5000 when the app is clearly running locally (localhost / 127.0.0.1).
function getApiBaseUrl() {
  if (import.meta.env.VITE_API_BASE_URL) return import.meta.env.VITE_API_BASE_URL;
  if (typeof window !== 'undefined' && window.location?.origin) {
    const origin = window.location.origin;
    const isLocalHost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin);
    return isLocalHost ? 'http://localhost:5000/api' : `${origin}/api`;
  }
  return import.meta.env.DEV ? 'http://localhost:5000/api' : '/api';
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
