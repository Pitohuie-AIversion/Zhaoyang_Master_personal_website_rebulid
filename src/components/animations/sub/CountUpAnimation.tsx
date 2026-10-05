import React, { useState, useEffect } from 'react';
import { useOptimization } from '../../common/GlobalOptimizationManager';
import { useScrollAnimation } from './useScrollAnimation';

export const CountUpAnimation: React.FC<{
  end: number;
  start?: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}> = ({
  end,
  start = 0,
  duration = 2000,
  decimals = 0,
  suffix = '',
  prefix = '',
  className = ''
}) => {
  const [count, setCount] = useState(start);
  const { ref, hasAnimated } = useScrollAnimation();
  const { config } = useOptimization();

  useEffect(() => {
    if (!hasAnimated) return;

    if (config.reducedMotion) {
      setCount(end);
      return;
    }

    const startTime = Date.now();
    const startValue = start;
    const endValue = end;

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // 使用easeOutCubic缓动函数
      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
      const easedProgress = easeOutCubic(progress);

      const currentValue = startValue + (endValue - startValue) * easedProgress;
      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [hasAnimated, start, end, duration, config.reducedMotion]);

  return (
    <span ref={ref} className={className}>
      {prefix}{count.toFixed(decimals)}{suffix}
    </span>
  );
};
