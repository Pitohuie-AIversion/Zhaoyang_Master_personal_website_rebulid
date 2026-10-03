import React from 'react';
import { useOptimization } from '../../common/GlobalOptimizationManager';

export const GradientText: React.FC<{
  children: React.ReactNode;
  gradient?: string;
  animate?: boolean;
  className?: string;
}> = ({
  children,
  gradient = 'from-blue-600 via-purple-600 to-pink-600',
  animate = false,
  className = ''
}) => {
  const { config } = useOptimization();

  return (
    <span
      className={`bg-gradient-to-r ${gradient} bg-clip-text text-transparent ${
        animate && !config.reducedMotion ? 'animate-gradient-x' : ''
      } ${className}`}
    >
      {children}
    </span>
  );
};
