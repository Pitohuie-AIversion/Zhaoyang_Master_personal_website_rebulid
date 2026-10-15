import React from 'react';
import { useTheme } from '../../common/DarkModeProvider';
import { useAnimatedParticles } from './animated-bg';

const AnimatedBackground: React.FC = () => {
  const { isDark } = useTheme();
  const { canvasRef } = useAnimatedParticles(isDark);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{
        background: isDark
          ? 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)'
          : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
      }}
    />
  );
};

export default AnimatedBackground;
