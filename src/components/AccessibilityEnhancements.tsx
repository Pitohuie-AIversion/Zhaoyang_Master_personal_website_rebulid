import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { Eye, EyeOff, Type, Contrast, Volume2, VolumeX, Keyboard, Mouse } from 'lucide-react';
import { UnifiedButton } from './UnifiedButton';

// 可访问性配置接口
interface AccessibilityConfig {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  focusVisible: boolean;
  colorBlindFriendly: boolean;
  textToSpeech: boolean;
}

// 可访问性上下文
interface AccessibilityContextType {
  config: AccessibilityConfig;
  updateConfig: (newConfig: Partial<AccessibilityConfig>) => void;
  announceToScreenReader: (message: string) => void;
  speakText: (text: string) => void;
  stopSpeaking: () => void;
  isSpeaking: boolean;
}

const defaultConfig: AccessibilityConfig = {
  highContrast: false,
  largeText: false,
  reducedMotion: false,
  screenReader: false,
  keyboardNavigation: true,
  focusVisible: true,
  colorBlindFriendly: false,
  textToSpeech: false
};

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
export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityManager');
  }
  return context;
};

// 可访问性工具栏组件
export const AccessibilityToolbar: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { config, updateConfig, speakText, stopSpeaking, isSpeaking } = useAccessibility();
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleOption = (option: keyof AccessibilityConfig) => {
    const newValue = !config[option];
    updateConfig({ [option]: newValue });
    
    // 语音反馈
    if (config.textToSpeech) {
      const optionNames: Record<keyof AccessibilityConfig, string> = {
        highContrast: '高对比度',
        largeText: '大字体',
        reducedMotion: '减少动画',
        screenReader: '屏幕阅读器',
        keyboardNavigation: '键盘导航',
        focusVisible: '焦点可见',
        colorBlindFriendly: '色盲友好',
        textToSpeech: '文本转语音'
      };
      
      speakText(`${optionNames[option]}已${newValue ? '开启' : '关闭'}`);
    }
  };
  
  return (
    <div className={`fixed top-4 left-4 z-50 ${className}`}>
      <UnifiedButton
        variant="primary"
        size="md"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="打开可访问性工具栏"
        title="可访问性设置"
        className="rounded-full shadow-lg"
      >
        <Eye className="w-5 h-5" />
      </UnifiedButton>
      
      {isOpen && (
        <div className="absolute top-16 left-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-xl min-w-80">
          <h3 className="font-semibold mb-4 text-gray-900 dark:text-gray-100 flex items-center">
            <Eye className="w-4 h-4 mr-2" />
            可访问性设置
          </h3>
          
          <div className="space-y-3">
            {/* 高对比度 */}
            <label className="flex items-center justify-between cursor-pointer">
              <span className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                <Contrast className="w-4 h-4 mr-2" />
                高对比度模式
              </span>
              <input
                type="checkbox"
                checked={config.highContrast}
                onChange={() => toggleOption('highContrast')}
                className="sr-only"
              />
              <div className={`w-10 h-6 rounded-full transition-colors ${
                config.highContrast ? 'bg-blue-600' : 'bg-gray-300'
              }`}>
                <div className={`w-4 h-4 bg-white rounded-full mt-1 transition-transform ${
                  config.highContrast ? 'translate-x-5' : 'translate-x-1'
                }`} />
              </div>
            </label>
            
            {/* 大字体 */}
            <label className="flex items-center justify-between cursor-pointer">
              <span className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                <Type className="w-4 h-4 mr-2" />
                大字体模式
              </span>
              <input
                type="checkbox"
                checked={config.largeText}
                onChange={() => toggleOption('largeText')}
                className="sr-only"
              />
              <div className={`w-10 h-6 rounded-full transition-colors ${
                config.largeText ? 'bg-blue-600' : 'bg-gray-300'
              }`}>
                <div className={`w-4 h-4 bg-white rounded-full mt-1 transition-transform ${
                  config.largeText ? 'translate-x-5' : 'translate-x-1'
                }`} />
              </div>
            </label>
            
            {/* 减少动画 */}
            <label className="flex items-center justify-between cursor-pointer">
              <span className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                <Mouse className="w-4 h-4 mr-2" />
                减少动画效果
              </span>
              <input
                type="checkbox"
                checked={config.reducedMotion}
                onChange={() => toggleOption('reducedMotion')}
                className="sr-only"
              />
              <div className={`w-10 h-6 rounded-full transition-colors ${
                config.reducedMotion ? 'bg-blue-600' : 'bg-gray-300'
              }`}>
                <div className={`w-4 h-4 bg-white rounded-full mt-1 transition-transform ${
                  config.reducedMotion ? 'translate-x-5' : 'translate-x-1'
                }`} />
              </div>
            </label>
            
            {/* 键盘导航 */}
            <label className="flex items-center justify-between cursor-pointer">
              <span className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                <Keyboard className="w-4 h-4 mr-2" />
                键盘导航增强
              </span>
              <input
                type="checkbox"
                checked={config.keyboardNavigation}
                onChange={() => toggleOption('keyboardNavigation')}
                className="sr-only"
              />
              <div className={`w-10 h-6 rounded-full transition-colors ${
                config.keyboardNavigation ? 'bg-blue-600' : 'bg-gray-300'
              }`}>
                <div className={`w-4 h-4 bg-white rounded-full mt-1 transition-transform ${
                  config.keyboardNavigation ? 'translate-x-5' : 'translate-x-1'
                }`} />
              </div>
            </label>
            
            {/* 文本转语音 */}
            <label className="flex items-center justify-between cursor-pointer">
              <span className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                {isSpeaking ? <VolumeX className="w-4 h-4 mr-2" /> : <Volume2 className="w-4 h-4 mr-2" />}
                文本转语音
              </span>
              <input
                type="checkbox"
                checked={config.textToSpeech}
                onChange={() => toggleOption('textToSpeech')}
                className="sr-only"
              />
              <div className={`w-10 h-6 rounded-full transition-colors ${
                config.textToSpeech ? 'bg-blue-600' : 'bg-gray-300'
              }`}>
                <div className={`w-4 h-4 bg-white rounded-full mt-1 transition-transform ${
                  config.textToSpeech ? 'translate-x-5' : 'translate-x-1'
                }`} />
              </div>
            </label>
            
            {/* 色盲友好 */}
            <label className="flex items-center justify-between cursor-pointer">
              <span className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                <EyeOff className="w-4 h-4 mr-2" />
                色盲友好模式
              </span>
              <input
                type="checkbox"
                checked={config.colorBlindFriendly}
                onChange={() => toggleOption('colorBlindFriendly')}
                className="sr-only"
              />
              <div className={`w-10 h-6 rounded-full transition-colors ${
                config.colorBlindFriendly ? 'bg-blue-600' : 'bg-gray-300'
              }`}>
                <div className={`w-4 h-4 bg-white rounded-full mt-1 transition-transform ${
                  config.colorBlindFriendly ? 'translate-x-5' : 'translate-x-1'
                }`} />
              </div>
            </label>
          </div>
          
          {/* 语音控制按钮 */}
          {config.textToSpeech && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
              <button
                onClick={() => isSpeaking ? stopSpeaking() : speakText('这是可访问性工具栏，您可以在这里调整网站的无障碍访问设置')}
                className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isSpeaking 
                    ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                {isSpeaking ? '停止朗读' : '朗读说明'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// 可访问的按钮组件
export const AccessibleButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
}> = ({ children, onClick, className = '', ariaLabel, disabled = false, variant = 'primary' }) => {
  const { config, speakText } = useAccessibility();
  
  const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-gray-400',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 disabled:bg-gray-400',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500 disabled:border-gray-400 disabled:text-gray-400'
  };
  
  const handleClick = () => {
    if (disabled) return;
    
    if (config.textToSpeech && ariaLabel) {
      speakText(ariaLabel);
    }
    
    onClick?.();
  };
  
  return (
    <button
      onClick={handleClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      aria-label={ariaLabel}
      disabled={disabled}
      role="button"
      tabIndex={0}
    >
      {children}
    </button>
  );
};

export default AccessibilityManager;