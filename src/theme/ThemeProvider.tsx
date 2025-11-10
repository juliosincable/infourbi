import React, { useState, useEffect, ReactNode, useCallback } from 'react';
import { ThemeContext, Theme } from './ThemeContext';

// Helper to get the media query
const getMediaQuery = () => window.matchMedia('(prefers-color-scheme: dark)');

// Determines the theme based on the system preference
const getSystemTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light'; // Default for SSR
  return getMediaQuery().matches ? 'dark' : 'light';
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(getSystemTheme);

  // Applies the theme class to the document body
  const applyTheme = useCallback((themeToApply: Theme) => {
    document.body.classList.toggle('ion-palette-dark', themeToApply === 'dark');
  }, []);

  useEffect(() => {
    // Apply the initial theme
    applyTheme(theme);

    // Watch for system theme changes
    const mediaQuery = getMediaQuery();
    const handleChange = (e: MediaQueryListEvent) => {
      const newTheme = e.matches ? 'dark' : 'light';
      setTheme(newTheme);
      applyTheme(newTheme);
    };

    // Add listener
    mediaQuery.addEventListener('change', handleChange);

    // Cleanup listener on component unmount
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [applyTheme, theme]);

  return (
    // The `toggleTheme` function is removed as theme is now automatic
    <ThemeContext.Provider value={{ theme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
};

