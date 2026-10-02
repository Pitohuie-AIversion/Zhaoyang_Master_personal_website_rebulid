import { Suspense } from 'react';
import { GlobalOptimizationManager } from './components/common/GlobalOptimizationManager';
import { ThemeProvider, ThemeTransition } from './components/common/DarkModeProvider';
import { useTranslation } from './components/common/TranslationProvider';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AnimatedBackground from './components/features/home/AnimatedBackground';
import { AccessibilityManager, AccessibilityToolbar } from './components/layout/AccessibilityEnhancements';
import { StructuredDataSEO } from './components/seo/StructuredDataSEO';
import { GoogleAnalytics } from './components/seo/GoogleAnalytics';
import { AppRoutes, LazyChatAssistant } from './routes';
import './styles/accessibility.css';
import './styles/animations.css';

function App() {
  const { t } = useTranslation();
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <GlobalOptimizationManager>
          <GoogleAnalytics />
          <AccessibilityManager>
            <ThemeTransition>
              <div className="min-h-screen relative theme-transition">
                {/* 动态背景 */}
                <AnimatedBackground />

                {/* 跳转链接 */}
                <a href="#main-content" className="skip-link">
                  {t('common.skipToMain')}
                </a>

                {/* 头部导航 */}
                <Navbar />
                <main id="main-content" tabIndex={-1} className="min-h-[calc(100vh-4rem)]">
                  <AppRoutes />
                </main>
                <Footer />

                {/* 聊天助手 */}
                <Suspense fallback={null}>
                  <LazyChatAssistant />
                </Suspense>

                {/* 可访问性工具栏 */}
                <AccessibilityToolbar />

                {/* 结构化数据SEO */}
                <StructuredDataSEO
                  type="person"
                  data={{
                    name: t('seo.site.author'),
                    alternateName: t('seo.site.author') === '牟昭阳' ? 'Zhaoyang Mu' : '牟昭阳',
                    jobTitle: t('home.hero.title'),
                    affiliation: {
                      name: t('seo.default.organization')
                    },
                    url: 'https://www.zhaoyangmu.cloud/',
                    image: 'https://www.zhaoyangmu.cloud/favicon.svg',
                    sameAs: [
                      "https://scholar.google.com/citations?user=T3AV5RgAAAAJ",
                      "https://www.linkedin.com/in/zhaoyang-mou/",
                      "https://github.com/Pitohuie",
                      "https://www.researchgate.net/profile/Zhaoyang-Mou"
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

export default App;
