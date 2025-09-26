import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigationType } from 'react-router-dom';

interface SmartPageTransitionProps {
  children: React.ReactNode;
}

// 路由层级定义
const routeHierarchy = {
  '/': 0,
  '/research': 1,
  '/projects': 2,
  '/publications': 3,
  '/skills': 4,
  '/contact': 5
};

// 智能过渡效果选择
const getSmartTransition = (fromPath: string, toPath: string, navigationType: string) => {
  const fromLevel = routeHierarchy[fromPath as keyof typeof routeHierarchy] ?? 0;
  const toLevel = routeHierarchy[toPath as keyof typeof routeHierarchy] ?? 0;
  
  // 根据导航类型和层级差异选择过渡效果
  if (navigationType === 'POP') {
    // 后退导航
    return {
      initial: { x: -100, opacity: 0, scale: 0.95 },
      animate: { x: 0, opacity: 1, scale: 1 },
      exit: { x: 100, opacity: 0, scale: 1.05 },
      transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
    };
  }
  
  if (fromLevel < toLevel) {
    // 向前导航（深入）
    return {
      initial: { x: 100, opacity: 0, rotateY: -15 },
      animate: { x: 0, opacity: 1, rotateY: 0 },
      exit: { x: -100, opacity: 0, rotateY: 15 },
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    };
  } else if (fromLevel > toLevel) {
    // 向后导航（返回）
    return {
      initial: { x: -100, opacity: 0, rotateY: 15 },
      animate: { x: 0, opacity: 1, rotateY: 0 },
      exit: { x: 100, opacity: 0, rotateY: -15 },
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    };
  } else {
    // 同级导航
    return {
      initial: { y: 20, opacity: 0, scale: 0.98 },
      animate: { y: 0, opacity: 1, scale: 1 },
      exit: { y: -20, opacity: 0, scale: 1.02 },
      transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
    };
  }
};

// 页面预加载指示器
const PagePreloader: React.FC<{ isVisible: boolean }> = ({ isVisible }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// 页面切换背景效果
const TransitionBackground: React.FC<{ pathname: string }> = ({ pathname }) => {
  const getBackgroundGradient = (path: string) => {
    switch (path) {
      case '/':
        return 'from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950';
      case '/research':
        return 'from-green-50 via-emerald-50 to-teal-50 dark:from-green-950 dark:via-emerald-950 dark:to-teal-950';
      case '/projects':
        return 'from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-950 dark:via-amber-950 dark:to-yellow-950';
      case '/publications':
        return 'from-purple-50 via-violet-50 to-fuchsia-50 dark:from-purple-950 dark:via-violet-950 dark:to-fuchsia-950';
      case '/skills':
        return 'from-red-50 via-rose-50 to-pink-50 dark:from-red-950 dark:via-rose-950 dark:to-pink-950';
      case '/contact':
        return 'from-cyan-50 via-sky-50 to-blue-50 dark:from-cyan-950 dark:via-sky-950 dark:to-blue-950';
      default:
        return 'from-gray-50 via-slate-50 to-zinc-50 dark:from-gray-950 dark:via-slate-950 dark:to-zinc-950';
    }
  };

  return (
    <motion.div
      key={pathname}
      className={`fixed inset-0 bg-gradient-to-br ${getBackgroundGradient(pathname)} -z-10`}
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 0.3, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
    />
  );
};

const SmartPageTransition: React.FC<SmartPageTransitionProps> = ({ children }) => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const [previousPath, setPreviousPath] = useState(location.pathname);
  const [isPreloading, setIsPreloading] = useState(false);

  const transitionConfig = getSmartTransition(previousPath, location.pathname, navigationType);

  useEffect(() => {
    if (previousPath !== location.pathname) {
      setIsPreloading(true);
      const timer = setTimeout(() => {
        setIsPreloading(false);
        setPreviousPath(location.pathname);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, previousPath]);

  return (
    <>
      <PagePreloader isVisible={isPreloading} />
      <AnimatePresence mode="wait">
        <TransitionBackground key={`bg-${location.pathname}`} pathname={location.pathname} />
      </AnimatePresence>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          initial={transitionConfig.initial}
          animate={transitionConfig.animate}
          exit={transitionConfig.exit}
          transition={transitionConfig.transition}
          className="w-full min-h-screen"
          style={{
            transformStyle: 'preserve-3d',
            backfaceVisibility: 'hidden'
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default SmartPageTransition;

// 导出页面过渡Hook
export const usePageTransition = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 500);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return {
    isTransitioning,
    currentPath: location.pathname,
    navigationType
  };
};