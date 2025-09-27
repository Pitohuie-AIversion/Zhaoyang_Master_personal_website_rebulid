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

const getResearchHighlights = (t: (zh: string, en: string) => string): ResearchHighlight[] => [
  {
    id: '1',
    title: t('DamFormer: 溃坝仿真跨几何泛化Transformer', 'DamFormer: Cross-Geometry Generalization Transformer for Dam Break Simulation'),
    description: t('构建多几何边界数据集，实现跨几何零样本预测，发表于Physics of Fluids期刊', 'Built multi-geometry boundary dataset, achieved cross-geometry zero-shot prediction, published in Physics of Fluids'),
    image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=dam%20break%20simulation%20transformer%20model%20cross%20geometry%20generalization%20computational%20fluid%20dynamics%20scientific%20visualization&image_size=landscape_4_3',
    category: 'Transformer/Neural Operator',
    link: '/projects'
  },
  {
    id: '2',
    title: t('Sparse→Dense Transformer: 稀疏到稠密场重建', 'Sparse→Dense Transformer: Sparse-to-Dense Field Reconstruction'),
    description: t('面向CFD/环境流，通过稀疏传感器数据重建高分辨率时空场的深度学习方法', 'Deep learning method for reconstructing high-resolution spatiotemporal fields from sparse sensor data for CFD/environmental flows'),
    image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=sparse%20to%20dense%20field%20reconstruction%20transformer%20CFD%20environmental%20flow%20sensor%20data%20visualization&image_size=landscape_4_3',
    category: t('科学计算', 'Scientific Computing'),
    link: '/projects'
  },
  {
    id: '3',
    title: t('仿生波动鳍推进仿真', 'Biomimetic Undulating Fin Propulsion Simulation'),
    description: t('西湖大学合作项目，使用Star-CCM+ CFD/FSI仿真，Java Macro自动化参数扫描', 'Westlake University collaboration project, using Star-CCM+ CFD/FSI simulation with Java Macro automated parameter sweeping'),
    image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=biomimetic%20undulating%20fin%20propulsion%20simulation%20CFD%20FSI%20underwater%20robot%20blue%20ocean%20theme&image_size=landscape_4_3',
    category: t('仿生机器人', 'Biomimetic Robotics'),
    link: '/projects'
  }
];

const getNewsItems = (t: (zh: string, en: string) => string): NewsItem[] => [
  {
    id: '1',
    date: '2025-01',
    title: t('DamFormer论文发表于Physics of Fluids', 'DamFormer Paper Published in Physics of Fluids'),
    description: t('"Generalizing morphologies in dam break simulations using transformer model"被Physics of Fluids期刊接收发表', '"Generalizing morphologies in dam break simulations using transformer model" accepted and published in Physics of Fluids'),
    type: 'publication'
  },
  {
    id: '2',
    date: '2025-01',
    title: t('Rs-ModCubes机器人系统论文发表', 'Rs-ModCubes Robot System Paper Published'),
    description: t('"Rs-ModCubes: Self-reconfigurable, scalable, modular cubic robots for underwater operations"发表于IEEE RA-L', '"Rs-ModCubes: Self-reconfigurable, scalable, modular cubic robots for underwater operations" published in IEEE RA-L'),
    type: 'publication'
  },
  {
    id: '3',
    date: '2024-11',
    title: t('获得多项水下机器人相关专利', 'Received Multiple Underwater Robot Patents'),
    description: t('水下机器人动态环境感知和导航装置、基于矢量八推布局的水下机器人等专利公开', 'Patents for underwater robot dynamic environment perception and navigation device, vector eight-thruster layout underwater robot, etc. published'),
    type: 'award'
  },
  {
    id: '4',
    date: '2024-07',
    title: t('获得中国大学生机械工程创新创意大赛一等奖', 'Won First Prize in China University Mechanical Engineering Innovation Competition'),
    description: t('"深蓝视觉融合水下机器人"作品在"明石杯"微纳传感技术与智能应用赛道获得一等奖', '"Deep Blue Vision Fusion Underwater Robot" won first prize in "Mingshi Cup" Micro-nano Sensing Technology and Intelligent Application track'),
    type: 'award'
  },
  {
    id: '5',
    date: '2024-06',
    title: t('开始西湖大学访问学生研究', 'Started Visiting Student Research at Westlake University'),
    description: t('在西湖大学工学院i⁴-FSI实验室开展仿生波动鳍推进仿真研究', 'Conducting biomimetic undulating fin propulsion simulation research at i⁴-FSI Lab, School of Engineering, Westlake University'),
    type: 'project'
  }
];

