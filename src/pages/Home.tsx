import { SimpleMotion } from '../components/animations/SimpleMotion';
import { useState, memo } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Download, ArrowRight, Calendar, Trophy, FileText, Folder } from 'lucide-react';
import { PageLoader, ResearchHighlightSkeleton, NewsItemSkeleton, StatSkeleton, usePageLoading, LazyWrapper } from '../components/common/LoadingComponents';
import LazyImage from '../components/common/LazyImage';
import { HomeSEO } from '../components/seo/SEOOptimization';
import { useResponsive, ResponsiveText, ResponsiveCard, ResponsiveContainer, ResponsiveGrid } from '../components/common/ResponsiveEnhancements';
import { useTranslation } from '../components/common/TranslationProvider';
import { UnifiedButton } from '../components/common/UnifiedButton';
import { ScrollReveal, HoverCard } from '../components/animations/InteractiveEffects';
import Timeline from '../components/common/Timeline';
import profileImage from '../assets/me_Nero_AI_Image_Upscaler_Photo_Face.jpeg';

interface ResearchHighlight {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  link: string;
}

interface NewsItem {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'publication' | 'award' | 'conference' | 'project';
}

const getResearchHighlights = (t: (key: string, options?: { returnObjects?: boolean; fallback?: string }) => string): ResearchHighlight[] => [
  {
    id: '1',
    title: t('home.researchHighlights.items.damformer.title'),
    description: t('home.researchHighlights.items.damformer.description'),
    image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=dam%20break%20simulation%20transformer%20model%20cross%20geometry%20generalization%20computational%20fluid%20dynamics%20scientific%20visualization&image_size=landscape_4_3',
    category: t('home.researchHighlights.items.damformer.category'),
    link: '/research'
  },
  {
    id: '2',
    title: t('home.researchHighlights.items.sparseDense.title'),
    description: t('home.researchHighlights.items.sparseDense.description'),
    image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=sparse%20to%20dense%20field%20reconstruction%20transformer%20CFD%20environmental%20flow%20sensor%20data%20visualization&image_size=landscape_4_3',
    category: t('home.researchHighlights.items.sparseDense.category'),
    link: '/research'
  },
  {
    id: '3',
    title: t('home.researchHighlights.items.bionicFin.title'),
    description: t('home.researchHighlights.items.bionicFin.description'),
    image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=biomimetic%20undulating%20fin%20propulsion%20simulation%20CFD%20FSI%20underwater%20robot%20blue%20ocean%20theme&image_size=landscape_4_3',
    category: t('home.researchHighlights.items.bionicFin.category'),
    link: '/research'
  }
];

const getNewsItems = (t: (key: string, options?: { returnObjects?: boolean; fallback?: string }) => string): NewsItem[] => [
  {
    id: '1',
    date: '2025-01',
    title: t('home.latestNews.items.damformerPaper.title'),
    description: t('home.latestNews.items.damformerPaper.description'),
    type: 'publication'
  },
  {
    id: '2',
    date: '2025-01',
    title: t('home.latestNews.items.rsModCubes.title'),
    description: t('home.latestNews.items.rsModCubes.description'),
    type: 'publication'
  },
  {
    id: '3',
    date: '2024-11',
    title: t('home.latestNews.items.underwaterPatents.title'),
    description: t('home.latestNews.items.underwaterPatents.description'),
    type: 'award'
  },
  {
    id: '4',
    date: '2024-07',
    title: t('home.latestNews.items.mechanicalCompetition.title'),
    description: t('home.latestNews.items.mechanicalCompetition.description'),
    type: 'award'
  },
  {
    id: '5',
    date: '2024-06',
    title: t('home.latestNews.items.westlakeVisit.title'),
    description: t('home.latestNews.items.westlakeVisit.description'),
    type: 'project'
  }
];

const getStats = (t: (key: string, options?: { returnObjects?: boolean; fallback?: string }) => string) => [
  { label: t('home.stats.publications'), value: '10', icon: '📄' },
  { label: t('home.stats.projects'), value: '6', icon: '🔬' },
  { label: t('home.stats.patents'), value: '6', icon: '💡' },
  { label: t('home.stats.awards'), value: '4', icon: '🏆' }
];

// Icon mapping for news types
const NewsIcon = ({ type }: { type: NewsItem['type'] }) => {
  switch (type) {
    case 'publication': return <FileText className="w-4 h-4 text-blue-500" />;
    case 'award': return <Trophy className="w-4 h-4 text-yellow-500" />;
    case 'project': return <Folder className="w-4 h-4 text-green-500" />;
    default: return <Calendar className="w-4 h-4 text-gray-500" />;
  }
};

