import React from 'react';
import { useMatrixRain, type TraeASCIIBackgroundProps } from './matrix-rain';

export type { TraeASCIIBackgroundProps };

const TraeASCIIBackground: React.FC<TraeASCIIBackgroundProps> = ({
  className = '',
  intensity = 'medium',
  theme = 'green',
  speed = 1,
}) => {
  const { canvasRef } = useMatrixRain({ intensity, theme, speed });

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{
        background: 'transparent',
        mixBlendMode: 'screen',
      }}
    />
  );
};

export default TraeASCIIBackground;

// 预设配置组件 - 优化的Matrix风格
export const TraeMatrixBackground: React.FC<Omit<TraeASCIIBackgroundProps, 'theme'>> = (props) => (
  <TraeASCIIBackground {...props} theme="matrix" intensity="high" />
);

export const TraeCyberBackground: React.FC<Omit<TraeASCIIBackgroundProps, 'theme'>> = (props) => (
  <TraeASCIIBackground {...props} theme="blue" intensity="medium" />
);

export const TraeHackerBackground: React.FC<Omit<TraeASCIIBackgroundProps, 'theme'>> = (props) => (
  <TraeASCIIBackground {...props} theme="green" intensity="medium" />
);