import { useState, useEffect, useCallback, useRef } from 'react';

interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
  memory?: number; // Memory usage
}

interface ResourceLoadTiming {
  name: string;
  startTime: number;
  duration: number;
  size: number;
  type: 'image' | 'script' | 'stylesheet' | 'font' | 'other';
}

// 性能监控Hook
export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [resourceTimings, setResourceTimings] = useState<ResourceLoadTiming[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const observerRef = useRef<PerformanceObserver | null>(null);

  // 获取核心性能指标
  const collectCoreMetrics = useCallback(() => {
    if (typeof window === 'undefined' || !window.performance) return;

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');
    
    const fcp = paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0;
    const lcpData = performance.getEntriesByType('largest-contentful-paint')[0];
    const lcp = lcpData?.startTime || 0;
    
    // CLS计算
    let cls = 0;
    const layoutShiftEntries = performance.getEntriesByType('layout-shift');
    layoutShiftEntries.forEach(entry => {
      const layoutShiftEntry = entry as { hadRecentInput?: boolean; value?: number };
      if (!layoutShiftEntry.hadRecentInput && layoutShiftEntry.value) {
        cls += layoutShiftEntry.value;
      }
    });

    const newMetrics: PerformanceMetrics = {
      fcp: Math.round(fcp * 100) / 100,
      lcp: Math.round(lcp * 100) / 100,
      fid: 0, // 需要单独测量
      cls: Math.round(cls * 1000) / 1000,
      ttfb: Math.round(navigation.responseStart - navigation.requestStart),
      memory: (performance as unknown as { memory?: { usedJSHeapSize?: number } }).memory?.usedJSHeapSize / 1024 / 1024 // MB
    };

    setMetrics(newMetrics);
  }, []);

  // 收集资源加载时间
  const collectResourceTimings = useCallback(() => {
    if (typeof window === 'undefined' || !window.performance) return;

    const resources = performance.getEntriesByType('resource');
    const timings: ResourceLoadTiming[] = resources.map(resource => {
      const entry = resource as PerformanceResourceTiming;
      let type: ResourceLoadTiming['type'] = 'other';
      
      if (entry.name.includes('.jpg') || entry.name.includes('.png') || entry.name.includes('.svg')) {
        type = 'image';
      } else if (entry.name.includes('.js')) {
        type = 'script';
      } else if (entry.name.includes('.css')) {
        type = 'stylesheet';
      } else if (entry.name.includes('.woff') || entry.name.includes('.ttf')) {
        type = 'font';
      }

      return {
        name: entry.name.split('/').pop() || entry.name,
        startTime: Math.round(entry.startTime * 100) / 100,
        duration: Math.round(entry.duration * 100) / 100,
        size: entry.transferSize || 0,
        type
      };
    }).sort((a, b) => b.duration - a.duration);

    setResourceTimings(timings.slice(0, 10)); // 只保留前10个最慢的资源
  }, []);

  // 开始监控
  const startMonitoring = useCallback(() => {
    if (typeof window === 'undefined' || !window.PerformanceObserver) return;

    setIsMonitoring(true);

    // 立即收集现有数据
    collectCoreMetrics();
    collectResourceTimings();

    // 设置Performance Observer
    observerRef.current = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          setMetrics(prev => prev ? { ...prev, lcp: Math.round(entry.startTime * 100) / 100 } : prev);
        }
        if (entry.entryType === 'layout-shift') {
          const layoutShiftEntry = entry as { hadRecentInput?: boolean; value?: number };
          if (!layoutShiftEntry.hadRecentInput && layoutShiftEntry.value) {
            setMetrics(prev => prev ? { ...prev, cls: (prev.cls + layoutShiftEntry.value!) } : prev);
          }
        }
      }
    });

    observerRef.current.observe({ entryTypes: ['largest-contentful-paint', 'layout-shift'] });

    // 定期更新资源时间
    const interval = setInterval(() => {
      collectResourceTimings();
    }, 5000);

    return () => {
      clearInterval(interval);
      observerRef.current?.disconnect();
    };
  }, [collectCoreMetrics, collectResourceTimings]);

  // 停止监控
  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
    observerRef.current?.disconnect();
  }, []);

  // 获取性能建议
  const getPerformanceSuggestions = useCallback(() => {
    if (!metrics) return [];

    const suggestions = [];

    if (metrics.fcp > 1800) {
      suggestions.push({
        type: 'fcp',
        severity: metrics.fcp > 3000 ? 'high' : 'medium',
        message: '首次内容绘制时间较长，建议优化关键渲染路径',
        solution: '减少阻塞渲染的CSS和JavaScript，使用资源预加载'
      });
    }

    if (metrics.lcp > 2500) {
      suggestions.push({
        type: 'lcp',
        severity: metrics.lcp > 4000 ? 'high' : 'medium',
        message: '最大内容绘制时间较长，建议优化主要元素加载',
        solution: '优化图片大小和格式，使用CDN加速，实施懒加载策略'
      });
    }

    if (metrics.cls > 0.1) {
      suggestions.push({
        type: 'cls',
        severity: metrics.cls > 0.25 ? 'high' : 'medium',
        message: '累积布局偏移较大，影响用户体验',
        solution: '为图片和广告预留空间，避免动态插入内容'
      });
    }

    if (metrics.ttfb > 800) {
      suggestions.push({
        type: 'ttfb',
        severity: metrics.ttfb > 1800 ? 'high' : 'medium',
        message: '首字节时间较长，服务器响应需要优化',
        solution: '优化服务器性能，使用CDN，实施缓存策略'
      });
    }

    return suggestions;
  }, [metrics]);

  return {
    metrics,
    resourceTimings,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    getPerformanceSuggestions
  };
};

