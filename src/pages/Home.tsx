import { SimpleMotion } from '../components/SimpleMotion';
import { useState, useEffect, memo } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Download } from 'lucide-react';
import PixelRhythm from '../components/PixelRhythm';
import TraeASCIIBackground from '../components/TraeASCIIBackground';
import ZhaoyangASCIIText from '../components/ZhaoyangASCIIText';
import ZhaoyangASCIIRhythm from '../components/ZhaoyangASCIIRhythm';
import { PageLoader, ResearchHighlightSkeleton, NewsItemSkeleton, StatSkeleton, usePageLoading, LazyWrapper } from '../components/LoadingComponents';
import LazyImage from '../components/LazyImage';
import { HoverCard, ScrollReveal } from '../components/InteractiveEffects';
// 移除复杂动画组件导入
import { HomeSEO } from '../components/SEOOptimization';
import { useResponsive, ResponsiveText, ResponsiveImage, ResponsiveCard, ResponsiveSpacing, ResponsiveContainer, ResponsiveGrid } from '../components/ResponsiveEnhancements';
import { MobileButton } from '../components/ResponsiveContainer';
import { useTranslation } from '../components/TranslationProvider';
import { UnifiedButton } from '../components/UnifiedButton';
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

const getResearchHighlights = (t: (key: string, options?: { returnObjects?: boolean; fallback?: string }) => any): ResearchHighlight[] => [
  {
    id: '1',
    title: t('home.researchHighlights.items.damformer.title'),
    description: t('home.researchHighlights.items.damformer.description'),
    image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=dam%20break%20simulation%20transformer%20model%20cross%20geometry%20generalization%20computational%20fluid%20dynamics%20scientific%20visualization&image_size=landscape_4_3',
    category: t('home.researchHighlights.items.damformer.category'),
    link: '/projects'
  },
  {
    id: '2',
    title: t('home.researchHighlights.items.sparseDense.title'),
    description: t('home.researchHighlights.items.sparseDense.description'),
    image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=sparse%20to%20dense%20field%20reconstruction%20transformer%20CFD%20environmental%20flow%20sensor%20data%20visualization&image_size=landscape_4_3',
    category: t('home.researchHighlights.items.sparseDense.category'),
    link: '/projects'
  },
  {
    id: '3',
    title: t('home.researchHighlights.items.bionicFin.title'),
    description: t('home.researchHighlights.items.bionicFin.description'),
    image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=biomimetic%20undulating%20fin%20propulsion%20simulation%20CFD%20FSI%20underwater%20robot%20blue%20ocean%20theme&image_size=landscape_4_3',
    category: t('home.researchHighlights.items.bionicFin.category'),
    link: '/projects'
  }
];

