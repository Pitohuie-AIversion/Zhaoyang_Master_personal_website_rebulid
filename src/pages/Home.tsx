import { memo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { HomeSEO } from '../components/seo/SEOOptimization';
import { ResponsiveContainer } from '../components/common/ResponsiveEnhancements';
import { useTranslation } from '../components/common/TranslationProvider';
import { SimpleMotion } from '../components/animations/SimpleMotion';
import { ScrollReveal } from '../components/animations/InteractiveEffects';
import Timeline from '../components/common/Timeline';
import {
  HomeHero,
  HomeResearchHighlights,
  HomeLatestNews,
  HomeCollaborationCTA,
  getResearchHighlights,
  getNewsItems,
  getTimelineItems,
  type TranslationFn
} from '../components/features/home';

function Home() {
  const { t, language } = useTranslation();
  const translate = t as TranslationFn;

  const researchHighlights = getResearchHighlights(translate);
  const newsItems = getNewsItems(translate);
  const timelineItems = getTimelineItems(translate);

  return (
    <div className="min-h-screen relative theme-transition">
      <HomeSEO />

      {/* 1. Hero Section */}
      <HomeHero t={translate} />

      {/* 2. Main Content - Split Layout (Research Highlights & Latest News) */}
      <section className="py-16 bg-white dark:bg-gray-900 theme-transition">
        <ResponsiveContainer maxWidth="xl" padding="lg">
          <div className="grid lg:grid-cols-12 gap-12">
            <HomeResearchHighlights researchHighlights={researchHighlights} t={translate} />
            <HomeLatestNews newsItems={newsItems} t={translate} />
          </div>
        </ResponsiveContainer>
      </section>

      {/* 3. Full Width Timeline Section (Academic Journey) */}
      <section className="py-16 bg-gray-50 dark:bg-black/20 border-t border-gray-200 dark:border-gray-800">
        <ResponsiveContainer maxWidth="xl" padding="lg">
          <SimpleMotion
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {t('home.timeline.title') as string}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t('home.timeline.description') as string}
            </p>
          </SimpleMotion>

          <ScrollReveal direction="up" delay={0.2}>
            <Timeline
              items={timelineItems}
              maxItems={6}
              showFilters={false}
            />
          </ScrollReveal>

          <div className="text-center mt-10">
            <Link
              to="/research"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-5 py-3 font-semibold text-primary-dark transition hover:border-blue-500 hover:text-blue-600 dark:border-gray-700"
            >
              {t('common.viewAll') as string}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </ResponsiveContainer>
      </section>

      {/* 4. Collaboration Call-to-Action Section */}
      <HomeCollaborationCTA t={translate} language={language} />
    </div>
  );
}

export default memo(Home);
