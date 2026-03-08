// src/utils/api.js
import axios from 'axios';
import { API_BASE_URL } from './constants.js';

// 60s timeout so Render cold start (~30s) can complete before we give up
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      return Promise.reject(error.response.data);
    }
    // No response: timeout, cold start, or unreachable server
    const isTimeout = error.code === 'ECONNABORTED' || error.message?.includes('timeout');
    const message = isTimeout
      ? 'Request timed out. The server may be waking up—please try again in a moment.'
      : 'Network error. Check your connection or try again in a moment.';
    return Promise.reject({ error: message });
  }
);

export default api;
