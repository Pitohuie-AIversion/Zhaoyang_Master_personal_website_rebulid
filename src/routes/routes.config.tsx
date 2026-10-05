/* eslint-disable react-refresh/only-export-components */
import React, { lazy } from 'react';

// 主页面懒加载集中管理
export const LazyHome = lazy(() => import('../pages/Home'));
export const LazyResearch = lazy(() => import('../pages/Research'));
export const LazyProjects = lazy(() => import('../pages/Projects'));
export const LazyPublications = lazy(() => import('../pages/Publications'));
export const LazySkills = lazy(() => import('../pages/Skills'));
export const LazyContact = lazy(() => import('../pages/Contact'));
export const LazyASCIIDemo = lazy(() => import('../pages/ASCIIDemo'));

// 粒子场页面
export const LazyParticleField = lazy(() => import('../pages/ParticleField'));
export const LazyParticleFieldDemo = lazy(() => import('../pages/ParticleFieldDemo'));
export const LazyParticleFieldSettings = lazy(() => import('../pages/ParticleFieldSettings'));

// 博客模块
export const LazyBlogPage = lazy(() => import('../pages/BlogPage'));
export const LazyBlogPost = lazy(() => import('../components/features/blog/BlogPost'));

// 管理与工具页面
export const LazyContactViewer = lazy(() => import('../pages/ContactViewer'));
export const LazyResumeManager = lazy(() => import('../components/features/resume/ResumeManager'));
export const LazyNotFound = lazy(() => import('../pages/NotFound'));

// 全局聊天助手
export const LazyChatAssistant = lazy(() => import('../components/features/chat/ChatAssistant'));

export interface RouteDefinition {
  path: string;
  element: React.ReactNode;
  isPrivate?: boolean;
  privateDescriptionKey?: string;
}

export const routesConfig: RouteDefinition[] = [
  { path: '/', element: <LazyHome /> },
  { path: '/research', element: <LazyResearch /> },
  { path: '/projects', element: <LazyProjects /> },
  { path: '/publications', element: <LazyPublications /> },
  { path: '/skills', element: <LazySkills /> },
  { path: '/contact', element: <LazyContact /> },
  { path: '/ascii-demo', element: <LazyASCIIDemo /> },
  { path: '/particle-field', element: <LazyParticleField /> },
  { path: '/particle-field/demo', element: <LazyParticleFieldDemo /> },
  { path: '/particle-field/settings', element: <LazyParticleFieldSettings /> },
  { 
    path: '/contact-admin', 
    element: <LazyContactViewer />, 
    isPrivate: true, 
    privateDescriptionKey: 'common.adminAuth.contactDescription' 
  },
  { path: '/blog', element: <LazyBlogPage /> },
  { path: '/blog/:slug', element: <LazyBlogPost /> },
  { 
    path: '/resume-manager', 
    element: <LazyResumeManager />, 
    isPrivate: true, 
    privateDescriptionKey: 'common.adminAuth.resumeDescription' 
  },
  { path: '*', element: <LazyNotFound /> },
];
