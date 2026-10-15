import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { AccessibilityConfig, AccessibilityContextType, defaultConfig } from './types';

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

// 可访问性管理器组件
export const AccessibilityManager: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<AccessibilityConfig>(() => {
    // 从localStorage加载配置
    const saved = localStorage.getItem('accessibility-config');
    return saved ? { ...defaultConfig, ...JSON.parse(saved) } : defaultConfig;
  });

  const [isSpeaking, setIsSpeaking] = useState(false);
  const announcementRef = useRef<HTMLDivElement>(null);
  const speechSynthesis = useRef<SpeechSynthesis | null>(null);

  // 初始化语音合成
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      speechSynthesis.current = window.speechSynthesis;
    }
  }, []);

  // 更新配置
  const updateConfig = useCallback((newConfig: Partial<AccessibilityConfig>) => {
    setConfig(prev => {
      const updated = { ...prev, ...newConfig };
      localStorage.setItem('accessibility-config', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // 屏幕阅读器公告
  const announceToScreenReader = useCallback((message: string) => {
    if (announcementRef.current) {
      announcementRef.current.textContent = message;
      // 清空后重新设置，确保屏幕阅读器能够读取
      setTimeout(() => {
        if (announcementRef.current) {
          announcementRef.current.textContent = '';
        }
      }, 1000);
    }
  }, []);

  // 文本转语音
  const speakText = useCallback((text: string) => {
    if (!config.textToSpeech || !speechSynthesis.current) return;

    // 停止当前语音
    speechSynthesis.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechSynthesis.current.speak(utterance);
  }, [config.textToSpeech]);

  // 停止语音
  const stopSpeaking = useCallback(() => {
    if (speechSynthesis.current) {
      speechSynthesis.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  // 应用可访问性样式
  useEffect(() => {
    const root = document.documentElement;

    // 高对比度
    if (config.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // 大字体
    if (config.largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }

    // 减少动画
    if (config.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }

    // 色盲友好
    if (config.colorBlindFriendly) {
      root.classList.add('colorblind-friendly');
    } else {
      root.classList.remove('colorblind-friendly');
    }

    // 焦点可见
    if (config.focusVisible) {
      root.classList.add('focus-visible');
    } else {
      root.classList.remove('focus-visible');
    }
  }, [config]);

  // 键盘导航支持
  useEffect(() => {
    if (!config.keyboardNavigation) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Tab键导航增强
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }

      // Escape键关闭模态框或返回
      if (e.key === 'Escape') {
        const activeElement = document.activeElement as HTMLElement;
        if (activeElement && activeElement.blur) {
          activeElement.blur();
        }
      }

      // 空格键激活按钮
      if (e.key === ' ' && e.target instanceof HTMLElement) {
        const target = e.target;
        if (target.role === 'button' || target.tagName === 'BUTTON') {
          e.preventDefault();
          target.click();
        }
      }
    };

    const handleMouseDown = () => {
      document.body.classList.remove('keyboard-navigation');
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [config.keyboardNavigation]);

  const contextValue: AccessibilityContextType = {
    config,
    updateConfig,
    announceToScreenReader,
    speakText,
    stopSpeaking,
    isSpeaking
  };

  return (
    <AccessibilityContext.Provider value={contextValue}>
      {children}
      {/* 屏幕阅读器公告区域 */}
      <div
        ref={announcementRef}
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />
    </AccessibilityContext.Provider>
  );
};

// 使用可访问性上下文的Hook
// eslint-disable-next-line react-refresh/only-export-components
export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityManager');
  }
  return context;
};
