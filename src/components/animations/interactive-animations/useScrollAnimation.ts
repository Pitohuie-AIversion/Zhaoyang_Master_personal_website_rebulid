import { useInView } from 'react-intersection-observer';

// 简化的滚动触发动画Hook
export const useScrollAnimation = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  return { ref, inView };
};
