import React from 'react';

/**
 * 路由配置系统领域类型
 */
export interface AppRouteConfig {
  path: string;
  element: React.LazyExoticComponent<React.ComponentType<unknown>> | React.ComponentType<unknown> | React.ReactElement;
  isPrivate?: boolean;
  meta?: {
    titleKey?: string;
    descriptionKey?: string;
    requiresAdmin?: boolean;
  };
}

export interface PrivateRouteSEOProps {
  description: string;
}
