import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  ArrowUp, 
  Settings, 
  Moon,
  Sun,
  Palette,
  TextCursor,
  Share2,
  Minimize2
} from 'lucide-react';
import { UnifiedButton } from '../components/UnifiedButton';
import { HoverCard } from '../components/InteractiveEffects';

interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  fontSize: 'small' | 'medium' | 'large';
  animations: boolean;
  sounds: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
  readingMode: boolean;
  autoScroll: boolean;
  scrollSpeed: number;
}

interface FloatingControlsProps {
  showBackToTop?: boolean;
  showThemeToggle?: boolean;
  showFontSize?: boolean;
  showReadingMode?: boolean;
  showShare?: boolean;
  className?: string;
}

// 浮动控制面板组件
export const FloatingControls: React.FC<FloatingControlsProps> = ({
  showBackToTop = true,
  showThemeToggle = true,
  showFontSize = true,
  showReadingMode = true,
  showShare = true,
  className = ''
}) => {

  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: 'auto',
    fontSize: 'medium',
    animations: true,
    sounds: false,
    reducedMotion: false,
    highContrast: false,
    readingMode: false,
    autoScroll: false,
    scrollSpeed: 1
  });

  // 滚动监听
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsVisible(scrollTop > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 加载用户偏好
  useEffect(() => {
    const saved = localStorage.getItem('user-preferences');
    if (saved) {
      setPreferences(prev => ({ ...prev, ...JSON.parse(saved) }));
    }
  }, []);

  // 保存用户偏好
  const updatePreference = useCallback((key: keyof UserPreferences, value: string | boolean | number) => {
    setPreferences(prev => {
      const updated = { ...prev, [key]: value };
      localStorage.setItem('user-preferences', JSON.stringify(updated));
      
      // 应用偏好设置
      applyPreference(key, value);
      return updated;
    });
  }, []);

  // 应用偏好设置
  const applyPreference = (key: keyof UserPreferences, value: string | boolean | number) => {
    const root = document.documentElement;
    
    switch (key) {
      case 'fontSize':
        root.classList.remove('text-sm', 'text-base', 'text-lg');
        if (value === 'small') root.classList.add('text-sm');
        else if (value === 'large') root.classList.add('text-lg');
        else root.classList.add('text-base');
        break;
        
      case 'highContrast':
        if (value) root.classList.add('high-contrast');
        else root.classList.remove('high-contrast');
        break;
        
      case 'reducedMotion':
        if (value) root.classList.add('reduced-motion');
        else root.classList.remove('reduced-motion');
        break;
        
      case 'readingMode':
        if (value) root.classList.add('reading-mode');
        else root.classList.remove('reading-mode');
        break;
    }
  };

  // 返回顶部
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: preferences.reducedMotion ? 'auto' : 'smooth'
    });
  }, [preferences.reducedMotion]);

  // 自动滚动
  useEffect(() => {
    let scrollInterval: NodeJS.Timeout;
    
    if (preferences.autoScroll) {
      scrollInterval = setInterval(() => {
        window.scrollBy({
          top: preferences.scrollSpeed * 2,
          behavior: 'smooth'
        });
      }, 100);
    }
    
    return () => {
      if (scrollInterval) clearInterval(scrollInterval);
    };
  }, [preferences.autoScroll, preferences.scrollSpeed]);

  // 分享功能
  const handleShare = useCallback(async () => {
    const shareData = {
      title: document.title,
      text: document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        console.log('分享取消');
      }
    } else {
      // 降级方案：复制到剪贴板
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('链接已复制到剪贴板');
      } catch {
        // 降级到传统方法
        const textArea = document.createElement('textarea');
        textArea.value = window.location.href;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('链接已复制到剪贴板');
      }
    }
  }, []);

  if (!isVisible && !isExpanded) return null;

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      <div className={`flex flex-col gap-2 ${isExpanded ? 'bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4' : ''}`}>
        {/* 展开/收起按钮 */}
        <HoverCard>
          <UnifiedButton
            variant="secondary"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-10 h-10 rounded-full shadow-lg"
          >
            {isExpanded ? <Minimize2 size={16} /> : <Settings size={16} />}
          </UnifiedButton>
        </HoverCard>

        {/* 展开后的控制选项 */}
        {isExpanded && (
          <div className="space-y-2">
            {/* 返回顶部 */}
            {showBackToTop && (
              <HoverCard>
                <UnifiedButton
                  variant="outline"
                  size="sm"
                  onClick={scrollToTop}
                  className="w-10 h-10 rounded-full"
                  title="返回顶部"
                >
                  <ArrowUp size={16} />
                </UnifiedButton>
              </HoverCard>
            )}

            {/* 主题切换 */}
            {showThemeToggle && (
              <HoverCard>
                <UnifiedButton
                  variant="outline"
                  size="sm"
                  onClick={() => updatePreference('theme', preferences.theme === 'dark' ? 'light' : 'dark')}
                  className="w-10 h-10 rounded-full"
                  title="主题切换"
                >
                  {preferences.theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                </UnifiedButton>
              </HoverCard>
            )}

            {/* 字体大小 */}
            {showFontSize && (
              <HoverCard>
                <UnifiedButton
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const sizes = ['small', 'medium', 'large'];
                    const currentIndex = sizes.indexOf(preferences.fontSize);
                    const nextSize = sizes[(currentIndex + 1) % sizes.length];
                    updatePreference('fontSize', nextSize);
                  }}
                  className="w-10 h-10 rounded-full"
                  title="字体大小"
                >
                  <TextCursor size={16} />
                </UnifiedButton>
              </HoverCard>
            )}

            {/* 阅读模式 */}
            {showReadingMode && (
              <HoverCard>
                <UnifiedButton
                  variant={preferences.readingMode ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => updatePreference('readingMode', !preferences.readingMode)}
                  className="w-10 h-10 rounded-full"
                  title="阅读模式"
                >
                  <Palette size={16} />
                </UnifiedButton>
              </HoverCard>
            )}

            {/* 分享 */}
            {showShare && (
              <HoverCard>
                <UnifiedButton
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="w-10 h-10 rounded-full"
                  title="分享"
                >
                  <Share2 size={16} />
                </UnifiedButton>
              </HoverCard>
            )}

            {/* 更多设置 */}
            <div className="border-t pt-2 mt-2">
              <div className="space-y-1">
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={preferences.reducedMotion}
                    onChange={(e) => updatePreference('reducedMotion', e.target.checked)}
                    className="rounded"
                  />
                  减少动画
                </label>
                
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={preferences.highContrast}
                    onChange={(e) => updatePreference('highContrast', e.target.checked)}
                    className="rounded"
                  />
                  高对比度
                </label>
                
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={preferences.autoScroll}
                    onChange={(e) => updatePreference('autoScroll', e.target.checked)}
                    className="rounded"
                  />
                  自动滚动
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 样式覆盖 */}
      <style>{`
        .reading-mode {
          background: #f8f9fa !important;
          color: #2c3e50 !important;
          line-height: 1.8 !important;
          font-family: 'Georgia', serif !important;
        }
        
        .reading-mode * {
          max-width: 65ch !important;
          margin-left: auto !important;
          margin-right: auto !important;
        }
        
        .reading-mode img {
          display: block !important;
          margin: 2rem auto !important;
          max-width: 100% !important;
        }
        
        .reading-mode h1,
        .reading-mode h2,
        .reading-mode h3,
        .reading-mode h4,
        .reading-mode h5,
        .reading-mode h6 {
          font-family: 'Georgia', serif !important;
          font-weight: 700 !important;
          margin-top: 2rem !important;
          margin-bottom: 1rem !important;
        }
        
        .reading-mode p {
          margin-bottom: 1.5rem !important;
          text-align: justify !important;
          text-justify: inter-word !important;
        }
      `}</style>
    </div>
  );
};

