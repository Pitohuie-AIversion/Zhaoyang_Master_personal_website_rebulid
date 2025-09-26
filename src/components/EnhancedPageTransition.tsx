import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface EnhancedPageTransitionProps {
  children: React.ReactNode;
  transitionType?: 'slide' | 'fade' | 'scale' | 'rotate' | 'flip';
  duration?: number;
  direction?: 'left' | 'right' | 'up' | 'down';
}

const EnhancedPageTransition: React.FC<EnhancedPageTransitionProps> = ({
  children,
  transitionType = 'slide',
  duration = 0.5,
  direction = 'right'
}) => {
  const location = useLocation();

  const getTransitionVariants = () => {
    const slideDistance = 100;
    
    switch (transitionType) {
      case 'slide':
        return {
          initial: {
            x: direction === 'left' ? -slideDistance : direction === 'right' ? slideDistance : 0,
            y: direction === 'up' ? -slideDistance : direction === 'down' ? slideDistance : 0,
            opacity: 0
          },
          animate: {
            x: 0,
            y: 0,
            opacity: 1
          },
          exit: {
            x: direction === 'left' ? slideDistance : direction === 'right' ? -slideDistance : 0,
            y: direction === 'up' ? slideDistance : direction === 'down' ? -slideDistance : 0,
            opacity: 0
          }
        };
      
      case 'fade':
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 }
        };
      
      case 'scale':
        return {
          initial: { scale: 0.8, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 1.1, opacity: 0 }
        };
      
      case 'rotate':
        return {
          initial: { rotateY: -90, opacity: 0 },
          animate: { rotateY: 0, opacity: 1 },
          exit: { rotateY: 90, opacity: 0 }
        };
      
      case 'flip':
        return {
          initial: { rotateX: -90, opacity: 0 },
          animate: { rotateX: 0, opacity: 1 },
          exit: { rotateX: 90, opacity: 0 }
        };
      
      default:
        return {
          initial: { x: slideDistance, opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: -slideDistance, opacity: 0 }
        };
    }
  };

  const variants = getTransitionVariants();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={variants.initial}
        animate={variants.animate}
        exit={variants.exit}
        transition={{
          duration,
          ease: [0.22, 1, 0.36, 1], // Custom easing for smooth animation
          type: 'tween'
        }}
        style={{
          width: '100%',
          height: '100%'
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// 路由特定的过渡效果
export const RouteTransitions = {
  home: { transitionType: 'fade' as const, duration: 0.6 },
  research: { transitionType: 'slide' as const, direction: 'right' as const, duration: 0.5 },
  projects: { transitionType: 'scale' as const, duration: 0.4 },
  publications: { transitionType: 'slide' as const, direction: 'up' as const, duration: 0.5 },
  skills: { transitionType: 'rotate' as const, duration: 0.6 },
  contact: { transitionType: 'flip' as const, duration: 0.5 }
};

// 页面加载进度条组件
export const PageLoadingBar: React.FC = () => {
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600 z-50"
      initial={{ scaleX: 0, transformOrigin: 'left' }}
      animate={{ scaleX: 1 }}
      exit={{ scaleX: 0, transformOrigin: 'right' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    />
  );
};

// 页面切换时的背景动画
export const PageTransitionBackground: React.FC = () => {
  return (
    <motion.div
      className="fixed inset-0 bg-gradient-to-br from-blue-50 to-purple-50 -z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    />
  );
};

export default EnhancedPageTransition;