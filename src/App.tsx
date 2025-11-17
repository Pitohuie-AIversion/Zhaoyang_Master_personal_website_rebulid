import React, { Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { GlobalOptimizationManager } from './components/GlobalOptimizationManager';
import { ThemeProvider } from './components/DarkModeProvider';
import { TranslationProvider } from './components/TranslationProvider';
import { ErrorBoundary } from './components/ErrorBoundary';
import { SmartPageTransition } from './components/PageTransitions';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AnimatedBackground from './components/AnimatedBackground';
// import HeaderASCII from './components/HeaderASCII'; // 已移动到 Navbar 中
import { AccessibilityManager, AccessibilityToolbar } from './components/AccessibilityEnhancements';
import { ThemeTransition } from './components/DarkModeProvider';
import ChatAssistant from './components/ChatAssistant';
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

// Lazy load Particle Field pages
const LazyParticleField = React.lazy(() => import('./pages/ParticleField'));
const LazyParticleFieldDemo = React.lazy(() => import('./pages/ParticleFieldDemo'));
const LazyParticleFieldSettings = React.lazy(() => import('./pages/ParticleFieldSettings'));

function AnimatedRoutes() {
  const location = useLocation();

  return (
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
        <Route
          path="/particle-field"
          element={
            <Suspense fallback={<LoadingFallback message="加载粒子海洋页面中..." />}>
              <LazyParticleField />
            </Suspense>
          }
        />
        <Route
          path="/particle-field/demo"
          element={
            <Suspense fallback={<LoadingFallback message="加载粒子海洋演示页面中..." />}>
              <LazyParticleFieldDemo />
            </Suspense>
          }
        />
        <Route
          path="/particle-field/settings"
          element={
            <Suspense fallback={<LoadingFallback message="加载粒子海洋设置页面中..." />}>
              <LazyParticleFieldSettings />
            </Suspense>
          }
        />
        </Routes>
      </SmartPageTransition>
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
              <div className="min-h-screen relative theme-transition" id="main-content">
                {/* 动态背景 */}
                <AnimatedBackground />
                
                {/* 跳转链接 */}
                <a href="#main-content" className="skip-link">
                  Skip to main content
                </a>
                
                {/* 性能监控已简化 */}
                {/* HeaderASCII 已移动到 Navbar 中 */}
                <Navbar />
                <AnimatedRoutes />
                <Footer />
                
                {/* 聊天助手 */}
                <ChatAssistant />
                
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
