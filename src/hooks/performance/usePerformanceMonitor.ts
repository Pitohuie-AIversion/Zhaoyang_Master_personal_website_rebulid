import { useState, useCallback, useRef } from 'react';

export interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
  memory?: number; // Memory usage
}

export interface ResourceLoadTiming {
  name: string;
  startTime: number;
  duration: number;
  size: number;
  type: 'image' | 'script' | 'stylesheet' | 'font' | 'other';
}

export interface PerformanceSuggestion {
  type: string;
  severity: 'high' | 'medium' | 'low';
  message: string;
  solution: string;
}

/**
 * 核心 Web Vitals 与性能监控 Hook
 */
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

    const fcp = paint.find((entry) => entry.name === 'first-contentful-paint')?.startTime || 0;
    const lcpData = performance.getEntriesByType('largest-contentful-paint')[0];
    const lcp = lcpData?.startTime || 0;

    // CLS计算
    let cls = 0;
    const layoutShiftEntries = performance.getEntriesByType('layout-shift');
    layoutShiftEntries.forEach((entry) => {
      const layoutShiftEntry = entry as { hadRecentInput?: boolean; value?: number };
      if (!layoutShiftEntry.hadRecentInput && layoutShiftEntry.value) {
        cls += layoutShiftEntry.value;
      }
    });

    const newMetrics: PerformanceMetrics = {
      fcp: Math.round(fcp * 100) / 100,
      lcp: Math.round(lcp * 100) / 100,
      fid: 0,
      cls: Math.round(cls * 1000) / 1000,
      ttfb: navigation ? Math.round(navigation.responseStart - navigation.requestStart) : 0,
      memory: (performance as unknown as { memory?: { usedJSHeapSize?: number } }).memory?.usedJSHeapSize
        ? (performance as unknown as { memory: { usedJSHeapSize: number } }).memory.usedJSHeapSize / 1024 / 1024
        : undefined,
    };

    setMetrics(newMetrics);
  }, []);

  // 收集资源加载时间
  const collectResourceTimings = useCallback(() => {
    if (typeof window === 'undefined' || !window.performance) return;

    const resources = performance.getEntriesByType('resource');
    const timings: ResourceLoadTiming[] = resources
      .map((resource) => {
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
          type,
        };
      })
      .sort((a, b) => b.duration - a.duration);

    setResourceTimings(timings.slice(0, 10));
  }, []);

  // 开始监控
  const startMonitoring = useCallback(() => {
    if (typeof window === 'undefined' || !window.PerformanceObserver) return;

    setIsMonitoring(true);
    collectCoreMetrics();
    collectResourceTimings();

    // 设置Performance Observer
    observerRef.current = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          setMetrics((prev) => (prev ? { ...prev, lcp: Math.round(entry.startTime * 100) / 100 } : prev));
        }
        if (entry.entryType === 'layout-shift') {
          const layoutShiftEntry = entry as { hadRecentInput?: boolean; value?: number };
          if (!layoutShiftEntry.hadRecentInput && layoutShiftEntry.value) {
            setMetrics((prev) => (prev ? { ...prev, cls: prev.cls + layoutShiftEntry.value! } : prev));
          }
        }
      }
    });

    observerRef.current.observe({ entryTypes: ['largest-contentful-paint', 'layout-shift'] });

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
  const getPerformanceSuggestions = useCallback((): PerformanceSuggestion[] => {
    if (!metrics) return [];

    const suggestions: PerformanceSuggestion[] = [];

    if (metrics.fcp > 1800) {
      suggestions.push({
        type: 'fcp',
        severity: metrics.fcp > 3000 ? 'high' : 'medium',
        message: '首次内容绘制时间较长，建议优化关键渲染路径',
        solution: '减少阻塞渲染的CSS和JavaScript，使用资源预加载',
      });
    }

    if (metrics.lcp > 2500) {
      suggestions.push({
        type: 'lcp',
        severity: metrics.lcp > 4000 ? 'high' : 'medium',
        message: '最大内容绘制时间较长，建议优化主要元素加载',
        solution: '优化图片大小和格式，使用CDN加速，实施懒加载策略',
      });
    }

    if (metrics.cls > 0.1) {
      suggestions.push({
        type: 'cls',
        severity: metrics.cls > 0.25 ? 'high' : 'medium',
        message: '累积布局偏移较大，影响用户体验',
        solution: '为图片和广告预留空间，避免动态插入内容',
      });
    }

    if (metrics.ttfb > 800) {
      suggestions.push({
        type: 'ttfb',
        severity: metrics.ttfb > 1800 ? 'high' : 'medium',
        message: '首字节时间较长，服务器响应需要优化',
        solution: '优化服务器性能，使用CDN，实施缓存策略',
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
    getPerformanceSuggestions,
  };
};