const getNewsItems = (t: (key: string, options?: { returnObjects?: boolean; fallback?: string }) => any): NewsItem[] => [
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

const getStats = (t: (key: string, options?: { returnObjects?: boolean; fallback?: string }) => any) => [
  { label: t('home.stats.publications'), value: '10+', icon: '📄' },
  { label: t('home.stats.projects'), value: '5', icon: '🔬' },
  { label: t('home.stats.patents'), value: '8', icon: '💡' },
  { label: t('home.stats.awards'), value: '3+', icon: '🏆' }
];

function Home() {
  const [currentHighlight, setCurrentHighlight] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const { isLoading } = usePageLoading(true);
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const { t, language } = useTranslation();

  // Get translated data
  const researchHighlights = getResearchHighlights(t);
  const newsItems = getNewsItems(t);
  const stats = getStats(t);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentHighlight((prev) => (prev + 1) % researchHighlights.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handleHighlightChange = (index: number) => {
    setCurrentHighlight(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen relative theme-transition">
      <HomeSEO />
      {/* Hero Section */}
      <section className="relative overflow-hidden pb-16 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900 theme-transition" style={{ paddingTop: isMobile ? '120px' : isTablet ? '140px' : '160px' }}>
        {/* 简化的背景装饰 */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-100/50 dark:from-gray-900/50 dark:to-blue-900/50" />
        <ResponsiveContainer maxWidth="xl" padding="lg" className="relative z-30">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <SimpleMotion
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <ScrollReveal direction="up" delay={0.2}>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary-dark theme-transition mb-4 leading-tight break-words">
                  {t('home.hero.name')}
                  <ResponsiveText
                    as="span"
                    className="block text-secondary-dark theme-transition font-normal mt-2"
                    preset="card-title"
                  >
                    {t('home.hero.nameEn')}
                  </ResponsiveText>
                </h1>
              </ScrollReveal>
              <ScrollReveal direction="up" delay={0.6}>
                <p className="text-base md:text-lg lg:text-xl text-secondary-dark theme-transition mb-6 leading-loose break-words hyphens-auto">
                  {t('home.hero.description')}
                </p>
              </ScrollReveal>
              <div className="flex flex-wrap gap-2 sm:gap-3 mb-8">
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm font-medium">
                  {t('home.hero.tags.transformerNeuralOperator')}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm font-medium">
                  {t('home.hero.tags.cfdSimulation')}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm font-medium">
                  {t('home.hero.tags.underwaterRobotics')}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm font-medium">
                  {t('home.hero.tags.bionicPerception')}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm font-medium">
                  {t('home.hero.tags.mechanicalDesign')}
                </span>
              </div>
              <ScrollReveal direction="up" delay={0.8}>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  <Link to="/research" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                    {t('home.hero.buttons.research')}
                  </Link>
                  <Link to="/projects" className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200">
                    {t('home.hero.buttons.projects')}
                  </Link>
                </div>
              </ScrollReveal>
            </SimpleMotion>
            
            <SimpleMotion
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <LazyImage
                src={profileImage}
                alt="牟昭阳"
                className="mx-auto rounded-lg border border-gray-200 w-48 h-48 md:w-60 md:h-60 lg:w-80 lg:h-80"
              />
            </SimpleMotion>
          </div>
        </ResponsiveContainer>
        
        {/* 背景装饰 */}
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" className="text-blue-600" />
          </svg>
        </div>
      </section>

      {/* 研究亮点 */}
      <section className="py-16 bg-primary-dark theme-transition">
        <ResponsiveContainer maxWidth="xl" padding="lg">
          <SimpleMotion
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-primary-dark theme-transition mb-4 leading-tight">
              {t('home.researchHighlights.title')}
            </h2>
            <ResponsiveText
              as="p"
              className="text-secondary-dark theme-transition max-w-2xl mx-auto"
              preset="body"
            >
              {t('home.researchHighlights.description')}
            </ResponsiveText>
          </SimpleMotion>

          <div className="relative max-w-5xl mx-auto">
            <LazyWrapper fallback={<ResearchHighlightSkeleton />}>
              <ResponsiveCard
                key={currentHighlight}
                className="border border-primary-dark theme-transition"
                padding={{
                  mobile: 'p-4',
                  tablet: 'p-6',
                  desktop: 'p-6'
                }}
              >
                <SimpleMotion
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className={`grid ${isDesktop ? 'lg:grid-cols-2' : 'grid-cols-1'} gap-6 lg:gap-8 items-center`}>
                    <div>
                      <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-primary-dark theme-transition mb-3 leading-tight">
                        {researchHighlights[currentHighlight].title}
                      </h3>
                      <p className="text-sm md:text-base lg:text-lg text-secondary-dark theme-transition mb-4 leading-relaxed">
                        {researchHighlights[currentHighlight].description}
                      </p>
                      <div className="flex flex-wrap gap-2 sm:gap-3">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                          {researchHighlights[currentHighlight].category}
                        </span>
                      </div>
                    </div>
                    <div className="relative">
                       <LazyImage
                         src={researchHighlights[currentHighlight].image}
                         alt={researchHighlights[currentHighlight].title}
                         className={`w-full ${isMobile ? 'h-32' : 'h-48'} rounded-lg`}
                       />
                     </div>
                  </div>
                </SimpleMotion>
              </ResponsiveCard>
            </LazyWrapper>
            
            {/* 轮播指示器 */}
            <div className="flex justify-center mt-6 space-x-2">
              {researchHighlights.map((_, index) => (
                <UnifiedButton
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleHighlightChange(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 p-0 min-w-0 ${
                    index === currentHighlight
                      ? 'bg-gray-900 w-6'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </ResponsiveContainer>
      </section>

      {/* 最新动态 */}
      <section className="py-16 bg-white">
        <ResponsiveContainer maxWidth="xl" padding="lg">
          <SimpleMotion
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <ResponsiveText
              as="h2"
              className="font-bold text-gray-900 mb-4"
              preset="section-title"
            >
              {t('home.latestNews.title')}
            </ResponsiveText>
            <ResponsiveText
              as="p"
              className="text-gray-600 max-w-2xl mx-auto"
              preset="body"
            >
              {t('home.latestNews.description')}
            </ResponsiveText>
          </SimpleMotion>

          <ResponsiveGrid cols={{ mobile: 1, tablet: 2, desktop: 3 }} gap="md">
             {newsItems.map((item, index) => (
               <LazyWrapper key={item.id} fallback={<NewsItemSkeleton />}>
                 <ScrollReveal direction="up" delay={index * 0.1}>
                   <HoverCard className="h-full">
                     <ResponsiveCard
                       className="h-full border border-gray-200 dark:border-gray-700 theme-transition hover:shadow-lg transition-shadow duration-200"
                       padding="md"
                       hover={true}
                     >
                           <div className="flex items-center mb-4">
                             <ResponsiveText
                               as="span"
                               className="text-secondary-dark theme-transition font-medium"
                               sizes={{
                                 mobile: 'text-xs leading-relaxed',
                                 tablet: 'text-sm leading-relaxed',
                                 desktop: 'text-sm leading-relaxed'
                               }}
                             >
                               {item.date}
                             </ResponsiveText>
                           </div>
                           <ResponsiveText
                             as="h3"
                             className="font-semibold text-primary-dark theme-transition mb-3 leading-snug break-words hyphens-auto"
                             sizes={{
                               mobile: 'text-base leading-snug',
                               tablet: 'text-lg leading-snug',
                               desktop: 'text-lg leading-snug'
                             }}
                           >
                             {item.title}
                           </ResponsiveText>
                           <ResponsiveText
                             as="p"
                             className="text-secondary-dark theme-transition leading-loose break-words hyphens-auto"
                             sizes={{
                               mobile: 'text-xs leading-loose',
                               tablet: 'text-sm leading-loose',
                               desktop: 'text-sm leading-loose'
                             }}
                           >
                             {item.description}
                           </ResponsiveText>
                     </ResponsiveCard>
                   </HoverCard>
                 </ScrollReveal>
               </LazyWrapper>
             ))}
           </ResponsiveGrid>
            
          <div className="text-center mt-12">
            <Link to="/publications">
              <UnifiedButton
                variant="primary"
                size="md"
                icon={(
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                )}
                iconPosition="right"
              >
                {t('home.viewMoreAchievements')}
              </UnifiedButton>
            </Link>
          </div>
        </ResponsiveContainer>
      </section>

      {/* 统计数据 */}
      <section className="py-16 bg-gray-900 text-white">
        <ResponsiveContainer maxWidth="xl" padding="lg">
          <SimpleMotion
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">{t('home.researchAchievements')}</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              {t('home.achievementsDesc')}
            </p>
          </SimpleMotion>

          <ResponsiveGrid cols={{ mobile: 2, desktop: 4 }} gap="lg">
             {stats.map((stat, index) => (
               <LazyWrapper key={stat.label} fallback={<StatSkeleton />}>
                 <ScrollReveal direction="up" delay={index * 0.1}>
                   <HoverCard className="text-center">
                     <ResponsiveCard
                       padding={{
                         mobile: 'p-4',
                         tablet: 'p-6',
                         desktop: 'p-6'
                       }}
                     >
                       <ResponsiveText
                         as="div"
                         className="mb-2"
                         sizes={{
                           mobile: 'text-2xl leading-tight',
                           tablet: 'text-3xl leading-tight',
                           desktop: 'text-4xl leading-tight'
                         }}
                       >
                         {stat.icon}
                       </ResponsiveText>
                       <ResponsiveText
                         as="div"
                         className="font-bold mb-2"
                         sizes={{
                           mobile: 'text-2xl leading-tight',
                           tablet: 'text-3xl leading-tight',
                           desktop: 'text-4xl leading-tight'
                         }}
                       >
                         {stat.value}
                       </ResponsiveText>
                       <ResponsiveText
                         as="div"
                         className="text-gray-300"
                         sizes={{
                           mobile: 'text-sm leading-relaxed',
                           tablet: 'text-base leading-relaxed',
                           desktop: 'text-base leading-relaxed'
                         }}
                       >
                         {stat.label}
                       </ResponsiveText>
                     </ResponsiveCard>
                   </HoverCard>
                 </ScrollReveal>
               </LazyWrapper>
             ))}
           </ResponsiveGrid>
        </ResponsiveContainer>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white dark:bg-gray-900 theme-transition">
        <ResponsiveContainer maxWidth="2xl" className="text-center">
          <SimpleMotion
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ResponsiveText
              as="h2"
              className="font-bold text-primary-dark theme-transition mb-4"
              sizes={{
                mobile: 'text-2xl leading-tight',
                tablet: 'text-3xl leading-tight',
                desktop: 'text-4xl leading-tight'
              }}
            >
              {t('home.startCollaboration')}
            </ResponsiveText>
            <ResponsiveText
              as="p"
              className="text-secondary-dark theme-transition mb-8 max-w-xl mx-auto"
              sizes={{
                mobile: 'text-base leading-relaxed',
                tablet: 'text-lg leading-relaxed',
                desktop: 'text-lg leading-relaxed'
              }}
            >
              {t('home.collaborationDesc')}
            </ResponsiveText>
            <ScrollReveal direction="up" delay={0.4}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact">
                  <UnifiedButton
                    variant="primary"
                    size="lg"
                    icon={Mail}
                    iconPosition="left"
                    className="shadow-lg hover:shadow-xl transition-shadow"
                  >
                    {t('home.contactMe')}
                  </UnifiedButton>
                </Link>
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <UnifiedButton
                    variant="outline"
                    size="lg"
                    icon={Download}
                    iconPosition="left"
                    className="shadow-lg hover:shadow-xl transition-shadow"
                  >
                    {t('home.downloadResume')}
                  </UnifiedButton>
                </a>
              </div>
            </ScrollReveal>
          </SimpleMotion>
        </ResponsiveContainer>
      </section>
    </div>
  );
}

export default memo(Home);