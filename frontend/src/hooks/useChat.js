// src/hooks/useChat.js
import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api.js';
import { STORAGE_KEYS } from '../utils/constants.js';

export function useChat(website, config) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  // Load session and messages from localStorage
  useEffect(() => {
    const storedSessionId = localStorage.getItem(`${STORAGE_KEYS.SESSION_ID}_${website}`);
    const storedMessages = localStorage.getItem(`${STORAGE_KEYS.MESSAGES}_${website}`);
    
    if (storedSessionId) {
      setSessionId(storedSessionId);
    }
    
    if (storedMessages) {
      try {
        setMessages(JSON.parse(storedMessages));
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    }
  }, [website]);

  // Save messages to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`${STORAGE_KEYS.MESSAGES}_${website}`, JSON.stringify(messages));
    }
  }, [messages, website]);

  const sendMessage = useCallback(async (message) => {
    if (!message.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: message,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await api.post('/chat/', {
        message,
        website,
        sessionId,
      });

      if (response.success) {
        const botMessage = {
          id: Date.now() + 1,
          text: response.reply,
          sender: 'bot',
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, botMessage]);
        
        if (response.sessionId && response.sessionId !== sessionId) {
          setSessionId(response.sessionId);
          localStorage.setItem(`${STORAGE_KEYS.SESSION_ID}_${website}`, response.sessionId);
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      let text = error?.error || config?.offlineMessage || 'Sorry, the server is not available. Please try again in a moment.';
      if (error?.error === 'Client not found or inactive') {
        text = 'This site is not registered for the chatbot. Add it in Admin → Client Management (use this site’s hostname as the website).';
      }
      const errorMessage = {
        id: Date.now() + 1,
        text,
        sender: 'bot',
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  }, [website, sessionId, isLoading, config]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setSessionId(null);
    localStorage.removeItem(`${STORAGE_KEYS.MESSAGES}_${website}`);
    localStorage.removeItem(`${STORAGE_KEYS.SESSION_ID}_${website}`);
  }, [website]);

  return {
    messages,
    sendMessage,
    isLoading,
    isTyping,
    clearMessages,
  };
}
