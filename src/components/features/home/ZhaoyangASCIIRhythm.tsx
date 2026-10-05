import React from 'react';
import { useTranslation } from '../../common/TranslationProvider';
import {
  ZhaoyangASCIIRhythmProps,
  useAsciiAnimation,
  AsciiControls
} from './ascii';

export type { ZhaoyangASCIIRhythmProps } from './ascii';

const ZhaoyangASCIIRhythm: React.FC<ZhaoyangASCIIRhythmProps> = ({
  theme = 'matrix',
  rhythmType = 'heartbeat',
  intensity = 'medium',
  autoPlay = true,
  showControls = true,
  className = '',
  transparent = false
}) => {
  const { t } = useTranslation();
  const {
    isPlaying,
    characterStates,
    currentTheme,
    togglePlayback,
    resetAnimation
  } = useAsciiAnimation({
    theme,
    rhythmType,
    intensity,
    autoPlay
  });

  return (
    <div className={`zhaoyang-ascii-rhythm ${className}`}>
      <style>{`
        .zhaoyang-ascii-rhythm {
          font-family: 'Courier New', monospace;
          font-size: 0.8rem;
          line-height: 1rem;
          white-space: pre;
          padding: 2rem;
          background: ${transparent ? 'transparent' : currentTheme.background};
          border-radius: ${transparent ? '0' : '12px'};
          backdrop-filter: ${transparent ? 'none' : 'blur(15px)'};
          border: ${transparent ? 'none' : `1px solid ${currentTheme.primary}33`};
          box-shadow: ${transparent ? 'none' : `0 0 30px ${currentTheme.glow}22`};
          overflow-x: auto;
          position: relative;
        }

        .ascii-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 200px;
        }

        .ascii-line {
          display: flex;
          justify-content: center;
        }

        .ascii-char {
          display: inline-block;
          transition: all 0.1s ease-out;
          transform-origin: center;
        }

        .controls {
          position: absolute;
          top: 1rem;
          right: 1rem;
          display: flex;
          gap: 0.5rem;
          z-index: 10;
        }

        .control-btn {
          background: ${currentTheme.primary};
          color: #000;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          font-family: inherit;
          font-size: 0.8rem;
          font-weight: bold;
          transition: all 0.2s ease;
          box-shadow: 0 0 10px ${currentTheme.glow}44;
        }

        .control-btn:hover {
          background: ${currentTheme.accent};
          box-shadow: 0 0 15px ${currentTheme.glow}66;
          transform: translateY(-2px);
        }

        .control-btn:active {
          transform: translateY(0);
        }

        .rhythm-info {
          position: absolute;
          bottom: 1rem;
          left: 1rem;
          font-size: 0.7rem;
          color: ${currentTheme.primary};
          opacity: 0.7;
        }

        @media (max-width: 768px) {
          .zhaoyang-ascii-rhythm {
            font-size: 0.5rem;
            line-height: 0.6rem;
            padding: 1rem;
          }
          
          .controls {
            position: static;
            justify-content: center;
            margin-top: 1rem;
          }
          
          .rhythm-info {
            position: static;
            text-align: center;
            margin-top: 0.5rem;
          }
        }

        @media (max-width: 480px) {
          .zhaoyang-ascii-rhythm {
            font-size: 0.4rem;
            line-height: 0.5rem;
            padding: 0.5rem;
          }
        }
      `}</style>

      <div className="ascii-container">
        {characterStates.map((line, lineIndex) => (
          <div key={lineIndex} className="ascii-line">
            {line.map((charState, charIndex) => (
              <span
                key={charIndex}
                className="ascii-char"
                style={{
                  color: charState.color,
                  opacity: charState.opacity,
                  transform: `scale(${charState.scale})`,
                  textShadow: `
                    0 0 ${charState.glowIntensity * 5}px ${charState.color},
                    0 0 ${charState.glowIntensity * 10}px ${charState.color},
                    0 0 ${charState.glowIntensity * 15}px ${charState.color},
                    0 0 ${charState.glowIntensity * 20}px ${charState.color}
                  `,
                  filter: `brightness(${1 + charState.glowIntensity * 0.5}) contrast(1.2)`
                }}
              >
                {charState.char}
              </span>
            ))}
          </div>
        ))}
      </div>

      {showControls && (
        <AsciiControls
          isPlaying={isPlaying}
          onTogglePlayback={togglePlayback}
          onResetAnimation={resetAnimation}
        />
      )}

      {/* 开发环境下的调试信息 - 生产环境中隐藏 */}
      {process.env.NODE_ENV === 'development' && (
        <div className="rhythm-info">
          {t('ascii.status.theme')}: {theme} | {t('ascii.status.rhythm')}: {rhythmType} | {t('ascii.status.intensity')}: {intensity}
        </div>
      )}
    </div>
  );
};

export default ZhaoyangASCIIRhythm;
