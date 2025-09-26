import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

interface AnimatedLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  preloadDelay?: number;
}

// 简化的链接组件
export const AnimatedLink: React.FC<AnimatedLinkProps> = ({ 
  to, 
  children, 
  className = '' 
}) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`${className} relative block transition-colors duration-200 ${isActive ? 'text-blue-600 dark:text-blue-400' : ''}`}
    >
      {children}
      
      {/* 活跃状态指示器 */}
      {isActive && (
        <motion.div
          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-500 rounded-full"
          layoutId="activeIndicator"
          initial={false}
        />
      )}
    </Link>
  );
};

// 移除复杂的粒子效果以提升性能

// 简化的滚动进度指示器
export const ScrollProgressIndicator: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const progress = scrollHeight > 0 ? scrolled / scrollHeight : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', updateScrollProgress);
    updateScrollProgress();

    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 h-1 bg-blue-500 z-50 origin-left transition-transform duration-100"
      style={{ transform: `scaleX(${scrollProgress})` }}
    />
  );
};

// 页面加载时的文字动画
export const AnimatedPageTitle: React.FC<{ title: string; subtitle?: string }> = ({ 
  title, 
  subtitle 
}) => {
  const titleChars = title.split('');
  
  return (
    <div className="text-center mb-8">
      <motion.h1 
        className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4"
        initial="hidden"
        animate="visible"
      >
        {titleChars.map((char, index) => (
          <motion.span
            key={index}
            variants={{
              hidden: { opacity: 0, y: 50, rotateX: -90 },
              visible: { 
                opacity: 1, 
                y: 0, 
                rotateX: 0,
                transition: {
                  delay: index * 0.05,
                  duration: 0.5,
                  type: 'spring',
                  stiffness: 100
                }
              }
            }}
            style={{ display: 'inline-block', transformOrigin: 'center bottom' }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </motion.h1>
      
      {subtitle && (
        <motion.p
          className="text-lg text-gray-600 dark:text-gray-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: title.length * 0.05 + 0.2, duration: 0.6 }}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
};

// 鼠标跟随光标效果
export const MouseFollowCursor: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    document.addEventListener('mousemove', updateMousePosition);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <motion.div
      className="fixed pointer-events-none z-50 mix-blend-difference"
      animate={{
        x: mousePosition.x - 10,
        y: mousePosition.y - 10,
        opacity: isVisible ? 1 : 0
      }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 28,
        mass: 0.5
      }}
    >
      <div className="w-5 h-5 bg-white rounded-full" />
    </motion.div>
  );
};

// 页面切换时的涟漪效果
export const RippleEffect: React.FC<{ trigger: boolean; origin?: { x: number; y: number } }> = ({ 
  trigger, 
  origin = { x: 50, y: 50 } 
}) => {
  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-40"
      initial={false}
      animate={trigger ? 'animate' : 'initial'}
    >
      <motion.div
        className="absolute w-4 h-4 bg-blue-500/20 rounded-full"
        style={{
          left: `${origin.x}%`,
          top: `${origin.y}%`,
          transform: 'translate(-50%, -50%)'
        }}
        variants={{
          initial: { scale: 0, opacity: 0 },
          animate: {
            scale: [0, 50, 100],
            opacity: [0.8, 0.4, 0],
            transition: {
              duration: 1.2,
              ease: 'easeOut'
            }
          }
        }}
      />
    </motion.div>
  );
};