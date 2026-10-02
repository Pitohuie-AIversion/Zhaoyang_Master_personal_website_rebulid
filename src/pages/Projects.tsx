import { useEffect, useState, useMemo } from 'react';
import { SimpleMotion } from '../components/animations/SimpleMotion';
import { Search } from 'lucide-react';
import { SearchStats, useAdvancedSearch } from '../components/features/search/SearchAndFilter';
import { useResponsive } from '../hooks/useResponsive';
import { useTranslation } from '../components/common/TranslationProvider';
import { ResponsiveContainer } from '../components/common/ResponsiveEnhancements';
import { ProjectsSEO } from '../components/seo/SEOOptimization';
import type { Project } from '../types';
import {
  ProjectCard,
  ProjectDetailModal,
  ProjectFilterBar,
  getProjects,
  getCategories,
  getYearOptions,
  getStatusColor,
  getStatusText,
  CATEGORY_CODES,
} from '../components/features/projects';

export { CATEGORY_CODES };

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

  const filterOptions = {
    category: categories.slice(1),
    status: [
      { value: 'completed', label: getStatusText('completed', t as (key: string) => string) },
      { value: 'ongoing', label: getStatusText('ongoing', t as (key: string) => string) },
      { value: 'planned', label: getStatusText('planned', t as (key: string) => string) },
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
              getStatusText={(status) => getStatusText(status, t as (key: string) => string)}
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
