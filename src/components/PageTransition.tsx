import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
}

// 页面过渡动画变体
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 1.02
  }
};

// 页面过渡动画配置
const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4
};

// 滑动过渡效果
const slideVariants = {
  initial: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0
  }),
  in: {
    x: 0,
    opacity: 1
  },
  out: (direction: number) => ({
    x: direction < 0 ? 1000 : -1000,
    opacity: 0
  })
};

// 淡入淡出过渡效果
const fadeVariants = {
  initial: {
    opacity: 0
  },
  in: {
    opacity: 1
  },
  out: {
    opacity: 0
  }
};

// 缩放过渡效果
const scaleVariants = {
  initial: {
    opacity: 0,
    scale: 0.8
  },
  in: {
    opacity: 1,
    scale: 1
  },
  out: {
    opacity: 0,
    scale: 1.1
  }
};

// 页面过渡组件
const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// 滑动页面过渡组件
export const SlidePageTransition: React.FC<PageTransitionProps & { direction?: number }> = ({ 
  children, 
  direction = 1 
}) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false} custom={direction}>
      <motion.div
        key={location.pathname}
        custom={direction}
        initial="initial"
        animate="in"
        exit="out"
        variants={slideVariants}
        transition={{
          type: 'tween',
          ease: 'easeInOut',
          duration: 0.3
        }}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// 淡入淡出页面过渡组件
export const FadePageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={fadeVariants}
        transition={{
          duration: 0.2
        }}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// 缩放页面过渡组件
export const ScalePageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={scaleVariants}
        transition={{
          type: 'tween',
          ease: 'easeInOut',
          duration: 0.25
        }}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// 路由过渡管理Hook
export const useRouteTransition = () => {
  const location = useLocation();
  const [previousPath, setPreviousPath] = React.useState(location.pathname);
  const [direction, setDirection] = React.useState(1);

  // 定义路由顺序
  const routeOrder = [
    '/',
    '/research',
    '/projects',
    '/publications',
    '/skills',
    '/contact'
  ];

  React.useEffect(() => {
    const currentIndex = routeOrder.indexOf(location.pathname);
    const previousIndex = routeOrder.indexOf(previousPath);
    
    if (currentIndex !== -1 && previousIndex !== -1) {
      setDirection(currentIndex > previousIndex ? 1 : -1);
    }
    
    setPreviousPath(location.pathname);
  }, [location.pathname, previousPath]);

  return { direction, previousPath };
};

export default PageTransition;