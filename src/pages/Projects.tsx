import { useState, useMemo } from 'react';
import { SimpleMotion } from '../components/SimpleMotion';
import { ExternalLink, Github, X, Search, Filter, RotateCcw } from 'lucide-react';
import { PageLoader, ProjectCardSkeleton, usePageLoading, LazyWrapper } from '../components/LoadingComponents';
import { HoverCard, ScrollReveal } from '../components/InteractiveEffects';
import { LazyMagneticButtonComponent as MagneticButton } from '../components/LazyAnimations';
import { UnifiedButton } from '../components/UnifiedButton';
import LazyImage from '../components/LazyImage';
import { SearchInput, FilterDropdown, SortDropdown, ActiveFilters, SearchStats, useAdvancedSearch } from '../components/SearchAndFilter';
import { useResponsive } from '../hooks/useResponsive';
import { useTranslation } from '../components/TranslationProvider';
import { ResponsiveContainer } from '../components/ResponsiveEnhancements';

interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  technologies: string[];
  image: string;
  status: 'completed' | 'ongoing' | 'planned';
  year: string;
  highlights: string[];
  githubUrl?: string;
  demoUrl?: string;
}

const getProjects = (t: (key: string, fallback?: string) => string): Project[] => [
  {
    id: 1,
    title: t('projects.damformer.title'),
    category: t('projects.categories.scientificComputing'),
    description: t('projects.damformer.description'),
    technologies: ['PyTorch', 'Transformer', 'CFD', 'Python', 'CUDA', 'Physics of Fluids'],
    image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=dam%20break%20simulation%20transformer%20neural%20network%20CFD%20flow%20field%20prediction%20scientific%20computing&image_size=landscape_4_3',
    status: 'completed',
    year: '2024',
    highlights: [t('projects.damformer.highlights.crossGeometric'), t('projects.damformer.highlights.published'), t('projects.damformer.highlights.architecture'), t('projects.damformer.highlights.dataset')],
    githubUrl: 'https://github.com/zhaoyangmou',
    demoUrl: 'https://pitohuie-aiversion.github.io/Sparse_to_Dense_Transformer/'
  },
  {
    id: 2,
    title: t('projects.sparseToDense.title'),
    category: t('projects.categories.scientificComputing'),
    description: t('projects.sparseToDense.description'),
    technologies: ['PyTorch', 'Transformer', 'Neural Operator', 'Python', 'CFD'],
    image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=sparse%20to%20dense%20field%20reconstruction%20transformer%20neural%20operator%20scientific%20visualization&image_size=landscape_4_3',
    status: 'ongoing',
    year: '2024',
    highlights: [t('projects.sparseToDense.highlights.sparseReconstruction'), t('projects.sparseToDense.highlights.highResolution'), t('projects.sparseToDense.highlights.transformer'), t('projects.sparseToDense.highlights.cfdApplication')],
    githubUrl: 'https://github.com/zhaoyangmou',
    demoUrl: 'https://pitohuie-aiversion.github.io/Sparse_to_Dense_Transformer/'
  },
  {
    id: 3,
    title: t('projects.bionicFin.title'),
    category: t('projects.categories.simulationAnalysis'),
    description: t('projects.bionicFin.description'),
    technologies: ['Star-CCM+', 'Java', 'CFD', 'FSI', 'Macro开发'],
    image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=bionic%20undulating%20fin%20propulsion%20CFD%20FSI%20simulation%20fluid%20structure%20interaction&image_size=landscape_4_3',
    status: 'ongoing',
    year: '2024',
    highlights: [t('projects.bionicFin.highlights.westlakeCollaboration'), t('projects.bionicFin.highlights.cfdFsiSimulation'), t('projects.bionicFin.highlights.javaMacro'), t('projects.bionicFin.highlights.bionicMechanism')],
    githubUrl: 'https://github.com/zhaoyangmou'
  },
  {
    id: 4,
    title: t('projects.fanWall.title'),
    category: t('projects.categories.experimentalPlatform'),
    description: t('projects.fanWall.description'),
    technologies: ['STM32', 'PWM/TACH', 'VLAN', 'DHCP', '网络管理', '闭环控制'],
    image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=fan%20array%20wind%20tunnel%20experimental%20platform%20flow%20control%20testing%20facility&image_size=landscape_4_3',
    status: 'ongoing',
    year: '2023',
    highlights: [t('projects.fanWall.highlights.modularArray'), t('projects.fanWall.highlights.stm32Control'), t('projects.fanWall.highlights.pwmTach'), t('projects.fanWall.highlights.vlanDhcp')],
    githubUrl: 'https://github.com/zhaoyangmou'
  },
  {
    id: 5,
    title: t('projects.marineBuoy.title'),
    category: t('projects.categories.mechanicalDesign'),
    description: t('projects.marineBuoy.description'),
    technologies: ['SolidWorks', '机械设计', '密封设计', '防腐设计', 'BOM', '海试'],
    image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=marine%20observation%20buoy%20mechanical%20design%20ocean%20engineering%20floating%20platform&image_size=landscape_4_3',
    status: 'completed',
    year: '2022',
    highlights: [t('projects.marineBuoy.highlights.designLead'), t('projects.marineBuoy.highlights.structureSealing'), t('projects.marineBuoy.highlights.buoyancyCalculation'), t('projects.marineBuoy.highlights.seaTrial')],
    githubUrl: 'https://github.com/zhaoyangmou'
  },
  {
    id: 6,
    title: t('projects.serverHpc.title'),
    category: t('projects.categories.highPerformanceComputing'),
    description: t('projects.serverHpc.description'),
    technologies: ['PyTorch', 'DDP/AMP', 'SLURM', 'CUDA', 'NCCL', 'W&B', 'Linux'],
    image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=high%20performance%20computing%20server%20cluster%20distributed%20training%20CUDA%20GPU&image_size=landscape_4_3',
    status: 'ongoing',
    year: '2023',
    highlights: [t('projects.serverHpc.highlights.distributedTraining'), t('projects.serverHpc.highlights.slurmScheduling'), t('projects.serverHpc.highlights.cudaSetup'), t('projects.serverHpc.highlights.wandbLogging')],
    githubUrl: 'https://github.com/zhaoyangmou'
  }
];

