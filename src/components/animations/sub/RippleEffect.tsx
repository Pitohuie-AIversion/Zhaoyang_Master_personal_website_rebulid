import React, { useState, useCallback } from 'react';
import { useOptimization } from '../../common/GlobalOptimizationManager';

export const RippleEffect: React.FC<{
  children: React.ReactNode;
  className?: string;
  color?: string;
}> = ({ children, className = '', color = 'rgba(255, 255, 255, 0.6)' }) => {
  const [ripples, setRipples] = useState<Array<{
    x: number;
    y: number;
    size: number;
    id: number;
  }>>([]);
  const { config } = useOptimization();

  const createRipple = useCallback((e: React.MouseEvent) => {
    if (config.reducedMotion) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const newRipple = {
      x,
      y,
      size,
      id: Date.now()
    };

    setRipples(prev => [...prev, newRipple]);

    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);
  }, [config.reducedMotion]);

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onMouseDown={createRipple}
    >
      {children}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute rounded-full pointer-events-none animate-ping"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            backgroundColor: color,
            animationDuration: '600ms'
          }}
        />
      ))}
    </div>
  );
};
