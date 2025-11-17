import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: ReactNode;
  variant?: 'fade' | 'slide' | 'scale' | 'page';
  duration?: number;
  direction?: number;
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

// 默认页面过渡配置
const defaultTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4
};

// 统一智能页面过渡组件
export const SmartPageTransition: React.FC<PageTransitionProps> = ({ 
  children, 
  variant = 'page',
  duration = 0.4,
  direction = 1
}) => {
  const location = useLocation();
  
  // 根据变体选择动画配置
  const getVariants = () => {
    switch (variant) {
      case 'fade':
        return fadeVariants;
      case 'slide':
        return slideVariants;
      case 'scale':
        return scaleVariants;
      case 'page':
      default:
        return pageVariants;
    }
  };
  
  const getTransition = () => ({
    ...defaultTransition,
    duration
  });

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={getVariants()}
        transition={getTransition()}
        custom={direction}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// 简化版本（用于不需要复杂动画的场景）
export const SimplePageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  return (
    <div className="transition-opacity duration-300 ease-in-out">
      {children}
    </div>
  );
};