import React, { Suspense, lazy, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

// 代码分割 - 懒加载组件
export const LazyResearch = lazy(() => import('../../pages/Research'));
export const LazyPublications = lazy(() => import('../../pages/Publications'));
export const LazyContact = lazy(() => import('../../pages/Contact'));

// 预加载Hook
export const usePreloadRoutes = () => {
  useEffect(() => {
    // 预加载关键路由
    const preloadTimer = setTimeout(() => {
      import('../../pages/Research');
      import('../../pages/Publications');
    }, 2000);

    return () => clearTimeout(preloadTimer);
  }, []);
};

// 图片预加载Hook
export const useImagePreloader = (imageUrls: string[]) => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const preloadImages = async () => {
      const promises = imageUrls.map((url) => {
        return new Promise<string>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(url);
          img.onerror = () => reject(url);
          img.src = url;
        });
      });

      try {
        const loaded = await Promise.allSettled(promises);
        const successfullyLoaded = loaded
          .filter((result) => result.status === 'fulfilled')
          .map((result) => (result as PromiseFulfilledResult<string>).value);
        
        setLoadedImages(new Set(successfullyLoaded));
      } catch (error) {
        console.warn('Some images failed to preload:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (imageUrls.length > 0) {
      preloadImages();
    } else {
      setIsLoading(false);
    }
  }, [imageUrls]);

  return { loadedImages, isLoading };
};

// 内存优化Hook
export const useMemoryOptimization = () => {
  const [memoryUsage, setMemoryUsage] = useState<number>(0);

  useEffect(() => {
    const checkMemoryUsage = () => {
      if ('memory' in performance) {
        const memory = (performance as Performance & { memory?: { usedJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
        if (memory) {
          setMemoryUsage(memory.usedJSHeapSize / memory.jsHeapSizeLimit);
        }
      }
    };

    const interval = setInterval(checkMemoryUsage, 5000);
    checkMemoryUsage();

    return () => clearInterval(interval);
  }, []);

  const clearCache = useCallback(() => {
    // 清理不必要的缓存
    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach((name) => {
          if (name.includes('old') || name.includes('temp')) {
            caches.delete(name);
          }
        });
      });
    }
  }, []);

  return { memoryUsage, clearCache };
};

// 虚拟滚动组件
export const VirtualScrollList: React.FC<{
  items: unknown[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: unknown, index: number) => React.ReactNode;
  className?: string;
}> = ({ items, itemHeight, containerHeight, renderItem, className = '' }) => {
  const [scrollTop, setScrollTop] = useState(0);
  
  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );
  
  const visibleItems = items.slice(visibleStart, visibleEnd);
  const totalHeight = items.length * itemHeight;
  const offsetY = visibleStart * itemHeight;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  return (
    <div
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) =>
            renderItem(item, visibleStart + index)
          )}
        </div>
      </div>
    </div>
  );
};

// 性能监控组件
export const PerformanceMonitor: React.FC<{
  onMetrics?: (metrics: { lcp: number; fid: number; cls: number; fcp: number }) => void;
}> = ({ onMetrics }) => {
  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const metrics = {
        lcp: 0,
        fid: 0,
        cls: 0,
        fcp: 0,
      };

      entries.forEach((entry) => {
        switch (entry.entryType) {
          case 'largest-contentful-paint':
            metrics.lcp = entry.startTime;
            break;
          case 'first-input':
            metrics.fid = (entry as PerformanceEventTiming).processingStart - entry.startTime;
            break;
          case 'layout-shift': {
            const layoutShiftEntry = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number };
            if (!layoutShiftEntry.hadRecentInput && layoutShiftEntry.value) {
              metrics.cls += layoutShiftEntry.value;
            }
            break;
          }
          case 'paint':
            if (entry.name === 'first-contentful-paint') {
              metrics.fcp = entry.startTime;
            }
            break;
        }
      });

      if (onMetrics) {
        onMetrics(metrics);
      }
    });

    observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift', 'paint'] });

    return () => observer.disconnect();
  }, [onMetrics]);

  return null;
};

