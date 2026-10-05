/* eslint-disable react-refresh/only-export-components */
import React, { lazy, useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from './TranslationProvider';

// 代码分割 - 懒加载组件
export const LazyHome = lazy(() => import('../../pages/Home').then(module => ({ default: module.default })));
export const LazyResearch = lazy(() => import('../../pages/Research').then(module => ({ default: module.default })));
export const LazyProjects = lazy(() => import('../../pages/Projects').then(module => ({ default: module.default })));
export const LazyPublications = lazy(() => import('../../pages/Publications').then(module => ({ default: module.default })));
export const LazySkills = lazy(() => import('../../pages/Skills').then(module => ({ default: module.default })));
export const LazyContact = lazy(() => import('../../pages/Contact').then(module => ({ default: module.default })));
export const LazyASCIIDemo = lazy(() => import('../../pages/ASCIIDemo').then(module => ({ default: module.default })));

// 预加载组件
export const preloadComponent = (componentImport: () => Promise<unknown>) => {
  componentImport();
};

// 预加载关键路由
export const preloadCriticalRoutes = () => {
  // 预加载最常访问的页面
  preloadComponent(() => import('../../pages/Research'));
  preloadComponent(() => import('../../pages/Projects'));
};

// 图片预加载组件
interface ImagePreloaderProps {
  images: string[];
  onComplete?: () => void;
}

export const ImagePreloader: React.FC<ImagePreloaderProps> = ({ images, onComplete }) => {

  useEffect(() => {
    if (images.length === 0) {
      onComplete?.();
      return;
    }

    const imagePromises = images.map((src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          resolve(img);
        };
        img.onerror = reject;
        img.src = src;
      });
    });

    Promise.allSettled(imagePromises).then(() => {
      onComplete?.();
    });
  }, [images, onComplete]);

  return null;
};

// 资源预加载Hook
export const useResourcePreloader = () => {
  const [isPreloading, setIsPreloading] = useState(true);

  const preloadImages = (images: string[]) => {
    return Promise.allSettled(
      images.map((src) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = reject;
          img.src = src;
        });
      })
    );
  };

  const preloadFonts = (fonts: string[]) => {
    return Promise.allSettled(
      fonts.map((fontFamily) => {
        return new Promise((resolve) => {
          // 创建一个隐藏的测试元素来预加载字体
          const testElement = document.createElement('div');
          testElement.style.fontFamily = fontFamily;
          testElement.style.position = 'absolute';
          testElement.style.left = '-9999px';
          testElement.style.visibility = 'hidden';
          testElement.textContent = 'Test';
          document.body.appendChild(testElement);

          // 字体加载完成后移除测试元素
          setTimeout(() => {
            document.body.removeChild(testElement);
            resolve(fontFamily);
          }, 100);
        });
      })
    );
  };

  useEffect(() => {
    // 预加载关键字体
    Promise.allSettled([
      preloadFonts(['Inter', 'system-ui', '-apple-system'])
    ]).then(() => {
      setIsPreloading(false);
    });

    // 预加载关键路由
    preloadCriticalRoutes();
  }, []);

  return { isPreloading, preloadImages, preloadFonts };
};


// 虚拟滚动组件
interface VirtualScrollProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
}

export const VirtualScroll = <T,>({
  items,
  itemHeight,
  containerHeight,
  renderItem
}: VirtualScrollProps<T>) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );

  const visibleItems = items.slice(visibleStart, visibleEnd);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  return (
    <div
      ref={containerRef}
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={handleScroll}
    >
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        {visibleItems.map((item, index) => (
          <div
            key={visibleStart + index}
            style={{
              position: 'absolute',
              top: (visibleStart + index) * itemHeight,
              height: itemHeight,
              width: '100%'
            }}
          >
            {renderItem(item, visibleStart + index)}
          </div>
        ))}
      </div>
    </div>
  );
};

// 内存优化Hook - 仅监控使用情况，不主动清理图片缓存
export const useMemoryOptimization = () => {
  // 不再主动清除图片 src，防止误清除 fixed/sticky 元素中的图片
  useEffect(() => {
    // 保留 hook 接口以兼容现有调用方，但不执行危险清理
  }, []);
};

// 网络状态优化
export const useNetworkOptimization = () => {
  const [networkStatus, setNetworkStatus] = useState<'online' | 'offline'>('online');
  const [connectionType, setConnectionType] = useState<string>('unknown');

  useEffect(() => {
    const updateNetworkStatus = () => {
      setNetworkStatus(navigator.onLine ? 'online' : 'offline');
    };

    const updateConnectionType = () => {
      const connection = (navigator as unknown as { connection?: { effectiveType?: string }; mozConnection?: { effectiveType?: string }; webkitConnection?: { effectiveType?: string } }).connection ||
        (navigator as unknown as { connection?: { effectiveType?: string }; mozConnection?: { effectiveType?: string }; webkitConnection?: { effectiveType?: string } }).mozConnection ||
        (navigator as unknown as { connection?: { effectiveType?: string }; mozConnection?: { effectiveType?: string }; webkitConnection?: { effectiveType?: string } }).webkitConnection;
      if (connection) {
        setConnectionType(connection.effectiveType || 'unknown');
      }
    };

    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);
    updateConnectionType();

    return () => {
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);
    };
  }, []);

  return { networkStatus, connectionType };
};

// 统一使用 src/components/common/ErrorBoundary.tsx
export { ErrorBoundary } from './ErrorBoundary';

// 加载状态管理
export const LoadingFallback: React.FC<{ message?: string }> = ({ message }) => {
  const { t } = useTranslation();
  const displayMessage = message ?? (t('common.loading') as string);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-[70vh] flex items-center justify-center bg-white dark:bg-gray-950 theme-transition"
      role="status"
      aria-live="polite"
    >
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">{displayMessage}</p>
      </div>
    </motion.div>
  );
};
