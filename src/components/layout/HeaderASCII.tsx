import React from 'react';
import ZhaoyangASCIIRhythm from '../features/home/ZhaoyangASCIIRhythm';
import { useResponsive } from '../common/ResponsiveEnhancements';

interface HeaderASCIIProps {
  className?: string;
}

export default function HeaderASCII({ className = '' }: HeaderASCIIProps) {
  const { isMobile, isTablet } = useResponsive();

  return (
    <div 
      className={`fixed left-0 right-0 z-30 pointer-events-none overflow-hidden ${className}`}
      style={{ 
        top: isMobile ? '56px' : isTablet ? '64px' : '72px',
        height: isMobile ? '40px' : isTablet ? '50px' : '60px'
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className="transform-gpu"
          style={{
            transform: `scale(${isMobile ? 0.15 : isTablet ? 0.25 : 0.35})`,
            transformOrigin: 'center center'
          }}
        >
          <ZhaoyangASCIIRhythm 
            theme="matrix"
            rhythmType="pulse"
            intensity={isMobile ? "low" : "medium"}
            autoPlay={true}
            showControls={false}
            transparent={true}
            className="opacity-25"
          />
        </div>
      </div>
      {/* 优化的渐变遮罩，确保不影响页面内容可读性 */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/60 to-white dark:via-gray-900/60 dark:to-gray-900 opacity-80" />
    </div>
  );
}