// 资源优先级管理
export const useResourcePriority = () => {
  const preloadCriticalResources = useCallback(() => {
    // 预加载关键CSS
    const criticalCSS = document.createElement('link');
    criticalCSS.rel = 'preload';
    criticalCSS.as = 'style';
    criticalCSS.href = '/critical.css';
    document.head.appendChild(criticalCSS);

    // 预加载关键字体
    const criticalFont = document.createElement('link');
    criticalFont.rel = 'preload';
    criticalFont.as = 'font';
    criticalFont.type = 'font/woff2';
    criticalFont.crossOrigin = 'anonymous';
    criticalFont.href = '/fonts/inter-var.woff2';
    document.head.appendChild(criticalFont);
  }, []);

  const deferNonCriticalResources = useCallback(() => {
    // 延迟加载非关键资源
    const nonCriticalImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src || '';
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });

    nonCriticalImages.forEach((img) => imageObserver.observe(img));
  }, []);

  return { preloadCriticalResources, deferNonCriticalResources };
};

// 缓存管理Hook
export const useCacheManager = () => {
  const [cacheSize, setCacheSize] = useState(0);

  const calculateCacheSize = useCallback(async () => {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      setCacheSize(estimate.usage || 0);
    }
  }, []);

  const clearOldCache = useCallback(async () => {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      const oldCaches = cacheNames.filter(name => {
        const timestamp = name.split('-').pop();
        if (timestamp) {
          const cacheTime = parseInt(timestamp);
          const now = Date.now();
          return (now - cacheTime) > 7 * 24 * 60 * 60 * 1000; // 7天
        }
        return false;
      });

      await Promise.all(oldCaches.map(name => caches.delete(name)));
    }
  }, []);

  useEffect(() => {
    calculateCacheSize();
    clearOldCache();
  }, [calculateCacheSize, clearOldCache]);

  return { cacheSize, clearOldCache, calculateCacheSize };
};

// 网络状态优化
export const useNetworkOptimization = () => {
  const [networkInfo, setNetworkInfo] = useState({
    effectiveType: '4g',
    downlink: 10,
    rtt: 100,
  });

  useEffect(() => {
    const updateNetworkInfo = () => {
      if ('connection' in navigator) {
        const connection = (navigator as Navigator & { connection?: { effectiveType?: string; downlink?: number; rtt?: number } }).connection;
        if (connection) {
          setNetworkInfo({
            effectiveType: connection.effectiveType || '4g',
            downlink: connection.downlink || 10,
            rtt: connection.rtt || 100,
          });
        }
      }
    };

    updateNetworkInfo();

    if ('connection' in navigator) {
      const connection = (navigator as Navigator & { connection?: { effectiveType?: string; downlink?: number; rtt?: number } }).connection;
      if (connection) {
        (connection as any).addEventListener('change', updateNetworkInfo);
        return () => (connection as any).removeEventListener('change', updateNetworkInfo);
      }
    }
  }, []);

  const getOptimalImageQuality = useCallback(() => {
    switch (networkInfo.effectiveType) {
      case 'slow-2g':
      case '2g':
        return 'low';
      case '3g':
        return 'medium';
      case '4g':
      default:
        return 'high';
    }
  }, [networkInfo.effectiveType]);

  return { networkInfo, getOptimalImageQuality };
};

// 优化的加载状态组件
export const OptimizedLoadingSpinner: React.FC<{
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} ${className}`}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      <svg
        className="w-full h-full text-blue-600"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </motion.div>
  );
};

// 性能优化的Suspense包装器
export const OptimizedSuspense: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback }) => {
  const defaultFallback = (
    <div className="flex items-center justify-center min-h-[200px]">
      <OptimizedLoadingSpinner size="lg" />
    </div>
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  );
};