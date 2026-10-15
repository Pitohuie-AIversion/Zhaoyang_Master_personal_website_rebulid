import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

// 滚动触发动画Hook
export const useScrollAnimation = (threshold = 0.1) => {
  const { ref, inView } = useInView({ threshold });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (inView && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [inView, hasAnimated]);

  return { ref, inView, hasAnimated };
};
