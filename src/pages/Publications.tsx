import { Search } from 'lucide-react';
import { SimpleMotion } from '../components/animations/SimpleMotion';
import { useResponsive } from '../hooks/useResponsive';
import { PublicationsSEO } from '../components/seo/SEOOptimization';
import {
  PublicationCard,
  PublicationDetailModal,
  PublicationsFilterSection,
  usePublicationSearch,
  getTypeIcon,
  getStatusColor,
  getStatusText,
} from '../components/features/publications';

export default function Publications() {
  const { isMobile, isTablet } = useResponsive();
  const {
    t,
    typeLabels,
    selectedPublication,
    setSelectedPublication,
    copiedCitation,
    handleCopyCitation,
    searchTerm,
    setSearchTerm,
    filters,
    updateFilter,
    removeFilter,
    clearAllFilters,
    sortBy,
    setSortBy,
    filteredPublications,
    totalCount,
    filteredCount,
    filterOptions,
    sortOptions,
  } = usePublicationSearch();

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 theme-transition">
      <PublicationsSEO />
      <div
        className="max-w-7xl mx-auto"
        style={{
          paddingTop: isMobile ? '80px' : isTablet ? '100px' : '120px',
          paddingBottom: '80px',
        }}
      >
        <SimpleMotion
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-primary-dark theme-transition mb-4">
              {t('publications.title') as string}
            </h1>
            <p className="text-lg text-secondary-dark theme-transition max-w-2xl mx-auto">
              {t('publications.description') as string}
            </p>
          </div>

          {/* 搜索和筛选区域 */}
          <PublicationsFilterSection
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder={t('publications.searchPlaceholder') as string}
            typeTitle={t('publications.type') as string}
            typeOptions={filterOptions.type}
            selectedTypeValues={filters.type || []}
            onTypeChange={(values) => updateFilter('type', values)}
            sortOptions={sortOptions}
            selectedSort={sortBy}
            onSortChange={setSortBy}
            filters={filters}
            onRemoveFilter={removeFilter}
            onClearAll={clearAllFilters}
            filterLabels={{
              type: t('publications.type') as string,
              status: t('publications.statusLabel') as string,
              year: t('publications.year') as string,
            }}
            optionLabels={{
              type: {
                journal: t('publications.types.journal') as string,
                conference: t('publications.types.conference') as string,
                patent: t('publications.types.patent') as string,
              },
              status: {
                published: t('publications.status.published') as string,
                under_review: t('publications.status.underReview') as string,
                in_preparation: t('publications.status.inPreparation') as string,
              },
            }}
            totalCount={totalCount}
            filteredCount={filteredCount}
            itemsText={t('publications.items') as string}
          />
        </SimpleMotion>

        {/* 成果列表 */}
        <div className="space-y-4">
          {filteredPublications.length === 0 ? (
            <div className="text-center py-12 card-dark rounded-xl p-8 border border-gray-200 dark:border-gray-700 theme-transition">
              <div className="text-gray-400 mb-4 flex justify-center">
                <Search className="w-12 h-12" />
              </div>
              <h3 className="text-lg md:text-xl font-medium text-gray-900 dark:text-white mb-2 leading-snug">
                {t('publications.noResults') as string}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm max-w-md mx-auto">
                {t('publications.noResultsDesc') as string}
              </p>
            </div>
          ) : (
            filteredPublications.map((publication, index) => (
              <PublicationCard
                key={publication.id}
                publication={publication}
                index={index}
                onClick={() => setSelectedPublication(publication)}
                getTypeIcon={getTypeIcon}
                getStatusColor={getStatusColor}
                getStatusText={(status) => getStatusText(status, t)}
                typeLabels={typeLabels}
              />
            ))
          )}
        </div>

        {/* 详情模态框 */}
        <PublicationDetailModal
          publication={selectedPublication}
          onClose={() => setSelectedPublication(null)}
          getTypeIcon={getTypeIcon}
          getStatusColor={getStatusColor}
          getStatusText={(status) => getStatusText(status, t)}
          typeLabels={typeLabels}
          copiedCitation={copiedCitation}
          onCopyCitation={handleCopyCitation}
        />
      </div>
    </div>
  );
}