// 资源预加载Hook
export const useResourcePreloader = (resources: string[], options: {
  priority?: 'high' | 'low';
  timeout?: number;
  onProgress?: (loaded: number, total: number) => void;
  onComplete?: () => void;
  onError?: (error: string) => void;
} = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadedCount, setLoadedCount] = useState(0);
  const loadedResources = useRef<Set<string>>(new Set());

  const preloadResource = useCallback(async (resource: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      
      if (resource.endsWith('.css')) {
        link.as = 'style';
      } else if (resource.endsWith('.js')) {
        link.as = 'script';
      } else if (resource.match(/\.(jpg|jpeg|png|webp|svg)$/)) {
        link.as = 'image';
      } else if (resource.endsWith('.woff') || resource.endsWith('.woff2')) {
        link.as = 'font';
        link.crossOrigin = 'anonymous';
      }

      if (options.priority === 'high') {
        link.fetchPriority = 'high';
      } else if (options.priority === 'low') {
        link.fetchPriority = 'low';
      }

      link.onload = () => {
        loadedResources.current.add(resource);
        resolve();
      };

      link.onerror = () => {
        reject(new Error(`Failed to preload: ${resource}`));
      };

      document.head.appendChild(link);

      // 超时处理
      if (options.timeout) {
        setTimeout(() => {
          reject(new Error(`Preload timeout: ${resource}`));
        }, options.timeout);
      }
    });
  }, [options.priority, options.timeout]);

  const preloadResources = useCallback(async () => {
    if (isLoading || resources.length === 0) return;

    setIsLoading(true);
    setProgress(0);
    setLoadedCount(0);

    try {
      const preloadPromises = resources.map(async (resource) => {
        try {
          await preloadResource(resource);
          const newLoadedCount = loadedCount + 1;
          setLoadedCount(newLoadedCount);
          setProgress((newLoadedCount / resources.length) * 100);
          options.onProgress?.(newLoadedCount, resources.length);
        } catch (error) {
          console.warn(`Failed to preload resource: ${resource}`, error);
          // 继续预加载其他资源
        }
      });

      await Promise.allSettled(preloadPromises);
      
      setProgress(100);
      options.onComplete?.();
    } catch (error) {
      options.onError?.(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [resources, isLoading, preloadResource, loadedCount, options]);

  const clearPreloadedResources = useCallback(() => {
    loadedResources.current.clear();
    setProgress(0);
    setLoadedCount(0);
    setIsLoading(false);
  }, []);

  return {
    isLoading,
    progress,
    loadedCount,
    totalCount: resources.length,
    preloadResources,
    clearPreloadedResources,
    hasPreloaded: (resource: string) => loadedResources.current.has(resource)
  };
};

// 图片懒加载Hook
export const useLazyImage = (src: string, options: {
  threshold?: number;
  rootMargin?: string;
  placeholder?: string;
  errorImage?: string;
} = {}) => {
  const [imageSrc, setImageSrc] = useState(options.placeholder || '');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const loadImage = useCallback(() => {
    if (!src) return;

    setIsLoading(true);
    setError(null);

    const img = new Image();
    
    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
    };

    img.onerror = () => {
      setError('Failed to load image');
      setIsLoading(false);
      if (options.errorImage) {
        setImageSrc(options.errorImage);
      }
    };

    img.src = src;
  }, [src, options.errorImage]);

  const setupIntersectionObserver = useCallback(() => {
    if (!imageRef.current || !window.IntersectionObserver) {
      loadImage();
      return;
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            loadImage();
            if (observerRef.current && imageRef.current) {
              observerRef.current.unobserve(imageRef.current);
            }
          }
        });
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '50px'
      }
    );

    observerRef.current.observe(imageRef.current);
  }, [loadImage, options.threshold, options.rootMargin]);

  useEffect(() => {
    setupIntersectionObserver();

    return () => {
      const currentImageRef = imageRef.current;
      if (observerRef.current && currentImageRef) {
        observerRef.current.unobserve(currentImageRef);
      }
    };
  }, [setupIntersectionObserver]);

  useEffect(() => {
    // 如果图片已经在视口中，直接加载
    if (imageRef.current && imageRef.current.getBoundingClientRect().top < window.innerHeight) {
      loadImage();
    }
  }, [loadImage]);

  return {
    imageSrc,
    isLoading,
    error,
    imageRef,
    retry: loadImage
  };
};

