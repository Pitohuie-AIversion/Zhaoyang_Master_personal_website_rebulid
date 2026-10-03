import { useState, useEffect, useRef, useCallback } from 'react';
import type { ASCIIAnimationType } from './types';

interface UseAsciiTextAnimationOptions {
  animationType?: ASCIIAnimationType;
  speed?: number;
  lines: readonly string[];
}

export const useAsciiTextAnimation = ({
  animationType = 'typewriter',
  speed = 100,
  lines,
}: UseAsciiTextAnimationOptions) => {
  const [displayedText, setDisplayedText] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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
      setDisplayedText([...lines]);
      setIsComplete(true);
    }

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, [currentLine, currentChar, animationType, speed, lines]);

  // 重置动画
  const resetAnimation = useCallback(() => {
    setDisplayedText([]);
    setCurrentLine(0);
    setCurrentChar(0);
    setIsComplete(false);
  }, []);

  // 波浪效果延迟
  const getWaveDelay = useCallback((lineIndex: number, charIndex: number) => {
    if (animationType === 'wave') {
      return (lineIndex * 0.1 + charIndex * 0.02) + 's';
    }
    return '0s';
  }, [animationType]);

  // 脉冲效果延迟
  const getPulseDelay = useCallback((lineIndex: number) => {
    if (animationType === 'pulse') {
      return (lineIndex * 0.2) + 's';
    }
    return '0s';
  }, [animationType]);

  return {
    displayedText,
    isComplete,
    resetAnimation,
    getWaveDelay,
    getPulseDelay,
  };
};
