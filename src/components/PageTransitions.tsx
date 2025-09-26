import React, { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

// 简化的页面过渡组件
export const LazyAnimatePresenceComponent: React.FC<PageTransitionProps> = ({ children }) => {
  return <div className="transition-opacity duration-300">{children}</div>;
};

export const SmartPageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  return (
    <div className="transition-all duration-300 ease-in-out">
      {children}
    </div>
  );
};