function Home() {
  const { isLoading } = usePageLoading(true);
  const { isMobile, isTablet } = useResponsive();
  const { t, language } = useTranslation();

  // Get translated data
  const researchHighlights = getResearchHighlights(t as (key: string, options?: { returnObjects?: boolean; fallback?: string }) => string);
  const newsItems = getNewsItems(t as (key: string, options?: { returnObjects?: boolean; fallback?: string }) => string);
  const stats = getStats(t as (key: string, options?: { returnObjects?: boolean; fallback?: string }) => string);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen relative theme-transition">
      <HomeSEO />
      
      {/* 1. Hero Section - Strong F-Pattern Top Bar */}
      <section className="relative overflow-hidden pb-16 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900 theme-transition" style={{ paddingTop: isMobile ? '120px' : isTablet ? '140px' : '160px' }}>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-100/50 dark:from-gray-900/50 dark:to-blue-900/50" />
        <ResponsiveContainer maxWidth="xl" padding="lg" className="relative z-30">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Text Content - Spans 7 columns - Primary Focus */}
            <div className="lg:col-span-7 order-2 lg:order-1">
              <SimpleMotion
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <ScrollReveal direction="up" delay={0.2}>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-dark theme-transition mb-4 leading-tight break-words">
                    {t('home.hero.name') as string}
                    <span className="block text-2xl md:text-3xl lg:text-4xl text-secondary-dark theme-transition font-normal mt-2">
                      {t('home.hero.nameEn') as string}
                    </span>
                  </h1>
                </ScrollReveal>
                
                <ScrollReveal direction="up" delay={0.4}>
                  <h2 className="text-xl md:text-2xl text-blue-600 dark:text-blue-400 font-medium mb-6">
                    {t('home.hero.title') as string}
                  </h2>
                </ScrollReveal>

                <ScrollReveal direction="up" delay={0.6}>
                  <p className="text-base md:text-lg text-secondary-dark theme-transition mb-8 leading-loose max-w-2xl">
                    {t('home.hero.description') as string}
                  </p>
                </ScrollReveal>
                
                {/* Tags as visual anchors */}
                <div className="flex flex-wrap gap-2 sm:gap-3 mb-10">
                  {[
                    'transformerNeuralOperator',
                    'cfdSimulation',
                    'underwaterRobotics',
                    'bionicPerception',
                    'mechanicalDesign'
                  ].map((tagKey) => (
                    <span key={tagKey} className="px-3 py-1 bg-white/60 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium backdrop-blur-sm">
                      {t(`home.hero.tags.${tagKey}`) as string}
                    </span>
                  ))}
                </div>

                <ScrollReveal direction="up" delay={0.8}>
                  <div className="flex flex-wrap gap-4">
                    <Link to="/research">
                      <UnifiedButton variant="primary" size="lg" icon={ArrowRight} iconPosition="right">
                        {t('home.hero.buttons.research') as string}
                      </UnifiedButton>
                    </Link>
                    <Link to="/projects">
                      <UnifiedButton variant="outline" size="lg">
                        {t('home.hero.buttons.projects') as string}
                      </UnifiedButton>
                    </Link>
                  </div>
                </ScrollReveal>
              </SimpleMotion>
            </div>
            
            {/* Image - Spans 5 columns - Secondary Anchor */}
            <div className="lg:col-span-5 order-1 lg:order-2 flex justify-center lg:justify-end">
              <SimpleMotion
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-600 rounded-2xl rotate-6 opacity-20 blur-sm"></div>
                  <LazyImage
                    src={profileImage}
                    alt={t('home.hero.name') as string}
                    className="relative rounded-2xl shadow-2xl border-4 border-white dark:border-gray-800 w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 object-cover z-10"
                  />
                </div>
              </SimpleMotion>
            </div>
          </div>
        </ResponsiveContainer>
        
        {/* Background Grid Decoration */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-[0.03] pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
                <path d="M 8 0 L 0 0 0 8" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" className="text-blue-900 dark:text-white" />
          </svg>
        </div>
      </section>

      {/* 2. Main Content - Split F-Pattern Layout */}
      <section className="py-16 bg-white dark:bg-gray-900 theme-transition">
        <ResponsiveContainer maxWidth="xl" padding="lg">
          <div className="grid lg:grid-cols-12 gap-12">
            
            {/* Left Column (Main Content) - Research Highlights - Spans 8 cols */}
            <div className="lg:col-span-8">
              <SimpleMotion
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8 flex items-end justify-between border-b border-gray-200 dark:border-gray-700 pb-4"
              >
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-primary-dark theme-transition">
                    {t('home.researchHighlights.title') as string}
                  </h2>
                  <p className="text-secondary-dark theme-transition mt-2 text-sm md:text-base">
                    {t('home.researchHighlights.description') as string}
                  </p>
                </div>
                <Link to="/research" className="hidden md:flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors">
                  {t('common.viewAll') as string} <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </SimpleMotion>

              <div className="space-y-8">
                {researchHighlights.map((item, index) => (
                  <LazyWrapper key={item.id} fallback={<ResearchHighlightSkeleton />}>
                    <ScrollReveal direction="up" delay={index * 0.1}>
                      <HoverCard>
                        <ResponsiveCard 
                          className="group overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors duration-300"
                          padding="none"
                        >
                          <div className="grid md:grid-cols-5 gap-0">
                            {/* Image Section */}
                            <div className="md:col-span-2 relative h-48 md:h-auto overflow-hidden">
                              <LazyImage
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                              <div className="absolute top-3 left-3">
                                <span className="px-2 py-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-xs font-semibold text-blue-600 dark:text-blue-400 rounded">
                                  {item.category}
                                </span>
                              </div>
                            </div>
                            
                            {/* Content Section */}
                            <div className="md:col-span-3 p-6 flex flex-col justify-center">
                              <Link to={item.link}>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                  {item.title}
                                </h3>
                              </Link>
                              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
                                {item.description}
                              </p>
                              <div className="mt-auto pt-4 flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
                                {t('common.readMore') || 'Read More'} <ArrowRight className="w-4 h-4 ml-1" />
                              </div>
                            </div>
                          </div>
                        </ResponsiveCard>
                      </HoverCard>
                    </ScrollReveal>
                  </LazyWrapper>
                ))}
              </div>
              
              <div className="mt-8 md:hidden text-center">
                <Link to="/research">
                  <UnifiedButton variant="outline" fullWidth>
                    {t('common.viewAll') as string}
                  </UnifiedButton>
                </Link>
              </div>
            </div>

            {/* Right Column (Sidebar) - Latest News - Spans 4 cols */}
            <div className="lg:col-span-4">
              <div className="sticky top-24">
                <SimpleMotion
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4"
                >
                  <h2 className="text-xl md:text-2xl font-bold text-primary-dark theme-transition">
                    {t('home.latestNews.title') as string}
                  </h2>
                </SimpleMotion>

                <div className="space-y-4">
                  {newsItems.map((item, index) => (
                    <LazyWrapper key={item.id} fallback={<NewsItemSkeleton />}>
                      <ScrollReveal direction="left" delay={0.3 + index * 0.1}>
                        <div className="group relative pl-6 border-l-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors duration-300 py-1">
                          <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-600 group-hover:bg-blue-500 transition-colors duration-300" />
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center">
                            <span className="font-mono">{item.date}</span>
                            <span className="mx-2">•</span>
                            <span className="flex items-center gap-1 capitalize">
                              <NewsIcon type={item.type} />
                              {item.type}
                            </span>
                          </div>
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug mb-1">
                            {item.title}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </ScrollReveal>
                    </LazyWrapper>
                  ))}
                </div>

                {/* Quick Stats in Sidebar */}
                <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                    {t('home.researchAchievements') as string}
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {stats.map((stat) => (
                      <div key={stat.label} className="text-center p-2">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stat.value}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </ResponsiveContainer>
      </section>

      {/* 3. Full Width Timeline Section (Bottom Anchor) */}
      <section className="py-16 bg-gray-50 dark:bg-black/20 border-t border-gray-200 dark:border-gray-800">
        <ResponsiveContainer maxWidth="xl" padding="lg">
          <SimpleMotion
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {t('home.timeline.title') || '学术历程'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t('home.timeline.description') || '展示我的学术和职业发展轨迹'}
            </p>
          </SimpleMotion>
          
          <ScrollReveal direction="up" delay={0.2}>
            <Timeline 
              maxItems={6}
              showFilters={false}
            />
          </ScrollReveal>
          
          <div className="text-center mt-10">
            <Link to="/about">
              <UnifiedButton variant="outline" icon={ArrowRight} iconPosition="right">
                {t('common.viewAll') || 'View Full Timeline'}
              </UnifiedButton>
            </Link>
          </div>
        </ResponsiveContainer>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 dark:bg-blue-900 theme-transition text-white">
        <ResponsiveContainer maxWidth="xl" className="text-center">
          <SimpleMotion
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {t('home.startCollaboration') as string}
            </h2>
            <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
              {t('home.collaborationDesc') as string}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <button className="px-8 py-4 bg-white text-blue-600 font-bold rounded-full shadow-lg hover:bg-blue-50 hover:scale-105 transition-all duration-300 flex items-center justify-center mx-auto sm:mx-0">
                  <Mail className="w-5 h-5 mr-2" />
                  {t('home.contactMe') as string}
                </button>
              </Link>
              <a
                href={language === 'zh' ? '/cn_resume.pdf' : '/en_resume.pdf'}
                target="_blank"
                rel="noopener noreferrer"
                download
              >
                <button className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition-all duration-300 flex items-center justify-center mx-auto sm:mx-0">
                  <Download className="w-5 h-5 mr-2" />
                  {t('home.downloadResume') as string}
                </button>
              </a>
            </div>
          </SimpleMotion>
        </ResponsiveContainer>
      </section>
    </div>
  );
}

export default memo(Home);
