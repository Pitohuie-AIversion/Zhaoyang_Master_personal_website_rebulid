import React, { Suspense, lazy, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// 代码分割 - 懒加载组件
export const LazyHome = lazy(() => import('../pages/Home'));
export const LazyResearch = lazy(() => import('../pages/Research'));
export const LazyProjects = lazy(() => import('../pages/Projects'));
export const LazyPublications = lazy(() => import('../pages/Publications'));
export const LazySkills = lazy(() => import('../pages/Skills'));
export const LazyContact = lazy(() => import('../pages/Contact'));
export const LazyASCIIDemo = lazy(() => import('../pages/ASCIIDemo'));

// 预加载组件
export const preloadComponent = (componentImport: () => Promise<any>) => {
  componentImport();
};

// 预加载关键路由
export const preloadCriticalRoutes = () => {
  // 预加载最常访问的页面
  preloadComponent(() => import('../pages/Research'));
  preloadComponent(() => import('../pages/Projects'));
};

// 图片预加载组件
interface ImagePreloaderProps {
  images: string[];
  onComplete?: () => void;
}

export const ImagePreloader: React.FC<ImagePreloaderProps> = ({ images, onComplete }) => {
  const [loadedCount, setLoadedCount] = useState(0);

  useEffect(() => {
    if (images.length === 0) {
      onComplete?.();
      return;
    }

    let loaded = 0;
    const imagePromises = images.map((src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          loaded++;
          setLoadedCount(loaded);
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
    // 预加载关键资源
    const criticalImages = [
      '/hero-bg.jpg',
      '/profile.jpg',
      '/research-1.jpg',
      '/research-2.jpg',
      '/project-1.jpg'
    ];

    Promise.allSettled([
      preloadImages(criticalImages),
      preloadFonts(['Inter', 'system-ui', '-apple-system']),
      new Promise(resolve => setTimeout(resolve, 1000)) // 最小加载时间
    ]).then(() => {
      setIsPreloading(false);
    });

    // 预加载关键路由
    preloadCriticalRoutes();
  }, []);

  return { isPreloading, preloadImages, preloadFonts };
};

// 性能监控组件已移至AdvancedPerformanceOptimization.tsx以避免重复

// 虚拟滚动组件
interface VirtualScrollProps {
  items: any[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: any, index: number) => React.ReactNode;
}

export const VirtualScroll: React.FC<VirtualScrollProps> = ({
  items,
  itemHeight,
  containerHeight,
  renderItem
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);

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
      ref={setContainerRef}
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

// 内存优化Hook
export const useMemoryOptimization = () => {
  useEffect(() => {
    // 清理未使用的图片缓存
    const cleanupImageCache = () => {
      const images = document.querySelectorAll('img');
      images.forEach((img) => {
        if (!img.offsetParent) {
          img.src = '';
        }
      });
    };

    // 定期清理
    const interval = setInterval(cleanupImageCache, 30000);

    return () => clearInterval(interval);
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
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
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

// 错误边界组件
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('错误边界捕获到错误:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-screen flex items-center justify-center bg-gray-50"
        >
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">出现了一些问题</h2>
            <p className="text-gray-600 mb-6">页面加载时遇到错误，请刷新页面重试。</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              刷新页面
            </button>
          </div>
        </motion.div>
      );
    }

    return this.props.children;
  }
}

// 加载状态管理
export const LoadingFallback: React.FC<{ message?: string }> = ({ message = '加载中...' }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="min-h-screen flex items-center justify-center bg-white"
  >
    <div className="text-center">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600">{message}</p>
    </div>
  </motion.div>
);