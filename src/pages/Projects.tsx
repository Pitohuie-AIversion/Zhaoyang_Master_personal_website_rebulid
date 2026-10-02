import { useEffect, useState, useMemo } from 'react';
import { SimpleMotion } from '../components/animations/SimpleMotion';
import { Search } from 'lucide-react';
import { SearchStats, useAdvancedSearch } from '../components/features/search/SearchAndFilter';
import { useResponsive } from '../hooks/useResponsive';
import { useTranslation } from '../components/common/TranslationProvider';
import { ResponsiveContainer } from '../components/common/ResponsiveEnhancements';
import { ProjectsSEO } from '../components/seo/SEOOptimization';
import { Project, CATEGORY_CODES } from '../types';
import {
  ProjectCard,
  ProjectDetailModal,
  ProjectFilterBar,
} from '../components/features/projects';

export { CATEGORY_CODES };

const getProjects = (
  t: (key: string, options?: { returnObjects?: boolean; fallback?: string }) => string
): Project[] => [
  {
    id: 1,
    title: t('projects.damformer.title') as string,
    category: CATEGORY_CODES.SCIENTIFIC_COMPUTING,
    description: t('projects.damformer.description') as string,
    technologies: ['PyTorch', 'Transformer', 'CFD', 'Python', 'CUDA', 'Physics of Fluids'],
    image:
      'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=dam%20break%20simulation%20transformer%20neural%20network%20CFD%20flow%20field%20prediction%20scientific%20computing&image_size=landscape_4_3',
    status: 'completed',
    year: '2024',
    highlights: [
      t('projects.damformer.highlights.crossGeometric'),
      t('projects.damformer.highlights.published'),
      t('projects.damformer.highlights.architecture'),
      t('projects.damformer.highlights.dataset'),
    ],
    githubUrl: 'https://github.com/Pitohuie',
    demoUrl: 'https://pitohuie-aiversion.github.io/Sparse_to_Dense_Transformer/',
  },
  {
    id: 2,
    title: t('projects.sparseToDense.title'),
    category: CATEGORY_CODES.SCIENTIFIC_COMPUTING,
    description: t('projects.sparseToDense.description'),
    technologies: ['PyTorch', 'Transformer', 'Neural Operator', 'Python', 'CFD'],
    image:
      'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=sparse%20to%20dense%20field%20reconstruction%20transformer%20neural%20operator%20scientific%20visualization&image_size=landscape_4_3',
    status: 'ongoing',
    year: '2024',
    highlights: [
      t('projects.sparseToDense.highlights.sparseReconstruction'),
      t('projects.sparseToDense.highlights.transformerBased'),
      t('projects.sparseToDense.highlights.highAccuracy'),
      t('projects.sparseToDense.highlights.realTimeProcessing'),
    ],
    githubUrl: 'https://github.com/Pitohuie',
    demoUrl: 'https://pitohuie-aiversion.github.io/Sparse_to_Dense_Transformer/',
  },
  {
    id: 3,
    title: t('projects.bionicRobot.title'),
    category: CATEGORY_CODES.ROBOTICS_TECHNOLOGY,
    description: t('projects.bionicRobot.description'),
    technologies: [
      t('common.technologies.bionics'),
      t('common.technologies.underwaterRobot'),
      t('common.technologies.sensorFusion'),
      t('common.technologies.realTimeControl'),
    ],
    image:
      'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=bionic%20robot%20underwater%20perception%20sensor%20fusion%20real%20time%20control&image_size=landscape_4_3',
    status: 'completed',
    year: '2023',
    highlights: [
      t('projects.bionicRobot.highlights.bionicPerception'),
      t('projects.bionicRobot.highlights.realTimeDetection'),
      t('projects.bionicRobot.highlights.sensorFusion'),
      t('projects.bionicRobot.highlights.complexEnvironment'),
    ],
    githubUrl: 'https://github.com/Pitohuie',
  },
  {
    id: 4,
    title: t('projects.fanWall.title'),
    category: CATEGORY_CODES.EXPERIMENTAL_PLATFORM,
    description: t('projects.fanWall.description'),
    technologies: [
      'STM32',
      'PWM/TACH',
      'VLAN',
      'DHCP',
      t('common.technologies.networkManagement'),
      t('common.technologies.closedLoopControl'),
    ],
    image:
      'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=fan%20array%20wind%20tunnel%20experimental%20platform%20flow%20control%20testing%20facility&image_size=landscape_4_3',
    status: 'ongoing',
    year: '2023',
    highlights: [
      t('projects.fanWall.highlights.modularArray'),
      t('projects.fanWall.highlights.stm32Control'),
      t('projects.fanWall.highlights.pwmTach'),
      t('projects.fanWall.highlights.vlanDhcp'),
    ],
    githubUrl: 'https://github.com/Pitohuie',
  },
  {
    id: 5,
    title: t('projects.marineBuoy.title'),
    category: CATEGORY_CODES.SIMULATION_ANALYSIS,
    description: t('projects.marineBuoy.description'),
    technologies: ['Star-CCM+', 'Java Macro', 'CFD', 'FSI', t('common.technologies.oceanEngineering')],
    image:
      'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=marine%20buoy%20CFD%20simulation%20fluid%20structure%20interaction%20ocean%20engineering&image_size=landscape_4_3',
    status: 'completed',
    year: '2022',
    highlights: [
      t('projects.marineBuoy.highlights.cfdSimulation'),
      t('projects.marineBuoy.highlights.fluidStructureInteraction'),
      t('projects.marineBuoy.highlights.javaMacro'),
      t('projects.marineBuoy.highlights.oceanEngineering'),
    ],
    githubUrl: 'https://github.com/Pitohuie',
  },
  {
    id: 6,
    title: t('projects.serverHpc.title'),
    category: CATEGORY_CODES.HIGH_PERFORMANCE_COMPUTING,
    description: t('projects.serverHpc.description'),
    technologies: ['PyTorch', 'DDP/AMP', 'SLURM', 'CUDA', 'NCCL', 'W&B', 'Linux'],
    image:
      'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=high%20performance%20computing%20server%20cluster%20distributed%20training%20CUDA%20GPU&image_size=landscape_4_3',
    status: 'ongoing',
    year: '2023',
    highlights: [
      t('projects.serverHpc.highlights.distributedTraining'),
      t('projects.serverHpc.highlights.slurmScheduling'),
      t('projects.serverHpc.highlights.cudaSetup'),
      t('projects.serverHpc.highlights.wandbLogging'),
    ],
    githubUrl: 'https://github.com/Pitohuie',
  },
];

