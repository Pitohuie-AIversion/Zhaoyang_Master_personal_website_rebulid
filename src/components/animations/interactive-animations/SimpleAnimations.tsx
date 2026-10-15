import React from 'react';
import { motion } from 'framer-motion';

// 简化的按钮组件
export const MagneticButton: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}> = ({ children, className = '', onClick }) => {
  return (
    <button
      className={`${className} transition-transform duration-200 hover:scale-105 active:scale-95`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

// 移除复杂的视差滚动以提升性能
export const ParallaxElement: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return <div className={className}>{children}</div>;
};

// 简化的卡片组件
export const FloatingCard: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div className={`${className} transition-transform duration-200 hover:scale-105`}>
      {children}
    </div>
  );
};

// 简化的悬停发光效果
export const GlowEffect: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div
      className={`relative transition-shadow duration-300 hover:shadow-lg hover:shadow-blue-500/20 ${className}`}
    >
      {children}
    </div>
  );
};

// 弹性按钮组件
export const ElasticButton: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}> = ({ children, className = '', onClick }) => {
  return (
    <motion.button
      className={className}
      onClick={onClick}
      whileHover={{
        scale: 1.05,
        transition: { type: 'spring', stiffness: 400, damping: 10 },
      }}
      whileTap={{
        scale: 0.95,
        transition: { type: 'spring', stiffness: 400, damping: 10 },
      }}
      initial={{ scale: 1 }}
    >
      {children}
    </motion.button>
  );
};
