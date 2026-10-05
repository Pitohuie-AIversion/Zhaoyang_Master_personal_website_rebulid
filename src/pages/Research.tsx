import { memo } from 'react';
import { SimpleMotion } from '../components/animations/SimpleMotion';
import { useResponsive } from '../hooks/useResponsive';
import { ResponsiveContainer } from '../components/common/ResponsiveEnhancements';
import { ResearchSEO } from '../components/seo/SEOOptimization';
import {
  ResearchAreasSection,
  ResearchFilterBar,
  ResearchPublicationsSection,
  ResearchPatentsSection,
  ResearchAwardsSection,
  ResearchEducationSection,
  ResearchAnalytics,
  ResearchDetailModal,
  ResearchStructuredData,
  useResearchPage,
  getStatusColor,
  getLevelColor,
} from '../components/features/research';

function Research() {
  const { isMobile, isTablet } = useResponsive();
  const {
    t,
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    publicationFilter,
    setPublicationFilter,
    showAnalytics,
    setShowAnalytics,
    selectedItem,
    modalType,
    isModalOpen,
    publications,
    patents,
    awards,
    filteredPublications,
    filteredPatents,
    filteredAwards,
    openDetailModal,
    closeDetailModal,
  } = useResearchPage();

  return (
    <ResponsiveContainer
      maxWidth="xl"
      className="py-12 px-4 sm:px-6 lg:px-8 theme-transition"
      style={{ paddingTop: isMobile ? '80px' : isTablet ? '100px' : '120px' }}
    >
      <ResearchSEO />

      <SimpleMotion
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* 头部标题区域 */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-dark theme-transition mb-4 leading-tight">
            {t('research.title') as string}
          </h1>
          <p className="text-lg text-secondary-dark theme-transition max-w-3xl mx-auto leading-relaxed">
            {t('research.description') as string}
          </p>
        </div>

        {/* 研究方向网格 */}
        <ResearchAreasSection />

        {/* 筛选与搜索工具栏 */}
        <ResearchFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterType={filterType}
          onFilterTypeChange={setFilterType}
          publicationFilter={publicationFilter}
          onPublicationFilterChange={setPublicationFilter}
          showAnalytics={showAnalytics}
          onToggleAnalytics={() => setShowAnalytics(!showAnalytics)}
        />

        {/* 学术分析可视化面板 */}
        {showAnalytics && (
          <ResearchAnalytics
            publications={publications}
            patents={patents}
            awards={awards}
          />
        )}

        {/* 成果与履历展示区块 */}
        {(filterType === 'all' || filterType === 'publications') && (
          <ResearchPublicationsSection
            publications={filteredPublications}
            getStatusColor={getStatusColor}
            onOpenModal={(pub) => openDetailModal(pub, 'publication')}
          />
        )}

        {(filterType === 'all' || filterType === 'patents') && (
          <ResearchPatentsSection
            patents={filteredPatents}
            getStatusColor={getStatusColor}
            onOpenModal={(patent) => openDetailModal(patent, 'patent')}
          />
        )}

        {(filterType === 'all' || filterType === 'awards') && (
          <ResearchAwardsSection
            awards={filteredAwards}
            getLevelColor={getLevelColor}
            onOpenModal={(award) => openDetailModal(award, 'award')}
          />
        )}

        <ResearchEducationSection />
      </SimpleMotion>

      {/* 成果详情模态框 */}
      <ResearchDetailModal
        isOpen={isModalOpen}
        onClose={closeDetailModal}
        item={selectedItem}
        type={modalType}
      />

      <ResearchStructuredData
        t={t as (key: string, options?: { returnObjects?: boolean; fallback?: string }) => unknown}
        publications={publications}
        patents={patents}
        awards={awards}
      />
    </ResponsiveContainer>
  );
}

export default memo(Research);