const getCategories = (
  t: (key: string, options?: { returnObjects?: boolean; fallback?: string }) => string
) => [
  { value: 'all', label: t('projects.filters.all') as string },
  {
    value: CATEGORY_CODES.SCIENTIFIC_COMPUTING,
    label: t('projects.categories.scientificComputing') as string,
  },
  {
    value: CATEGORY_CODES.ROBOTICS_TECHNOLOGY,
    label: t('projects.categories.roboticsTechnology') as string,
  },
  {
    value: CATEGORY_CODES.SIMULATION_ANALYSIS,
    label: t('projects.categories.simulationAnalysis') as string,
  },
  {
    value: CATEGORY_CODES.EXPERIMENTAL_PLATFORM,
    label: t('projects.categories.experimentalPlatform') as string,
  },
  {
    value: CATEGORY_CODES.HIGH_PERFORMANCE_COMPUTING,
    label: t('projects.categories.highPerformanceComputing') as string,
  },
];

const getYearOptions = (
  t: (key: string, options?: { returnObjects?: boolean; fallback?: string }) => string
) => [t('projects.filters.all') as string, '2025', '2024', '2023', '2022'];

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    if (!selectedProject) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedProject(null);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedProject]);

  const { isMobile, isTablet } = useResponsive();
  const { t } = useTranslation();

  const categories = useMemo(
    () =>
      getCategories(
        t as (key: string, options?: { returnObjects?: boolean; fallback?: string }) => string
      ),
    [t]
  );
  const yearOptions = useMemo(
    () =>
      getYearOptions(
        t as (key: string, options?: { returnObjects?: boolean; fallback?: string }) => string
      ),
    [t]
  );
  const projects = useMemo(
    () =>
      getProjects(
        t as (key: string, options?: { returnObjects?: boolean; fallback?: string }) => string
      ),
    [t]
  );

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
    filteredCount,
  } = useAdvancedSearch({
    data: projects,
    searchFields: ['title', 'description', 'technologies', 'category'],
    filterFields: {
      category: (item: Project) => item.category,
      status: (item: Project) => item.status,
      year: (item: Project) => item.year,
    },
    sortFields: {
      title: (item: Project) => item.title,
      year: (item: Project) => item.year,
      category: (item: Project) => item.category,
      status: (item: Project) => item.status,
    },
    searchFieldMappers: {
      category: (item: Project) => {
        const categoryOption = categories.find((cat) => cat.value === item.category);
        return categoryOption ? [categoryOption.label] : [];
      },
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'ongoing':
        return 'bg-blue-100 text-blue-800';
      case 'planned':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return t('projects.status.completed') as string;
      case 'ongoing':
        return t('projects.status.ongoing') as string;
      case 'planned':
        return t('projects.status.planned') as string;
      default:
        return t('projects.status.unknown') as string;
    }
  };

  const filterOptions = {
    category: categories.slice(1),
    status: [
      { value: 'completed', label: getStatusText('completed') as string },
      { value: 'ongoing', label: getStatusText('ongoing') as string },
      { value: 'planned', label: getStatusText('planned') as string },
    ],
    year: yearOptions.slice(1).map((year) => ({ value: year, label: year })),
  };

  const sortOptions = [
    { value: 'title', label: t('projects.sort.title') as string, direction: 'asc' as const },
    { value: 'year', label: t('projects.sort.year') as string, direction: 'desc' as const },
    { value: 'category', label: t('projects.sort.category') as string, direction: 'asc' as const },
    { value: 'status', label: t('projects.sort.status') as string, direction: 'asc' as const },
  ];

  return (
    <div className="min-h-screen relative theme-transition">
      <ProjectsSEO />

      <ResponsiveContainer
        maxWidth="xl"
        padding="lg"
        className="py-8"
        style={{
          paddingTop: isMobile ? '100px' : isTablet ? '120px' : '140px',
          paddingBottom: '64px',
        }}
      >
        <SimpleMotion
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-8 leading-tight break-words">
            {t('projects.title') as string}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-loose break-words hyphens-auto">
            {t('projects.description') as string}
          </p>
        </SimpleMotion>

        {/* 搜索和筛选工具栏 */}
        <ProjectFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterOptions={filterOptions}
          filters={filters}
          updateFilter={updateFilter}
          removeFilter={removeFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOptions={sortOptions}
          categories={categories}
          yearOptions={yearOptions}
        />

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
              <h3 className="text-lg md:text-xl font-medium text-gray-900 mb-2 leading-snug">
                {t('projects.noResults') as string}
              </h3>
              <p className="text-gray-600">{t('projects.noResultsDesc') as string}</p>
            </div>
          ) : null}
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onClick={() => setSelectedProject(project)}
              getStatusColor={getStatusColor}
              getStatusText={getStatusText}
            />
          ))}
        </div>

        {/* 项目详情模态框 */}
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      </ResponsiveContainer>
    </div>
  );
}
