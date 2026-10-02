import { useState, useCallback, useRef } from 'react';

export interface ResourcePreloaderOptions {
  priority?: 'high' | 'low';
  timeout?: number;
  onProgress?: (loaded: number, total: number) => void;
  onComplete?: () => void;
  onError?: (error: string) => void;
}

/**
 * 动态资源预加载 Hook (支持样式、脚本、字体与图片，并支持加载进度回调)
 */
export const useResourcePreloader = (
  resources: string[],
  options: ResourcePreloaderOptions = {}
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadedCount, setLoadedCount] = useState(0);
  const loadedResources = useRef<Set<string>>(new Set());

  const preloadResource = useCallback(
    async (resource: string): Promise<void> => {
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

        if (options.timeout) {
          setTimeout(() => {
            reject(new Error(`Preload timeout: ${resource}`));
          }, options.timeout);
        }
      });
    },
    [options.priority, options.timeout]
  );

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
    hasPreloaded: (resource: string) => loadedResources.current.has(resource),
  };
};
