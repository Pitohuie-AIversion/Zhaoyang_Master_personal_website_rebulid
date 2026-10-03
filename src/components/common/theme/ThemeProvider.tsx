import React, { useEffect, useState, useCallback } from 'react';
import { ThemeContext, type ThemeMode } from './themeContextDef';

export interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [isDark, setIsDark] = useState(false);

  // 检测系统主题偏好
  const getSystemTheme = () => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  // 应用主题
  const applyTheme = useCallback((newTheme: ThemeMode) => {
    let shouldBeDark = false;

    if (newTheme === 'dark') {
      shouldBeDark = true;
    } else if (newTheme === 'light') {
      shouldBeDark = false;
    } else {
      shouldBeDark = getSystemTheme();
    }

    setIsDark(shouldBeDark);

    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // 初始化主题
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeMode | null;
    const initialTheme = savedTheme || 'dark';
    setTheme(initialTheme);
    applyTheme(initialTheme);

    // 监听系统主题变化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, applyTheme]);

  const handleSetTheme = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    handleSetTheme(newTheme);
  };

  const value = {
    isDark,
    toggleTheme,
    theme,
    setTheme: handleSetTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
