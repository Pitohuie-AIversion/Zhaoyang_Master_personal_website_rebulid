import React from 'react';
import { motion } from 'framer-motion';

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
