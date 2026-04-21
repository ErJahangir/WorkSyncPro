/**
 * WorkSync Pro - Theme Context Provider
 * Manages light/dark mode with persistence
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import {useColorScheme} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {lightTheme, darkTheme, Theme} from './index';

const THEME_KEY = '@worksync_theme';

type ThemeMode = 'light' | 'dark' | 'system';

type ThemeContextType = {
  theme: Theme;
  isDark: boolean;
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  isDark: false,
  themeMode: 'system',
  toggleTheme: () => {},
  setThemeMode: () => {},
});

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then(stored => {
      if (stored) {
        setThemeModeState(stored as ThemeMode);
      }
      setIsLoaded(true);
    });
  }, []);

  const isDark =
    themeMode === 'system'
      ? systemColorScheme === 'dark'
      : themeMode === 'dark';

  const theme = isDark ? darkTheme : lightTheme;

  const toggleTheme = useCallback(() => {
    const next = isDark ? 'light' : 'dark';
    setThemeModeState(next);
    AsyncStorage.setItem(THEME_KEY, next);
  }, [isDark]);

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
    AsyncStorage.setItem(THEME_KEY, mode);
  }, []);

  if (!isLoaded) {
    return null;
  }

  return (
    <ThemeContext.Provider
      value={{theme, isDark, themeMode, toggleTheme, setThemeMode}}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
};