// 代码分割策略Hook
export const useCodeSplitting = (componentPath: string, options: {
  fallback?: React.ReactNode;
  timeout?: number;
  retryCount?: number;
} = {}) => {
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const retryCountRef = useRef(0);

  const loadComponent = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const module = await import(/* webpackChunkName: "[request]" */ `../pages/${componentPath}`);
      setComponent(() => module.default || module);
      setIsLoading(false);
      retryCountRef.current = 0;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load component';
      setError(errorMessage);
      setIsLoading(false);

      // 重试机制
      if (retryCountRef.current < (options.retryCount || 3)) {
        retryCountRef.current++;
        setTimeout(() => {
          loadComponent();
        }, 1000 * retryCountRef.current);
      }
    }
  }, [componentPath, options.retryCount]);

  useEffect(() => {
    loadComponent();
  }, [loadComponent]);

  return {
    Component,
    isLoading,
    error,
    retry: loadComponent
  };
};

// 网络状态检测Hook
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [connectionType, setConnectionType] = useState<string>('unknown');
  const [effectiveType, setEffectiveType] = useState<string>('unknown');
  const [downlink, setDownlink] = useState<number>(0);

  const updateConnectionInfo = useCallback(() => {
    if ('connection' in navigator) {
      const connection = (navigator as unknown as { connection?: { type?: string; effectiveType?: string; downlink?: number } }).connection;
      setConnectionType(connection?.type || 'unknown');
      setEffectiveType(connection?.effectiveType || 'unknown');
      setDownlink(connection?.downlink || 0);
    }
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if ('connection' in navigator) {
      const connection = (navigator as unknown as { connection?: { type?: string; effectiveType?: string; downlink?: number; addEventListener?: (event: string, handler: () => void) => void } }).connection;
      if (connection?.addEventListener) {
        connection.addEventListener('change', updateConnectionInfo);
      }
      updateConnectionInfo();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if ('connection' in navigator) {
        const connection = (navigator as unknown as { connection?: { removeEventListener?: (event: string, handler: () => void) => void } }).connection;
        if (connection?.removeEventListener) {
          connection.removeEventListener('change', updateConnectionInfo);
        }
      }
    };
  }, [updateConnectionInfo]);

  return {
    isOnline,
    connectionType,
    effectiveType,
    downlink,
    isSlowConnection: effectiveType === '2g' || effectiveType === 'slow-2g'
  };
};