import { SimpleMotion } from '../components/animations/SimpleMotion';
import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Download, ArrowRight, Calendar, Trophy, FileText, Folder, Waves, Network, Bot } from 'lucide-react';
import LazyImage from '../components/common/LazyImage';
import { HomeSEO } from '../components/seo/SEOOptimization';
import { ResponsiveCard, ResponsiveContainer } from '../components/common/ResponsiveEnhancements';
import { useTranslation } from '../components/common/TranslationProvider';
import { ScrollReveal, HoverCard } from '../components/animations/InteractiveEffects';
import Timeline from '../components/common/Timeline';
import profileImage from '../assets/me_Nero_AI_Image_Upscaler_Photo_Face.jpeg';

interface ResearchHighlight {
  id: string;
  title: string;
  description: string;
  visual: 'flow' | 'network' | 'robot';
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
    visual: 'flow',
    category: t('home.researchHighlights.items.damformer.category'),
    link: '/research'
  },
  {
    id: '2',
    title: t('home.researchHighlights.items.sparseDense.title'),
    description: t('home.researchHighlights.items.sparseDense.description'),
    visual: 'network',
    category: t('home.researchHighlights.items.sparseDense.category'),
    link: '/research'
  },
  {
    id: '3',
    title: t('home.researchHighlights.items.bionicFin.title'),
    description: t('home.researchHighlights.items.bionicFin.description'),
    visual: 'robot',
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
  { label: t('home.stats.publications'), value: '10+' },
  { label: t('home.stats.projects'), value: '6' },
  { label: t('home.stats.patents'), value: '8' },
  { label: t('home.stats.awards'), value: '4' }
];

const researchVisuals = {
  flow: {
    icon: Waves,
    gradient: 'from-blue-600 via-cyan-600 to-sky-400',
    accent: 'bg-cyan-200/30'
  },
  network: {
    icon: Network,
    gradient: 'from-indigo-700 via-blue-600 to-violet-500',
    accent: 'bg-violet-200/25'
  },
  robot: {
    icon: Bot,
    gradient: 'from-slate-800 via-blue-800 to-cyan-600',
    accent: 'bg-blue-200/25'
  }
} as const;