// 页面加载进度条组件
export const PageLoadingProgress: React.FC<{ 
  isLoading: boolean;
  progress?: number;
  color?: string;
  height?: number;
}> = ({ 
  isLoading, 
  progress,
  color = '#3b82f6',
  height = 3 
}) => {
  const [internalProgress, setInternalProgress] = useState(0);

  useEffect(() => {
    if (isLoading && progress === undefined) {
      // 模拟进度
      const interval = setInterval(() => {
        setInternalProgress(prev => {
          if (prev >= 90) return prev;
          return prev + (100 - prev) * 0.1;
        });
      }, 200);

      return () => clearInterval(interval);
    } else if (!isLoading) {
      setInternalProgress(100);
      const timeout = setTimeout(() => setInternalProgress(0), 500);
      return () => clearTimeout(timeout);
    }
  }, [isLoading, progress]);

  const displayProgress = progress !== undefined ? progress : internalProgress;

  if (!isLoading && displayProgress === 0) return null;

  return (
    <div 
      className="fixed top-0 left-0 w-full z-50 transition-opacity duration-300"
      style={{ 
        height: `${height}px`,
        opacity: displayProgress === 100 ? 0 : 1
      }}
    >
      <div 
        className="h-full transition-all duration-300 ease-out"
        style={{ 
          width: `${displayProgress}%`,
          backgroundColor: color
        }}
      />
    </div>
  );
};

// 智能提示组件
export const SmartTooltip: React.FC<{
  children: React.ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
}> = ({ 
  children, 
  content, 
  position = 'top',
  delay = 500,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };

  const arrowClasses = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-l-4 border-transparent border-l-gray-900',
    right: 'right-full top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900'
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      {isVisible && (
        <div className={`absolute z-50 ${positionClasses[position]} ${className}`}>
          <div className="bg-gray-900 text-white text-sm rounded-lg px-3 py-2 max-w-xs shadow-lg">
            {content}
          </div>
          <div className={`absolute w-0 h-0 ${arrowClasses[position]}`} />
        </div>
      )}
    </div>
  );
};

// 快捷键提示组件
export const KeyboardShortcuts: React.FC<{ 
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {

  
  const shortcuts = [
    { key: '/', description: '聚焦搜索框' },
    { key: 'Ctrl + /', description: '打开搜索' },
    { key: 'Ctrl + T', description: '切换主题' },
    { key: 'Ctrl + L', description: '切换语言' },
    { key: 'Ctrl + R', description: '切换阅读模式' },
    { key: 'Ctrl + ↑', description: '返回顶部' },
    { key: 'Ctrl + S', description: '保存页面' },
    { key: 'Ctrl + P', description: '打印页面' },
    { key: 'Escape', description: '关闭弹窗' },
    { key: 'Tab', description: '键盘导航' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">键盘快捷键</h3>
          <UnifiedButton
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-1"
          >
            <span className="sr-only">关闭</span>
            ×
          </UnifiedButton>
        </div>
        
        <div className="p-4 max-h-96 overflow-y-auto">
          <div className="space-y-2">
            {shortcuts.map((shortcut, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {shortcut.description}
                </span>
                <kbd className="px-2 py-1 text-xs font-mono bg-gray-100 dark:bg-gray-700 rounded border">
                  {shortcut.key}
                </kbd>
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-4 border-t text-xs text-gray-500 dark:text-gray-400">
          提示：部分快捷键可能因浏览器或操作系统而异
        </div>
      </div>
    </div>
  );
};

export default FloatingControls;