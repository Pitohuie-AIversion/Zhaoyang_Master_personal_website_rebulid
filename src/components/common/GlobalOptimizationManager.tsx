import React, { createContext, useContext, useState, useCallback } from 'react';
import { PageLoadingAnimation } from '../animations/PageLoadingAnimations';

// 简化的优化配置接口
interface OptimizationConfig {
  enableLazyLoading: boolean;
  enableImageOptimization: boolean;
  loadingAnimationVariant: 'default' | 'tech' | 'minimal' | 'creative';
  pageTransitionDuration: number;
  reducedMotion: boolean;
}

// 简化的优化上下文
interface OptimizationContextType {
  config: OptimizationConfig;
  isLoading: boolean;
  updateConfig: (newConfig: Partial<OptimizationConfig>) => void;
  setLoading: (loading: boolean) => void;
}

const defaultConfig: OptimizationConfig = {
  enableLazyLoading: true,
  enableImageOptimization: true,
  loadingAnimationVariant: 'tech',
  pageTransitionDuration: 0.3,
  reducedMotion: false
};

const OptimizationContext = createContext<OptimizationContextType | undefined>(undefined);

// 简化的全局优化管理器组件
export const GlobalOptimizationManager: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<OptimizationConfig>(defaultConfig);
  const [isLoading, setIsLoading] = useState(false);
  
  // 更新配置
  const updateConfig = useCallback((newConfig: Partial<OptimizationConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  }, []);
  
  // 设置加载状态
  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);
  
  // 移除复杂的自动优化逻辑
  
  // 移除复杂的性能监控逻辑
  
  const contextValue: OptimizationContextType = {
    config,
    isLoading,
    updateConfig,
    setLoading
  };
  
  return (
    <OptimizationContext.Provider value={contextValue}>
      {children}
      <PageLoadingAnimation
        isLoading={isLoading}
        loadingText="正在加载页面..."
      />
    </OptimizationContext.Provider>
  );
};

// 使用优化上下文的Hook
export const useOptimization = () => {
  const context = useContext(OptimizationContext);
  if (!context) {
    throw new Error('useOptimization must be used within GlobalOptimizationManager');
  }
  return context;
};

// 移除了复杂的性能监控显示组件和优化建议组件
// 这些组件增加了不必要的复杂性和性能开销

export default GlobalOptimizationManager;