const ResearchVisual = ({ item, index }: { item: ResearchHighlight; index: number }) => {
  const visual = researchVisuals[item.visual];
  const Icon = visual.icon;

  return (
    <div
      className={`relative h-48 md:h-full min-h-48 overflow-hidden bg-gradient-to-br ${visual.gradient}`}
      aria-hidden="true"
    >
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.35) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
      <div className={`absolute -right-10 -top-12 h-40 w-40 rounded-full blur-2xl ${visual.accent}`} />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-white/25 bg-white/10 shadow-2xl backdrop-blur-md">
          <Icon className="h-10 w-10 text-white" strokeWidth={1.5} />
        </div>
      </div>
      <span className="absolute bottom-4 right-5 font-mono text-4xl font-semibold tracking-tighter text-white/25">
        0{index + 1}
      </span>
    </div>
  );
};

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
  const { t, language } = useTranslation();

  // Get translated data
  const researchHighlights = getResearchHighlights(t as (key: string, options?: { returnObjects?: boolean; fallback?: string }) => string);
  const newsItems = getNewsItems(t as (key: string, options?: { returnObjects?: boolean; fallback?: string }) => string);
  const stats = getStats(t as (key: string, options?: { returnObjects?: boolean; fallback?: string }) => string);

  return (
    <div className="min-h-screen relative theme-transition">
      <HomeSEO />

      {/* 1. Hero Section - Strong F-Pattern Top Bar */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pb-16 pt-28 dark:from-gray-950 dark:via-slate-950 dark:to-blue-950 sm:pt-32 lg:pb-24 lg:pt-36 theme-transition">
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent dark:from-blue-950/10" />
        <ResponsiveContainer maxWidth="xl" padding="md" className="relative z-30">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Text Content - Spans 7 columns - Primary Focus */}
            <div className="order-1 lg:col-span-7">
              <SimpleMotion
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <ScrollReveal direction="up" delay={0.2}>
                  <h1 className="mb-5 break-words text-4xl font-bold leading-[1.08] tracking-tight text-primary-dark theme-transition sm:text-5xl lg:text-6xl">
                    {t('home.hero.name') as string}
                    <span className="mt-2 block text-2xl font-medium tracking-normal text-secondary-dark theme-transition sm:text-3xl lg:text-4xl">
                      {t('home.hero.nameEn') as string}
                    </span>
                  </h1>
                </ScrollReveal>

                <ScrollReveal direction="up" delay={0.4}>
                  <h2 className="mb-6 max-w-2xl text-lg font-semibold leading-relaxed text-blue-700 dark:text-blue-300 sm:text-xl">
                    {t('home.hero.title') as string}
                  </h2>
                </ScrollReveal>

                <ScrollReveal direction="up" delay={0.6}>
                  <p className="mb-8 max-w-2xl text-base leading-8 text-secondary-dark theme-transition sm:text-lg">
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
                  <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <Link
                      to="/research"
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl focus-visible:outline-none"
                    >
                      {t('home.hero.buttons.research') as string}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      to="/projects"
                      className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-300 bg-white/60 px-6 py-3.5 font-semibold text-slate-800 backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-blue-400 hover:bg-white dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-100 dark:hover:border-blue-500 dark:hover:bg-slate-900 focus-visible:outline-none"
                    >
                      {t('home.hero.buttons.projects') as string}
                    </Link>
                  </div>
                </ScrollReveal>
              </SimpleMotion>
            </div>

            {/* Image - Spans 5 columns - Secondary Anchor */}
            <div className="order-2 flex justify-center lg:col-span-5 lg:justify-end">
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
                    className="relative z-10 h-72 w-full max-w-sm rounded-3xl border-4 border-white object-cover object-top shadow-2xl shadow-blue-950/20 dark:border-slate-800 sm:h-80 lg:h-96 lg:w-96"
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
                <path d="M 8 0 L 0 0 0 8" fill="none" stroke="currentColor" strokeWidth="0.5" />
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
                    <ScrollReveal key={item.id} direction="up" delay={index * 0.1}>
                      <HoverCard>
                        <ResponsiveCard
                          className="group overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors duration-300"
                          padding="none"
                        >
                          <div className="grid md:grid-cols-5 gap-0">
                            <div className="md:col-span-2 relative overflow-hidden">
                              <ResearchVisual item={item} index={index} />
                              <div className="absolute top-3 left-3">
                                <span className="rounded-md border border-white/20 bg-slate-950/45 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-md">
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
                              <div className="mt-auto flex translate-x-0 items-center pt-4 text-sm font-medium text-blue-600 opacity-100 transition-all duration-300 dark:text-blue-400 md:-translate-x-2 md:opacity-0 md:group-hover:translate-x-0 md:group-hover:opacity-100">
                                {t('common.readMore') || 'Read More'} <ArrowRight className="w-4 h-4 ml-1" />
                              </div>
                            </div>
                          </div>
                        </ResponsiveCard>
                      </HoverCard>
                    </ScrollReveal>
                ))}
              </div>

              <div className="mt-8 md:hidden text-center">
                  <Link to="/research" className="inline-flex w-full items-center justify-center rounded-xl border border-gray-300 px-5 py-3 font-semibold text-primary-dark transition hover:border-blue-500 hover:text-blue-600 dark:border-gray-700">
                    {t('common.viewAll') as string}
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
                      <ScrollReveal key={item.id} direction="left" delay={0.3 + index * 0.1}>
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
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug mb-1">
                            {item.title}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </ScrollReveal>
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
            <Link to="/research" className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-5 py-3 font-semibold text-primary-dark transition hover:border-blue-500 hover:text-blue-600 dark:border-gray-700">
              {t('common.viewAll') || 'View Full Timeline'}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </ResponsiveContainer>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 py-20 text-white theme-transition dark:from-blue-950 dark:via-blue-900 dark:to-indigo-950">
        <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-cyan-300/10 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-28 right-0 h-72 w-72 rounded-full bg-indigo-300/15 blur-3xl" aria-hidden="true" />
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
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link to="/contact" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 font-bold text-blue-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50">
                <Mail className="h-5 w-5" />
                {t('home.contactMe') as string}
              </Link>
              <a
                href={language === 'zh' ? '/cn_resume.pdf' : '/en_resume.pdf'}
                download
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/60 bg-white/5 px-7 py-3.5 font-bold text-white backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white/15"
              >
                <Download className="h-5 w-5" />
                {t('home.downloadResume') as string}
              </a>
            </div>
          </SimpleMotion>
        </ResponsiveContainer>
      </section>
    </div>
  );
}

export default memo(Home);
