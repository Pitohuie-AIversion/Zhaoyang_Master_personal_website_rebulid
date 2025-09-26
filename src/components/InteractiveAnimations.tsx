import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

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
  return (
    <div className={className}>
      {children}
    </div>
  );
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

// 文字打字机效果
export const TypewriterText: React.FC<{
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}> = ({ text, speed = 50, className = '', onComplete }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      
      return () => clearTimeout(timer);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete]);

  return (
    <span className={className}>
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
      >
        |
      </motion.span>
    </span>
  );
};

// 粒子效果背景
export const ParticleBackground: React.FC<{
  particleCount?: number;
  className?: string;
}> = ({ particleCount = 50, className = '' }) => {
  const particles = Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    duration: Math.random() * 20 + 10,
  }));

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute bg-blue-500/20 rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          width: particle.size,
          height: particle.size,
        }}
      />
      ))}
    </div>
  );
};

// 简化的波浪动画组件
export const WaveAnimation: React.FC<{
  className?: string;
  color?: string;
}> = ({ className = '', color = 'currentColor' }) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <svg
        className="absolute bottom-0 left-0 w-full h-full"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
          fill={color}
        />
      </svg>
    </div>
  );
};

// 简化的滚动触发动画Hook
export const useScrollAnimation = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
  return { ref, inView };
};

// 数字计数动画
export const CountUpAnimation: React.FC<{
  end: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}> = ({ end, duration = 2, className = '', prefix = '', suffix = '' }) => {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  useEffect(() => {
    if (inView) {
      let startTime: number;
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
        
        setCount(Math.floor(progress * end));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [inView, end, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}{count}{suffix}
    </span>
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

// 简化的路径绘制
export const PathDrawAnimation: React.FC<{
  path: string;
  className?: string;
  strokeColor?: string;
  strokeWidth?: number;
}> = ({ path, className = '', strokeColor = 'currentColor', strokeWidth = 2 }) => {
  return (
    <svg className={className} viewBox="0 0 100 100">
      <path
        d={path}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
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