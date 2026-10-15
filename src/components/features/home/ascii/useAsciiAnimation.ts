import { useState, useEffect, useRef, useCallback } from 'react';
import {
  CharacterState,
  asciiLines,
  themes,
  intensityConfig,
  ZhaoyangASCIIRhythmProps
} from './asciiConstants';

export const useAsciiAnimation = ({
  theme = 'matrix',
  rhythmType = 'heartbeat',
  intensity = 'medium',
  autoPlay = true
}: Pick<ZhaoyangASCIIRhythmProps, 'theme' | 'rhythmType' | 'intensity' | 'autoPlay'>) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [characterStates, setCharacterStates] = useState<CharacterState[][]>([]);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const currentTheme = themes[theme];
  const currentIntensity = intensityConfig[intensity];

  // 初始化字符状态
  const initializeCharacterStates = useCallback(() => {
    const states = asciiLines.map((line, lineIndex) =>
      line.split('').map((char, charIndex) => ({
        char,
        opacity: char === ' ' ? 0 : 0.9,
        scale: 1,
        color: themes[theme].primary,
        glowIntensity: 2,
        animationDelay: (lineIndex * 0.1 + charIndex * 0.01) * 1000
      }))
    );
    setCharacterStates(states);
  }, [theme]);

  // 心跳律动效果
  const applyHeartbeatEffect = useCallback((time: number) => {
    const beatInterval = 1000;
    const beatPhase = (time % beatInterval) / beatInterval;
    const heartbeat = Math.abs(Math.sin(beatPhase * Math.PI * 2)) * currentIntensity.amplitude;

    setCharacterStates(prev =>
      prev.map((line, lineIndex) =>
        line.map((charState, charIndex) => {
          if (charState.char === ' ') return charState;

          const delay = (lineIndex + charIndex) * 0.1;
          const phase = (beatPhase + delay) % 1;
          const currentEffectIntensity = Math.abs(Math.sin(phase * Math.PI)) * heartbeat;

          return {
            ...charState,
            scale: 1 + currentEffectIntensity * 0.3,
            glowIntensity: 1 + currentEffectIntensity,
            opacity: 0.7 + currentEffectIntensity * 0.3
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
          const currentEffectIntensity = ((wave + 1) / 2) * currentIntensity.amplitude;

          return {
            ...charState,
            scale: 1 + currentEffectIntensity * 0.2,
            glowIntensity: 0.5 + currentEffectIntensity,
            color: currentEffectIntensity > 0.7 ? currentTheme.accent : currentTheme.primary
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
          const currentEffectIntensity = pulse * currentIntensity.amplitude;

          return {
            ...charState,
            scale: 1 + currentEffectIntensity * 0.4,
            glowIntensity: 0.3 + currentEffectIntensity * 1.2,
            opacity: 0.6 + currentEffectIntensity * 0.4
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
        applyGlitchEffect();
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

  const togglePlayback = () => {
    setIsPlaying(prev => !prev);
  };

  const resetAnimation = () => {
    startTimeRef.current = 0;
    initializeCharacterStates();
  };

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

  return {
    isPlaying,
    characterStates,
    currentTheme,
    togglePlayback,
    resetAnimation
  };
};
