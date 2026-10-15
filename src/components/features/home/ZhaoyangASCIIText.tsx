import React from 'react';
import {
  type ZhaoyangASCIITextProps,
  themes,
  sizeConfig,
  asciiLines,
  simpleAsciiLines,
  useAsciiTextAnimation,
} from './ascii-text';

export type { ZhaoyangASCIITextProps };

const ZhaoyangASCIIText: React.FC<ZhaoyangASCIITextProps> = ({
  theme = 'matrix',
  animationType = 'typewriter',
  size = 'medium',
  speed = 100,
  className = '',
}) => {
  const currentTheme = themes[theme];
  const currentSize = sizeConfig[size];
  const lines = currentSize.useSimple ? simpleAsciiLines : asciiLines;

  const {
    displayedText,
    isComplete,
    resetAnimation,
    getWaveDelay,
    getPulseDelay,
  } = useAsciiTextAnimation({ animationType, speed, lines });

  return (
    <div className={`zhaoyang-ascii-container ${className}`}>
      <style>{`
        .zhaoyang-ascii-container {
          font-family: 'Courier New', monospace;
          font-size: ${currentSize.fontSize};
          line-height: ${currentSize.lineHeight};
          color: ${currentTheme.primary};
          text-shadow: 0 0 10px ${currentTheme.glow};
          white-space: pre;
          overflow-x: auto;
          padding: 1rem;
          background: ${currentTheme.background};
          border-radius: 8px;
          backdrop-filter: blur(10px);
        }

        .ascii-line {
          display: block;
          margin: 0;
        }

        .ascii-char {
          display: inline-block;
          transition: all 0.3s ease;
        }

        .wave-char {
          animation: wave-effect 2s ease-in-out infinite;
          animation-delay: var(--wave-delay);
        }

        .pulse-line {
          animation: pulse-effect 2s ease-in-out infinite;
          animation-delay: var(--pulse-delay);
        }

        .glitch-char {
          animation: glitch-effect 0.3s ease-in-out infinite;
        }

        @keyframes wave-effect {
          0%, 100% { transform: translateY(0); opacity: 0.7; }
          50% { transform: translateY(-5px); opacity: 1; color: ${currentTheme.secondary}; }
        }

        @keyframes pulse-effect {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); color: ${currentTheme.secondary}; }
        }

        @keyframes glitch-effect {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-2px); color: ${currentTheme.primary}; }
          40% { transform: translateX(2px); color: ${currentTheme.secondary}; }
          60% { transform: translateX(-1px); color: ${currentTheme.glow}; }
          80% { transform: translateX(1px); color: ${currentTheme.primary}; }
        }

        .typewriter-cursor {
          animation: blink 1s infinite;
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        @media (max-width: 768px) {
          .zhaoyang-ascii-container {
            font-size: 0.4rem;
            line-height: 0.5rem;
            padding: 0.5rem;
          }
        }

        @media (max-width: 480px) {
          .zhaoyang-ascii-container {
            font-size: 0.3rem;
            line-height: 0.4rem;
          }
        }
      `}</style>

      <div className="ascii-art">
        {displayedText.map((line, lineIndex) => (
          <div
            key={lineIndex}
            className={`ascii-line ${
              animationType === 'pulse' ? 'pulse-line' : ''
            }`}
            style={{
              '--pulse-delay': getPulseDelay(lineIndex),
            } as React.CSSProperties}
          >
            {animationType === 'wave' || animationType === 'glitch'
              ? line.split('').map((char, charIndex) => (
                  <span
                    key={charIndex}
                    className={`ascii-char ${
                      animationType === 'wave' ? 'wave-char' : ''
                    } ${
                      animationType === 'glitch' ? 'glitch-char' : ''
                    }`}
                    style={{
                      '--wave-delay': getWaveDelay(lineIndex, charIndex),
                    } as React.CSSProperties}
                  >
                    {char}
                  </span>
                ))
              : line}
          </div>
        ))}

        {animationType === 'typewriter' && !isComplete && (
          <span className="typewriter-cursor">█</span>
        )}
      </div>

      {isComplete && (
        <div className="controls" style={{ marginTop: '1rem', textAlign: 'center' }}>
          <button
            onClick={resetAnimation}
            style={{
              background: currentTheme.primary,
              color: '#000',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: '0.8rem',
            }}
          >
            重播动画
          </button>
        </div>
      )}
    </div>
  );
};

export default ZhaoyangASCIIText;