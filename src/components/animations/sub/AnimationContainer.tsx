import React from 'react';
import { useOptimization } from '../../common/GlobalOptimizationManager';
import { useScrollAnimation } from './useScrollAnimation';

export const AnimationContainer: React.FC<{
  children: React.ReactNode;
  animation?: 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scale' | 'rotate';
  duration?: number;
  delay?: number;
  className?: string;
}> = ({
  children,
  animation = 'fadeIn',
  duration = 0.6,
  delay = 0,
  className = ''
}) => {
  const { ref, hasAnimated } = useScrollAnimation();
  const { config } = useOptimization();

  const getAnimationClass = () => {
    if (config.reducedMotion) return 'opacity-100';

    const baseClass = hasAnimated ? 'animate-in' : 'opacity-0';
    const animationClass = {
      fadeIn: 'fade-in',
      slideUp: 'slide-in-from-bottom-4',
      slideDown: 'slide-in-from-top-4',
      slideLeft: 'slide-in-from-right-4',
      slideRight: 'slide-in-from-left-4',
      scale: 'zoom-in-95',
      rotate: 'spin-in-180'
    }[animation];

    return `${baseClass} ${hasAnimated ? animationClass : ''}`;
  };

  return (
    <div
      ref={ref}
      className={`${getAnimationClass()} ${className}`}
      style={{
        '--animate-duration': `${duration}s`,
        '--animate-delay': `${delay}s`
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
};
