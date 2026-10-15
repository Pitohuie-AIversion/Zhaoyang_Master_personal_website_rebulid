import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useOptimization } from '../../common/GlobalOptimizationManager';

export const MagneticButton: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  magnetStrength?: number;
}> = ({ children, className = '', onClick, magnetStrength = 0.3 }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { config } = useOptimization();

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!buttonRef.current || config.reducedMotion) return;

    const button = buttonRef.current;
    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * magnetStrength;
    const deltaY = (e.clientY - centerY) * magnetStrength;

    button.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${isHovered ? 1.05 : 1})`;
  }, [isHovered, magnetStrength, config.reducedMotion]);

  const handleMouseLeave = useCallback(() => {
    if (!buttonRef.current) return;

    buttonRef.current.style.transform = 'translate(0px, 0px) scale(1)';
    setIsHovered(false);
  }, []);

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    // 确保点击事件不被阻止
    e.stopPropagation();
    if (onClick) {
      onClick();
    }
  }, [onClick]);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button || config.reducedMotion) return;

    button.addEventListener('mousemove', handleMouseMove);
    button.addEventListener('mouseleave', handleMouseLeave);
    button.addEventListener('mouseenter', () => setIsHovered(true));

    return () => {
      button.removeEventListener('mousemove', handleMouseMove);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave, config.reducedMotion]);

  return (
    <button
      ref={buttonRef}
      className={`transition-all duration-200 ease-out cursor-pointer relative ${className}`}
      onClick={handleClick}
      style={{ zIndex: 'auto' }}
    >
      {children}
    </button>
  );
};
