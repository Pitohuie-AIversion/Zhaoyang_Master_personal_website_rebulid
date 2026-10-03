import React from 'react';
import { motion } from 'framer-motion';

export interface ResponsiveCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg' | {
    mobile?: string;
    tablet?: string;
    desktop?: string;
  };
  hover?: boolean;
  background?: boolean;
  onClick?: () => void;
}

export const ResponsiveCard: React.FC<ResponsiveCardProps> = ({
  children,
  className = '',
  padding = 'md',
  hover = true,
  background = true,
  onClick
}) => {
  let paddingClasses = '';

  if (typeof padding === 'string') {
    const paddingMap = {
      none: 'p-0',
      sm: 'p-3 sm:p-4',
      md: 'p-4 sm:p-6',
      lg: 'p-6 sm:p-8'
    };
    paddingClasses = paddingMap[padding];
  } else {
    // 自定义响应式padding
    const { mobile = 'p-4', tablet = 'p-6', desktop = 'p-6' } = padding;
    paddingClasses = `${mobile} md:${tablet} lg:${desktop}`;
  }

  const hoverClasses = hover ? 'hover:shadow-lg hover:scale-105' : '';
  const backgroundClasses = background ? 'bg-white dark:bg-gray-800' : '';

  return (
    <motion.div
      whileHover={hover ? { y: -2 } : {}}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      className={`
        ${backgroundClasses}
        rounded-lg shadow-md 
        transition-all duration-300 
        ${paddingClasses} 
        ${hoverClasses} 
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};
