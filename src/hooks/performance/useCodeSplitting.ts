import { useState, useEffect, useCallback, useRef } from 'react';

const pageModules = import.meta.glob<{ default: React.ComponentType }>('../../pages/**/*.tsx');

export interface CodeSplittingOptions {
  fallback?: React.ReactNode;
  timeout?: number;
  retryCount?: number;
}

/**
 * 路由/页面组件按需代码分割与重试加载 Hook
 */
export const useCodeSplitting = (
  componentPath: string,
  options: CodeSplittingOptions = {}
) => {
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const retryCountRef = useRef(0);

  const loadComponent = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const normalizedPath = componentPath.replace(/^\.\//, '').replace(/\.tsx$/, '');
      const loadPage = pageModules[`../../pages/${normalizedPath}.tsx`];
      if (!loadPage) {
        throw new Error(`Unknown page component: ${componentPath}`);
      }

      const module = await loadPage();
      setComponent(() => module.default);
      setIsLoading(false);
      retryCountRef.current = 0;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load component';
      setError(errorMessage);
      setIsLoading(false);

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
    retry: loadComponent,
  };
};
