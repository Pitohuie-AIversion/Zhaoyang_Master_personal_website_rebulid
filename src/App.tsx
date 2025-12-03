import React, { Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useTranslation } from './components/TranslationProvider';
import { GlobalOptimizationManager } from './components/GlobalOptimizationManager';
import { ThemeProvider } from './components/DarkModeProvider';
import { TranslationProvider, useTranslation } from './components/TranslationProvider';
import { ErrorBoundary } from './components/ErrorBoundary';
import { SmartPageTransition } from './components/PageTransitions';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AnimatedBackground from './components/AnimatedBackground';
// import HeaderASCII from './components/HeaderASCII'; // 已移动到 Navbar 中
import { AccessibilityManager, AccessibilityToolbar } from './components/AccessibilityEnhancements';
import { ThemeTransition } from './components/DarkModeProvider';
import ChatAssistant from './components/ChatAssistant';
import { StructuredDataSEO } from './components/StructuredDataSEO';
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

// 联系信息管理页面
const LazyContactViewer = React.lazy(() => import('./pages/ContactViewer'));

// 博客页面
const LazyBlogPage = React.lazy(() => import('./pages/BlogPage'));
const LazyBlogPost = React.lazy(() => import('./components/BlogPost'));

// 简历管理页面
const LazyResumeManager = React.lazy(() => import('./components/ResumeManager'));
const LazyNotFound = React.lazy(() => import('./pages/NotFound'));

function AnimatedRoutes() {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <SmartPageTransition>
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <Suspense fallback={<LoadingFallback message={t('common.loading') as string} />}>
              <LazyHome />
            </Suspense>
          }
        />
        <Route
          path="/research"
          element={
            <Suspense fallback={<LoadingFallback message={t('common.loading') as string} />}>
              <LazyResearch />
            </Suspense>
          }
        />
        <Route
          path="/projects"
          element={
            <Suspense fallback={<LoadingFallback message={t('common.loading') as string} />}>
              <LazyProjects />
            </Suspense>
          }
        />
        <Route
          path="/publications"
          element={
            <Suspense fallback={<LoadingFallback message={t('common.loading') as string} />}>
              <LazyPublications />
            </Suspense>
          }
        />
        <Route
          path="/skills"
          element={
            <Suspense fallback={<LoadingFallback message={t('common.loading') as string} />}>
              <LazySkills />
            </Suspense>
          }
        />
        <Route
          path="/contact"
          element={
            <Suspense fallback={<LoadingFallback message={t('common.loading') as string} />}>
              <LazyContact />
            </Suspense>
          }
        />
        <Route
          path="/ascii-demo"
          element={
            <Suspense fallback={<LoadingFallback message={t('common.loading') as string} />}>
              <LazyASCIIDemo />
            </Suspense>
          }
        />
        <Route
          path="/particle-field"
          element={
            <Suspense fallback={<LoadingFallback message={t('common.loading') as string} />}>
              <LazyParticleField />
            </Suspense>
          }
        />
        <Route
          path="/particle-field/demo"
          element={
            <Suspense fallback={<LoadingFallback message={t('common.loading') as string} />}>
              <LazyParticleFieldDemo />
            </Suspense>
          }
        />
        <Route
          path="/particle-field/settings"
          element={
            <Suspense fallback={<LoadingFallback message={t('common.loading') as string} />}>
              <LazyParticleFieldSettings />
            </Suspense>
          }
        />
        <Route
          path="/contact-admin"
          element={
            <Suspense fallback={<LoadingFallback message={t('common.loading') as string} />}>
              <LazyContactViewer />
            </Suspense>
          }
        />
        <Route
          path="/blog"
          element={
            <Suspense fallback={<LoadingFallback message={t('common.loading') as string} />}>
              <LazyBlogPage />
            </Suspense>
          }
        />
        <Route
          path="/blog/:slug"
          element={
            <Suspense fallback={<LoadingFallback message={t('common.loading') as string} />}>
              <LazyBlogPost />
            </Suspense>
          }
        />
        <Route
          path="/resume-manager"
          element={
            <Suspense fallback={<LoadingFallback message={t('common.loading') as string} />}>
              <LazyResumeManager />
            </Suspense>
          }
        />
        <Route
          path="*"
          element={
            <Suspense fallback={<LoadingFallback message={t('common.loading') as string} />}>
              <LazyNotFound />
            </Suspense>
          }
        />
        </Routes>
      </SmartPageTransition>
  );
}

function App() {
  const { t } = useTranslation();
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
                  {t('common.skipToMain')}
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
                
                {/* 结构化数据SEO */}
                <StructuredDataSEO 
                  type="person"
                  data={{
                    name: "牟昭阳",
                    alternateName: "Zhaoyang Mu",
                    jobTitle: "研究员",
                    affiliation: {
                      name: "学术研究机构",
                      url: "https://example-institution.com"
                    },
                    url: window.location.origin,
                    sameAs: [
                      "https://scholar.google.com/citations?user=zhaoyang_mu",
                      "https://orcid.org/0000-0000-0000-0000",
                      "https://linkedin.com/in/zhaoyang-mu"
                    ],
                    knowsAbout: [
                      "人工智能",
                      "机器学习", 
                      "深度学习",
                      "计算机视觉",
                      "自然语言处理"
                    ],
                    alumniOf: {
                      name: "顶尖大学",
                      degree: "博士"
                    }
                  }}
                />
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
