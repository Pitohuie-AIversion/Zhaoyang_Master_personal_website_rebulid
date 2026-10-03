import React, { useState } from 'react';
import { useOptimization } from '../../common/GlobalOptimizationManager';

export const FlipCard: React.FC<{
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
  className?: string;
  trigger?: 'hover' | 'click';
}> = ({ frontContent, backContent, className = '', trigger = 'hover' }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const { config } = useOptimization();

  const handleInteraction = () => {
    if (config.reducedMotion) return;

    if (trigger === 'click') {
      setIsFlipped(!isFlipped);
    }
  };

  const handleMouseEnter = () => {
    if (trigger === 'hover' && !config.reducedMotion) {
      setIsFlipped(true);
    }
  };

  const handleMouseLeave = () => {
    if (trigger === 'hover' && !config.reducedMotion) {
      setIsFlipped(false);
    }
  };

  return (
    <div
      className={`relative w-full h-full perspective-1000 ${className}`}
      onClick={handleInteraction}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`relative w-full h-full transition-transform duration-600 transform-style-preserve-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* 正面 */}
        <div className="absolute inset-0 w-full h-full backface-hidden">
          {frontContent}
        </div>

        {/* 背面 */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
          {backContent}
        </div>
      </div>
    </div>
  );
};
