import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from './useTheme';

export interface ThemeTransitionProps {
  children: React.ReactNode;
}

export const ThemeTransition: React.FC<ThemeTransitionProps> = ({ children }) => {
  const { isDark } = useTheme();

  return (
    <motion.div
      key={isDark ? 'dark' : 'light'}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen transition-colors duration-300"
    >
      {children}
    </motion.div>
  );
};