const getStats = (t: (zh: string, en: string) => string) => [
  { label: t('发表论文', 'Publications'), value: '10+', icon: '📄' },
  { label: t('研究项目', 'Research Projects'), value: '5', icon: '🔬' },
  { label: t('发明专利', 'Patents'), value: '8', icon: '💡' },
  { label: t('荣誉奖项', 'Awards'), value: '3+', icon: '🏆' }
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
    <div className="min-h-screen bg-primary-dark theme-transition">
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
                  {t('牟昭阳', 'Zhaoyang Mu')}
                  <ResponsiveText
                    as="span"
                    className="block text-secondary-dark theme-transition font-normal mt-2"
                    preset="card-title"
                  >
                    {language === 'zh' ? 'Zhaoyang Mu' : '牟昭阳'}
                  </ResponsiveText>
                </h1>
              </ScrollReveal>
              <ScrollReveal direction="up" delay={0.6}>
                <p className="text-base md:text-lg lg:text-xl text-secondary-dark theme-transition mb-6 leading-loose break-words hyphens-auto">
                  {t(
                    '人工智能硕士研究生，专注于科学计算与机器人技术的交叉研究。运用Transformer/神经算子建模CFD时空场与水下机器人仿生感知，具备Star-CCM+/COMSOL/ANSYS工程仿真与SolidWorks/Shapr3D机械设计能力。目前在西湖大学工学院i⁴-FSI实验室进行访问学生研究。',
                    'AI Master\'s student focusing on interdisciplinary research in scientific computing and robotics. Using Transformer/Neural Operator to model CFD spatiotemporal fields and underwater robot bionic perception, with expertise in Star-CCM+/COMSOL/ANSYS engineering simulation and SolidWorks/Shapr3D mechanical design. Currently conducting visiting student research at i⁴-FSI Lab, School of Engineering, Westlake University.'
                  )}
                </p>
              </ScrollReveal>
              <div className="flex flex-wrap gap-2 sm:gap-3 mb-8">
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm font-medium">
                  {t('Transformer/神经算子', 'Transformer/Neural Operator')}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm font-medium">
                  {t('CFD仿真', 'CFD Simulation')}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm font-medium">
                  {t('水下机器人', 'Underwater Robotics')}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm font-medium">
                  {t('仿生感知', 'Bionic Perception')}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm font-medium">
                  {t('机械设计', 'Mechanical Design')}
                </span>
              </div>
              <ScrollReveal direction="up" delay={0.8}>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  <Link to="/research" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                    {t('研究方向', 'Research Areas')}
                  </Link>
                  <Link to="/projects" className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200">
                    {t('项目展示', 'Projects')}
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
                src="https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20portrait%20of%20young%20researcher%20in%20modern%20lab%20setting%20confident%20smile&image_size=portrait_4_3"
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
              {t('研究亮点', 'Research Highlights')}
            </h2>
            <ResponsiveText
              as="p"
              className="text-secondary-dark theme-transition max-w-2xl mx-auto"
              preset="body"
            >
              {t('探索科学计算与机器人技术的前沿交叉领域', 'Exploring the cutting-edge intersection of scientific computing and robotics')}
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
              {t('最新动态', 'Latest News')}
            </ResponsiveText>
            <ResponsiveText
              as="p"
              className="text-gray-600 max-w-2xl mx-auto"
              preset="body"
            >
              {t('关注我的最新研究进展、学术活动和项目更新', 'Follow my latest research progress, academic activities and project updates')}
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