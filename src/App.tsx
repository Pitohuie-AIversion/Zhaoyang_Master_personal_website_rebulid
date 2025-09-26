import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { GlobalOptimizationManager } from './components/GlobalOptimizationManager';
import { AccessibilityProvider } from './components/AccessibilityProvider';
import { ThemeProvider } from './components/DarkModeProvider';
import { TranslationProvider } from './components/TranslationProvider';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LazyAnimatePresenceComponent, SmartPageTransition } from './components/PageTransitions';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HeaderASCII from './components/HeaderASCII';
import { AccessibilityManager, AccessibilityToolbar } from './components/AccessibilityEnhancements';
import { ThemeTransition } from './components/DarkModeProvider';
import './styles/accessibility.css';
import './styles/animations.css';
import { 
  LoadingFallback,
  LazyHome,
  LazyResearch,
  LazyProjects,
  LazyPublications,
  LazySkills,
  LazyContact,
  LazyASCIIDemo
} from './components/PerformanceOptimization';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <LazyAnimatePresenceComponent>
      <SmartPageTransition>
        <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <Suspense fallback={<LoadingFallback message="加载首页中..." />}>
              <LazyHome />
            </Suspense>
          }
        />
        <Route
          path="/research"
          element={
            <Suspense fallback={<LoadingFallback message="加载研究页面中..." />}>
              <LazyResearch />
            </Suspense>
          }
        />
        <Route
          path="/projects"
          element={
            <Suspense fallback={<LoadingFallback message="加载项目页面中..." />}>
              <LazyProjects />
            </Suspense>
          }
        />
        <Route
          path="/publications"
          element={
            <Suspense fallback={<LoadingFallback message="加载发表页面中..." />}>
              <LazyPublications />
            </Suspense>
          }
        />
        <Route
          path="/skills"
          element={
            <Suspense fallback={<LoadingFallback message="加载技能页面中..." />}>
              <LazySkills />
            </Suspense>
          }
        />
        <Route
          path="/contact"
          element={
            <Suspense fallback={<LoadingFallback message="加载联系页面中..." />}>
              <LazyContact />
            </Suspense>
          }
        />
        <Route
          path="/ascii-demo"
          element={
            <Suspense fallback={<LoadingFallback message="加载ASCII演示页面中..." />}>
              <LazyASCIIDemo />
            </Suspense>
          }
        />
        </Routes>
      </SmartPageTransition>
    </LazyAnimatePresenceComponent>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <TranslationProvider>
          <GlobalOptimizationManager>
          <AccessibilityManager>
            <ThemeTransition>
              <div className="min-h-screen bg-primary-dark theme-transition" id="main-content">
                {/* 跳转链接 */}
                <a href="#main-content" className="skip-link">
                  跳转到主要内容
                </a>
                
                {/* 性能监控已简化 */}
                <HeaderASCII />
                <Navbar />
                <AnimatedRoutes />
                <Footer />
                
                {/* 可访问性工具栏 */}
                <AccessibilityToolbar />
                
                {/* 性能监控显示 */}
                {/* 移除了性能监控显示和优化建议组件 */}
              </div>
            </ThemeTransition>
          </AccessibilityManager>
          </GlobalOptimizationManager>
        </TranslationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App
