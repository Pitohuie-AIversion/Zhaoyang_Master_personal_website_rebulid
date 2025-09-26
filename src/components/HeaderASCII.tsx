import React from 'react';
import ZhaoyangASCIIRhythm from './ZhaoyangASCIIRhythm';
import { useResponsive } from './ResponsiveEnhancements';

interface HeaderASCIIProps {
  className?: string;
}

export default function HeaderASCII({ className = '' }: HeaderASCIIProps) {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  return (
    <div 
      className={`fixed top-0 left-0 right-0 z-40 pointer-events-none overflow-hidden ${className}`}
      style={{ height: isMobile ? '60px' : isTablet ? '80px' : '100px' }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className="transform-gpu"
          style={{
            transform: `scale(${isMobile ? 0.25 : isTablet ? 0.4 : 0.5})`,
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
            className="opacity-40"
          />
        </div>
      </div>
      {/* 渐变遮罩，确保不影响导航栏可读性 */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-gray-900 opacity-90" />
    </div>
  );
}