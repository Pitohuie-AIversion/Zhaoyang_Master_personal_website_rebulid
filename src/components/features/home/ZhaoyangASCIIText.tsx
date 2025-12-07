import React, { useState, useEffect, useRef } from 'react';

interface ZhaoyangASCIITextProps {
  theme?: 'matrix' | 'cyber' | 'neon';
  animationType?: 'typewriter' | 'wave' | 'pulse' | 'glitch';
  size?: 'small' | 'medium' | 'large';
  speed?: number;
  className?: string;
}

const ZhaoyangASCIIText: React.FC<ZhaoyangASCIITextProps> = ({
  theme = 'matrix',
  animationType = 'typewriter',
  size = 'medium',
  speed = 100,
  className = ''
}) => {
  const [displayedText, setDisplayedText] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // ZHAOYANG ASCII 艺术字
  const asciiLines = [
    '███████╗██╗  ██╗ █████╗  ██████╗ ██╗   ██╗ █████╗ ███╗   ██╗ ██████╗ ',
    '╚══███╔╝██║  ██║██╔══██╗██╔═══██╗╚██╗ ██╔╝██╔══██╗████╗  ██║██╔════╝ ',
    '  ███╔╝ ███████║███████║██║   ██║ ╚████╔╝ ███████║██╔██╗ ██║██║  ███╗',
    ' ███╔╝  ██╔══██║██╔══██║██║   ██║  ╚██╔╝  ██╔══██║██║╚██╗██║██║   ██║',
    '███████╗██║  ██║██║  ██║╚██████╔╝   ██║   ██║  ██║██║ ╚████║╚██████╔╝',
    '╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝    ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝ '
  ];

  // 简化版 ASCII 字符（用于小屏幕）
  const simpleAsciiLines = [
    '███████ ██   ██  █████   ██████  ██    ██  █████  ███    ██  ██████ ',
    '     ██ ██   ██ ██   ██ ██    ██  ██  ██  ██   ██ ████   ██ ██      ',
    '  ████  ███████ ███████ ██    ██   ████   ███████ ██ ██  ██ ██   ███',
    ' ██     ██   ██ ██   ██ ██    ██    ██    ██   ██ ██  ██ ██ ██    ██',
    '███████ ██   ██ ██   ██  ██████     ██    ██   ██ ██   ████  ██████ '
  ];

  // 主题配色
  const themes = {
    matrix: {
      primary: '#00ff41',
      secondary: '#008f11',
      glow: '#00ff41',
      background: 'rgba(0, 0, 0, 0.8)'
    },
    cyber: {
      primary: '#00d4ff',
      secondary: '#0099cc',
      glow: '#00d4ff',
      background: 'rgba(0, 20, 40, 0.8)'
    },
    neon: {
      primary: '#ff00ff',
      secondary: '#cc00cc',
      glow: '#ff00ff',
      background: 'rgba(20, 0, 20, 0.8)'
    }
  };

  // 尺寸配置
  const sizeConfig = {
    small: {
      fontSize: '0.5rem',
      lineHeight: '0.6rem',
      useSimple: true
    },
    medium: {
      fontSize: '0.8rem',
      lineHeight: '1rem',
      useSimple: false
    },
    large: {
      fontSize: '1.2rem',
      lineHeight: '1.4rem',
      useSimple: false
    }
  };

  const currentTheme = themes[theme];
  const currentSize = sizeConfig[size];
  const lines = currentSize.useSimple ? simpleAsciiLines : asciiLines;

  // 打字机效果
  useEffect(() => {
    if (animationType === 'typewriter') {
      if (currentLine < lines.length) {
        if (currentChar < lines[currentLine].length) {
          intervalRef.current = setTimeout(() => {
            setDisplayedText(prev => {
              const newText = [...prev];
              if (!newText[currentLine]) newText[currentLine] = '';
              newText[currentLine] += lines[currentLine][currentChar];
              return newText;
            });
            setCurrentChar(prev => prev + 1);
          }, speed);
        } else {
          setCurrentLine(prev => prev + 1);
          setCurrentChar(0);
        }
      } else {
        setIsComplete(true);
      }
    } else {
      // 其他动画类型直接显示完整文本
      setDisplayedText(lines);
      setIsComplete(true);
    }

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, [currentLine, currentChar, animationType, speed, lines]);

  // 重置动画
  const resetAnimation = () => {
    setDisplayedText([]);
    setCurrentLine(0);
    setCurrentChar(0);
    setIsComplete(false);
  };

  // 波浪效果
  const getWaveDelay = (lineIndex: number, charIndex: number) => {
    if (animationType === 'wave') {
      return (lineIndex * 0.1 + charIndex * 0.02) + 's';
    }
    return '0s';
  };

  // 脉冲效果
  const getPulseDelay = (lineIndex: number) => {
    if (animationType === 'pulse') {
      return (lineIndex * 0.2) + 's';
    }
    return '0s';
  };

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
              '--pulse-delay': getPulseDelay(lineIndex)
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
                      '--wave-delay': getWaveDelay(lineIndex, charIndex)
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
              fontSize: '0.8rem'
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
export type { ZhaoyangASCIITextProps };