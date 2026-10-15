import { SimpleMotion } from '../components/animations/SimpleMotion';
import { Search } from 'lucide-react';
import { SearchStats } from '../components/features/search/SearchAndFilter';
import { useResponsive } from '../hooks/useResponsive';
import { ResponsiveContainer } from '../components/common/ResponsiveEnhancements';
import { ProjectsSEO } from '../components/seo/SEOOptimization';
import {
  ProjectCard,
  ProjectDetailModal,
  ProjectFilterBar,
  useProjectsPage,
  getStatusColor,
  getStatusText,
  CATEGORY_CODES,
} from '../components/features/projects';

export { CATEGORY_CODES };

export default function Projects() {
  const { isMobile, isTablet } = useResponsive();
  const {
    t,
    categories,
    yearOptions,
    filterOptions,
    sortOptions,
    searchTerm,
    setSearchTerm,
    filters,
    sortBy,
    setSortBy,
    filteredProjects,
    updateFilter,
    removeFilter,
    totalCount,
    filteredCount,
    selectedProject,
    setSelectedProject,
  } = useProjectsPage();

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
              <h3 className="text-lg md:text-xl font-medium text-gray-900 dark:text-white mb-2 leading-snug">
                {t('projects.noResults') as string}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{t('projects.noResultsDesc') as string}</p>
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
