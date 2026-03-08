// src/hooks/useTheme.js
import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage.js';
import { STORAGE_KEYS } from '../utils/constants.js';

export function useTheme() {
  const [theme, setTheme] = useLocalStorage(STORAGE_KEYS.THEME, 'light');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return [theme, toggleTheme];
}
