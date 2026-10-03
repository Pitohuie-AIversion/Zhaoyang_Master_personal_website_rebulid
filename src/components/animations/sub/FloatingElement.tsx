import React from 'react';
import { useOptimization } from '../../common/GlobalOptimizationManager';

export const FloatingElement: React.FC<{
  children: React.ReactNode;
  intensity?: number;
  duration?: number;
  className?: string;
}> = ({ children, intensity = 10, duration = 3, className = '' }) => {
  const { config } = useOptimization();

  if (config.reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      className={`animate-float ${className}`}
      style={{
        '--float-intensity': `${intensity}px`,
        '--float-duration': `${duration}s`,
        animation: `float ${duration}s ease-in-out infinite`
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
};
