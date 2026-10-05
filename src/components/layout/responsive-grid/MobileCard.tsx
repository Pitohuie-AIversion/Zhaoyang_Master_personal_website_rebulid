import { ReactNode } from 'react';
import { motion } from 'framer-motion';

export interface MobileOptimizedCardProps {
  children: ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
  onClick?: () => void;
}

const cardPaddingClasses = {
  sm: 'p-3 sm:p-4',
  md: 'p-4 sm:p-6',
  lg: 'p-6 sm:p-8',
};

export function MobileOptimizedCard({
  children,
  className = '',
  padding = 'md',
  hover = true,
  onClick,
}: MobileOptimizedCardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -2 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={`
        bg-white rounded-lg border border-gray-200 
        ${cardPaddingClasses[padding]}
        ${hover ? 'hover:border-gray-300 hover:shadow-sm' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        transition-all duration-200
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
