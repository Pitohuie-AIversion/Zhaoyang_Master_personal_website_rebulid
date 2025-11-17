import React, { useState, useEffect, useRef, useCallback } from 'react';

interface ZhaoyangASCIIRhythmProps {
  theme?: 'matrix' | 'cyber' | 'neon' | 'rainbow';
  rhythmType?: 'heartbeat' | 'wave' | 'pulse' | 'glitch' | 'typewriter' | 'matrix-rain';
  intensity?: 'low' | 'medium' | 'high';
  autoPlay?: boolean;
  showControls?: boolean;
  className?: string;
  transparent?: boolean;
}

interface CharacterState {
  char: string;
  opacity: number;
  scale: number;
  color: string;
  glowIntensity: number;
  animationDelay: number;
}

const ZhaoyangASCIIRhythm: React.FC<ZhaoyangASCIIRhythmProps> = ({
  theme = 'matrix',
  rhythmType = 'heartbeat',
  intensity = 'medium',
  autoPlay = true,
  showControls = true,
  className = '',
  transparent = false
}) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [characterStates, setCharacterStates] = useState<CharacterState[][]>([]);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  // ZHAOYANG ASCII 艺术字（优化版）
  const asciiLines = [
    '███████╗██╗  ██╗ █████╗  ██████╗ ██╗   ██╗ █████╗ ███╗   ██╗ ██████╗ ',
    '╚══███╔╝██║  ██║██╔══██╗██╔═══██╗╚██╗ ██╔╝██╔══██╗████╗  ██║██╔════╝ ',
    '  ███╔╝ ███████║███████║██║   ██║ ╚████╔╝ ███████║██╔██╗ ██║██║  ███╗',
    ' ███╔╝  ██╔══██║██╔══██║██║   ██║  ╚██╔╝  ██╔══██║██║╚██╗██║██║   ██║',
    '███████╗██║  ██║██║  ██║╚██████╔╝   ██║   ██║  ██║██║ ╚████║╚██████╔╝',
    '╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝    ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝ '
  ];

  // 主题配色系统
  const themes = {
    matrix: {
      primary: '#00ff41',
      secondary: '#008f11',
      accent: '#00cc33',
      glow: '#00ff41',
      background: 'rgba(0, 0, 0, 0.9)'
    },
    cyber: {
      primary: '#00d4ff',
      secondary: '#0099cc',
      accent: '#66e6ff',
      glow: '#00d4ff',
      background: 'rgba(0, 20, 40, 0.9)'
    },
    neon: {
      primary: '#ff00ff',
      secondary: '#cc00cc',
      accent: '#ff66ff',
      glow: '#ff00ff',
      background: 'rgba(20, 0, 20, 0.9)'
    },
    rainbow: {
      primary: '#ff0080',
      secondary: '#8000ff',
      accent: '#00ff80',
      glow: '#ff0080',
      background: 'rgba(10, 10, 30, 0.9)'
    }
  };

  // 强度配置
  const intensityConfig = {
    low: {
      speed: 0.5,
      amplitude: 0.3,
      glowRange: [0.5, 1],
      scaleRange: [0.9, 1.1]
    },
    medium: {
      speed: 1,
      amplitude: 0.6,
      glowRange: [0.3, 1.2],
      scaleRange: [0.8, 1.3]
    },
    high: {
      speed: 1.5,
      amplitude: 1,
      glowRange: [0.1, 1.5],
      scaleRange: [0.7, 1.5]
    }
  };

  const currentTheme = themes[theme];
  const currentIntensity = intensityConfig[intensity];

  // 初始化字符状态
  const initializeCharacterStates = useCallback(() => {
    const states = asciiLines.map((line, lineIndex) =>
      line.split('').map((char, charIndex) => ({
        char,
        opacity: char === ' ' ? 0 : 0.9,
        scale: 1,
        color: currentTheme.primary,
        glowIntensity: 2,
        animationDelay: (lineIndex * 0.1 + charIndex * 0.01) * 1000
      }))
    );
    setCharacterStates(states);
  }, [currentTheme.primary, asciiLines]);

  // 心跳律动效果
  const applyHeartbeatEffect = useCallback((time: number) => {
    const beatInterval = 1000; // 1秒一次心跳
    const beatPhase = (time % beatInterval) / beatInterval;
    const heartbeat = Math.abs(Math.sin(beatPhase * Math.PI * 2)) * currentIntensity.amplitude;
    
    setCharacterStates(prev => 
      prev.map((line, lineIndex) =>
        line.map((charState, charIndex) => {
          if (charState.char === ' ') return charState;
          
          const delay = (lineIndex + charIndex) * 0.1;
          const phase = (beatPhase + delay) % 1;
          const intensity = Math.abs(Math.sin(phase * Math.PI)) * heartbeat;
          
          return {
            ...charState,
            scale: 1 + intensity * 0.3,
            glowIntensity: 1 + intensity,
            opacity: 0.7 + intensity * 0.3
          };
        })
      )
    );
  }, [currentIntensity.amplitude]);

  // 波浪律动效果
  const applyWaveEffect = useCallback((time: number) => {
    const waveSpeed = currentIntensity.speed * 0.003;
    
    setCharacterStates(prev => 
      prev.map((line, lineIndex) =>
        line.map((charState, charIndex) => {
          if (charState.char === ' ') return charState;
          
          const wave = Math.sin(time * waveSpeed + lineIndex * 0.5 + charIndex * 0.1);
          const intensity = (wave + 1) / 2 * currentIntensity.amplitude;
          
          return {
            ...charState,
            scale: 1 + intensity * 0.2,
            glowIntensity: 0.5 + intensity,
            color: intensity > 0.7 ? currentTheme.accent : currentTheme.primary
          };
        })
      )
    );
  }, [currentIntensity.speed, currentIntensity.amplitude, currentTheme.accent, currentTheme.primary]);

  // 脉冲律动效果
  const applyPulseEffect = useCallback((time: number) => {
    const pulseSpeed = currentIntensity.speed * 0.002;
    
    setCharacterStates(prev => 
      prev.map((line, lineIndex) =>
        line.map((charState) => {
          if (charState.char === ' ') return charState;
          
          const pulse = Math.abs(Math.sin(time * pulseSpeed + lineIndex * 0.3));
          const intensity = pulse * currentIntensity.amplitude;
          
          return {
            ...charState,
            scale: 1 + intensity * 0.4,
            glowIntensity: 0.3 + intensity * 1.2,
            opacity: 0.6 + intensity * 0.4
          };
        })
      )
    );
  }, [currentIntensity.speed, currentIntensity.amplitude]);

  // 故障律动效果
  const applyGlitchEffect = useCallback(() => {
    const glitchChance = 0.05 * currentIntensity.amplitude;
    
    setCharacterStates(prev => 
      prev.map((line) =>
        line.map((charState) => {
          if (charState.char === ' ') return charState;
          
          const shouldGlitch = Math.random() < glitchChance;
          
          if (shouldGlitch) {
            return {
              ...charState,
              scale: 1 + (Math.random() - 0.5) * 0.6,
              color: Math.random() > 0.5 ? currentTheme.secondary : currentTheme.accent,
              glowIntensity: Math.random() * 2,
              opacity: 0.5 + Math.random() * 0.5
            };
          }
          
          return {
            ...charState,
            scale: 1,
            color: currentTheme.primary,
            glowIntensity: 1,
            opacity: 1
          };
        })
      )
    );
  }, [currentIntensity.amplitude, currentTheme.secondary, currentTheme.accent, currentTheme.primary]);

  // 彩虹律动效果（仅限rainbow主题）
  const applyRainbowEffect = useCallback((time: number) => {
    if (theme !== 'rainbow') return;
    
    const rainbowSpeed = currentIntensity.speed * 0.001;
    
    setCharacterStates(prev => 
      prev.map((line, lineIndex) =>
        line.map((charState, charIndex) => {
          if (charState.char === ' ') return charState;
          
          const hue = (time * rainbowSpeed + lineIndex * 30 + charIndex * 10) % 360;
          const saturation = 80 + Math.sin(time * 0.002) * 20;
          const lightness = 50 + Math.sin(time * 0.003 + charIndex * 0.1) * 20;
          
          return {
            ...charState,
            color: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
            glowIntensity: 1 + Math.sin(time * 0.002 + charIndex * 0.1) * 0.5,
            scale: 1 + Math.sin(time * 0.001 + lineIndex * 0.2) * 0.1
          };
        })
      )
    );
  }, [theme, currentIntensity.speed]);

  // 动画循环
  const animate = useCallback((timestamp: number) => {
    if (!startTimeRef.current) startTimeRef.current = timestamp;
    const elapsed = timestamp - startTimeRef.current;
    
    // setCurrentFrame(elapsed); // This function doesn't exist, so we'll remove it
    
    switch (rhythmType) {
      case 'heartbeat':
        applyHeartbeatEffect(elapsed);
        break;
      case 'wave':
        applyWaveEffect(elapsed);
        break;
      case 'pulse':
        applyPulseEffect(elapsed);
        break;
      case 'glitch':
        applyGlitchEffect(); // Remove the elapsed parameter
        break;
      default:
        break;
    }
    
    if (theme === 'rainbow') {
      applyRainbowEffect(elapsed);
    }
    
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [rhythmType, theme, isPlaying, applyHeartbeatEffect, applyWaveEffect, applyPulseEffect, applyGlitchEffect, applyRainbowEffect]);

  // 控制播放/暂停
  const togglePlayback = () => {
    setIsPlaying(prev => !prev);
  };

  // 重置动画
  const resetAnimation = () => {
    startTimeRef.current = 0;
    // setCurrentFrame(0); // This function doesn't exist, so we'll remove it
    initializeCharacterStates();
  };

  // 初始化和清理
  useEffect(() => {
    initializeCharacterStates();
  }, [initializeCharacterStates]);

  useEffect(() => {
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, animate]);

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
        <div className="controls">
          <button className="control-btn" onClick={togglePlayback}>
            {isPlaying ? '⏸️ 暂停' : '▶️ 播放'}
          </button>
          <button className="control-btn" onClick={resetAnimation}>
            🔄 重置
          </button>
        </div>
      )}

      {/* 开发环境下的调试信息 - 生产环境中隐藏 */}
      {process.env.NODE_ENV === 'development' && (
        <div className="rhythm-info">
          主题: {theme} | 律动: {rhythmType} | 强度: {intensity}
        </div>
      )}
    </div>
  );
};

export default ZhaoyangASCIIRhythm;
export type { ZhaoyangASCIIRhythmProps };