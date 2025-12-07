import React, { Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { GlobalOptimizationManager } from './components/common/GlobalOptimizationManager';
import { ThemeProvider } from './components/common/DarkModeProvider';
import { useTranslation } from './components/common/TranslationProvider';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { SmartPageTransition } from './components/animations/PageTransitions';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AnimatedBackground from './components/features/home/AnimatedBackground';
// import HeaderASCII from './components/layout/HeaderASCII'; // 已移动到 Navbar 中
import { AccessibilityManager, AccessibilityToolbar } from './components/layout/AccessibilityEnhancements';
import { ThemeTransition } from './components/common/DarkModeProvider';
import ChatAssistant from './components/features/chat/ChatAssistant';
import { StructuredDataSEO } from './components/seo/StructuredDataSEO';
import { GoogleAnalytics } from './components/seo/GoogleAnalytics';
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
} from './components/common/PerformanceOptimization';

// Lazy load Particle Field pages
const LazyParticleField = React.lazy(() => import('./pages/ParticleField'));
const LazyParticleFieldDemo = React.lazy(() => import('./pages/ParticleFieldDemo'));
const LazyParticleFieldSettings = React.lazy(() => import('./pages/ParticleFieldSettings'));

// 联系信息管理页面
const LazyContactViewer = React.lazy(() => import('./pages/ContactViewer'));

// 博客页面
const LazyBlogPage = React.lazy(() => import('./pages/BlogPage'));
const LazyBlogPost = React.lazy(() => import('./components/features/blog/BlogPost'));

// 简历管理页面
const LazyResumeManager = React.lazy(() => import('./components/features/resume/ResumeManager'));
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
        <GlobalOptimizationManager>
          <GoogleAnalytics />
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
                    name: t('seo.site.author'),
                    alternateName: t('seo.site.author') === '牟昭阳' ? 'Zhaoyang Mu' : '牟昭阳',
                    jobTitle: t('home.hero.title'),
                    affiliation: {
                      name: t('seo.default.organization'),
                      url: "https://example-institution.com"
                    },
                    url: window.location.origin,
                    sameAs: [
                      "https://scholar.google.com/citations?user=zhaoyang_mu",
                      "https://orcid.org/0000-0000-0000-0000",
                      "https://linkedin.com/in/zhaoyang-mu"
                    ],
                    knowsAbout: [
                      t('skills.categories.aiMl'),
                      t('skills.categories.programming'),
                      t('skills.categories.simulation'),
                      t('research.areas.scientificComputing.keywords.0'),
                      t('research.areas.scientificComputing.keywords.1')
                    ],
                    alumniOf: {
                      name: t('education.educationItems.master.school'),
                      degree: t('education.educationItems.master.degree')
                    }
                  }}
                />
              </div>
            </ThemeTransition>
          </AccessibilityManager>
        </GlobalOptimizationManager>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App