const getCategories = (t: (key: string, fallback?: string) => string) => [t('projects.filters.all'), t('projects.categories.scientificComputing'), t('projects.categories.roboticsTechnology'), t('projects.categories.simulationAnalysis'), t('projects.categories.experimentalPlatform')];
const getStatusOptions = (t: (key: string, fallback?: string) => string) => [t('projects.filters.all'), t('projects.status.completed'), t('projects.status.ongoing'), t('projects.status.planned')];
const getYearOptions = (t: (key: string, fallback?: string) => string) => [t('projects.filters.all'), '2025', '2024', '2023', '2022'];

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { isLoading } = usePageLoading(true);
  const { isMobile, isTablet } = useResponsive();
  const { t } = useTranslation();
  
  // Get translated options
  const categories = getCategories(t);
  const statusOptions = getStatusOptions(t);
  const yearOptions = getYearOptions(t);
  const projects = getProjects(t);
  
  // 使用高级搜索Hook
  const {
    searchTerm,
    setSearchTerm,
    filters,
    sortBy,
    setSortBy,
    filteredData: filteredProjects,
    updateFilter,
    removeFilter,
    totalCount,
    filteredCount
  } = useAdvancedSearch({
    data: projects,
    searchFields: ['title', 'description', 'technologies', 'category'],
    filterFields: {
      category: (item: Project) => item.category,
      status: (item: Project) => item.status,
      year: (item: Project) => item.year
    },
    sortFields: {
      title: (item: Project) => item.title,
      year: (item: Project) => item.year,
      category: (item: Project) => item.category,
      status: (item: Project) => item.status
    }
  });

  // 状态相关函数定义
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'ongoing': return 'bg-blue-100 text-blue-800';
      case 'planned': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return t('projects.status.completed');
      case 'ongoing': return t('projects.status.ongoing');
      case 'planned': return t('projects.status.planned');
      default: return t('projects.status.unknown');
    }
  };

  // 筛选选项
  const filterOptions = {
    category: categories.slice(1).map(cat => ({ value: cat, label: cat })),
    status: statusOptions.slice(1).map(status => ({ 
      value: status, 
      label: getStatusText(status) 
    })),
    year: yearOptions.slice(1).map(year => ({ value: year, label: year }))
  };
  
  const sortOptions = [
    { value: 'title', label: t('projects.sort.title'), direction: 'asc' as const },
    { value: 'year', label: t('projects.sort.year'), direction: 'desc' as const },
    { value: 'category', label: t('projects.sort.category'), direction: 'asc' as const },
    { value: 'status', label: t('projects.sort.status'), direction: 'asc' as const }
  ];

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-primary-dark theme-transition">

      <ResponsiveContainer 
        maxWidth="xl" 
        padding="lg"
        className="py-8"
        style={{ paddingTop: isMobile ? '100px' : isTablet ? '120px' : '140px', paddingBottom: '64px' }}
      >
        <SimpleMotion
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-8 leading-tight break-words">
            {t('projects.title')}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-loose break-words hyphens-auto">
            {t('projects.description')}
          </p>
        </SimpleMotion>

        {/* 搜索和筛选 */}
        <SimpleMotion
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 sm:mb-8"
        >
          {/* 高级搜索栏 */}
          <div className="flex flex-col gap-4 mb-4">
            <div className="w-full">
              <SearchInput
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder={t('projects.searchPlaceholder')}
                className="w-full"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <FilterDropdown
                title={t('projects.category')}
                options={filterOptions.category}
                selectedValues={filters.category || []}
                onChange={(values) => updateFilter('category', values)}
                multiple
              />
              <FilterDropdown
                title={t('projects.status')}
                options={filterOptions.status}
                selectedValues={filters.status || []}
                onChange={(values) => updateFilter('status', values)}
                multiple
              />
              <FilterDropdown
                title={t('projects.year')}
                options={filterOptions.year}
                selectedValues={filters.year || []}
                onChange={(values) => updateFilter('year', values)}
                multiple
              />
              <SortDropdown
                options={sortOptions}
                selectedSort={sortBy}
                onChange={setSortBy}
              />
            </div>
          </div>
          
          {/* 活跃筛选标签 */}
          <ActiveFilters
            filters={filters}
            filterLabels={{
              category: t('projects.category'),
              status: t('projects.status'),
              year: t('projects.year')
            }}
            optionLabels={{
              category: Object.fromEntries(categories.map(cat => [cat, cat])),
              status: Object.fromEntries(statusOptions.map(status => [status, status])),
              year: Object.fromEntries(yearOptions.map(year => [year, year]))
            }}
            onRemoveFilter={removeFilter}
            onClearAll={() => {
              Object.keys(filters).forEach(key => {
                if (filters[key].length > 0) {
                  filters[key].forEach(value => removeFilter(key, value));
                }
              });
            }}
          />
        </SimpleMotion>

        {/* 搜索结果统计 */}
        <SearchStats
          totalResults={totalCount}
          filteredResults={filteredCount}
          searchTerm={searchTerm}
          className="mb-6"
        />

        {/* 项目网格 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg md:text-xl font-medium text-gray-900 mb-2 leading-snug">{t('projects.noResults')}</h3>
              <p className="text-gray-600">{t('projects.noResultsDesc')}</p>
            </div>
          ) : null}
          {filteredProjects.map((project, index) => (
            <LazyWrapper key={project.id} fallback={<ProjectCardSkeleton />}>
              <ScrollReveal direction="up" delay={index * 0.1}>
                <HoverCard className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden theme-transition">
                  <div 
                    className="cursor-pointer p-4 sm:p-6" 
                    onClick={() => setSelectedProject(project)}
                  >
                  <div className="relative">
                    <LazyImage
                      src={project.image}
                      alt={project.title}
                      className="w-full h-32 sm:h-40 object-cover"
                    />
                    <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(project.status)}`}>
                        {getStatusText(project.status)}
                      </span>
                    </div>
                  </div>
                  <div className="p-3 sm:p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded theme-transition">
                        {project.category}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 theme-transition">{project.year}</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 theme-transition leading-snug break-words">{project.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 line-clamp-2 sm:line-clamp-3 theme-transition leading-loose break-words hyphens-auto">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="text-xs bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded theme-transition leading-relaxed"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="text-xs text-gray-400 dark:text-gray-500 theme-transition">+{project.technologies.length - 3}</span>
                      )}
                    </div>
                  </div>
                  </div>
                </HoverCard>
              </ScrollReveal>
            </LazyWrapper>
          ))}
        </div>

        {/* 项目详情模态框 */}
        {selectedProject && (
          <SimpleMotion
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center p-2 sm:p-4 z-50"
            onClick={() => setSelectedProject(null)}
          >
            <SimpleMotion
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700 theme-transition"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-48 sm:h-56 md:h-72 object-cover"
                />
                <UnifiedButton
                  onClick={() => setSelectedProject(null)}
                  variant="ghost"
                  size="sm"
                  icon={<X className="w-4 h-4 sm:w-5 sm:h-5" />}
                  className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 hover:bg-opacity-100 dark:hover:bg-opacity-100"
                />
              </div>
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 sm:px-3 py-1 rounded theme-transition">
                      {selectedProject.category}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 theme-transition">{selectedProject.year}</span>
                  </div>
                  <div className="flex gap-3">
                    {selectedProject.githubUrl && (
                      <UnifiedButton
                        as="a"
                        href={selectedProject.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="secondary"
                        size="sm"
                        icon={<Github className="w-3 h-3 sm:w-4 sm:h-4" />}
                        iconPosition="left"
                        className="bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600"
                      >
                        {t('projects.code')}
                      </UnifiedButton>
                    )}
                    {selectedProject.demoUrl && (
                      <UnifiedButton
                        as="a"
                        href={selectedProject.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="primary"
                        size="sm"
                        icon={<ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />}
                        iconPosition="left"
                      >
                        {t('projects.demo')}
                      </UnifiedButton>
                    )}
                  </div>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 theme-transition leading-tight">{selectedProject.title}</h2>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-5 theme-transition leading-relaxed">{selectedProject.description}</p>
                
                <div className="mb-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 theme-transition leading-snug">{t('projects.highlights')}</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {selectedProject.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-blue-600 dark:bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0 theme-transition"></div>
                        <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300 theme-transition leading-relaxed">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 theme-transition leading-snug">{t('projects.techStack')}</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm theme-transition"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </SimpleMotion>
          </SimpleMotion>
        )}
      </ResponsiveContainer>
    </div>
  );
}