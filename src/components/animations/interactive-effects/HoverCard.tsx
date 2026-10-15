import React from 'react';
import { motion } from 'framer-motion';

export interface HoverCardProps {
  children: React.ReactNode;
  className?: string;
  hoverScale?: number;
}

export const HoverCard: React.FC<HoverCardProps> = ({
  children,
  className = '',
  hoverScale = 1.02,
}) => {
  return (
    <motion.div
      className={className}
      whileHover={{
        scale: hoverScale,
        y: -5,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {children}
    </motion.div>
  );
};
