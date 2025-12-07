import React from 'react';
import { Loader2 } from 'lucide-react';

// 简化的页面加载动画组件
interface PageLoadingAnimationProps {
  isLoading: boolean;
  loadingText?: string;
}

export const PageLoadingAnimation: React.FC<PageLoadingAnimationProps> = ({
  isLoading,
  loadingText = '加载中...'
}) => {
  
  if (!isLoading) return null;
  
  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        <p className="text-gray-600 dark:text-gray-400">{loadingText}</p>
      </div>
    </div>
  );
};
  
// 简化的页面过渡组件
interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`transition-opacity duration-300 ${className}`}>
      {children}
    </div>
  );
};

// 简化的滚动触发组件
interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`transition-all duration-500 ${className}`}>
      {children}
    </div>
  );
};

export default {
  PageLoadingAnimation,
  PageTransition,
  ScrollReveal
};