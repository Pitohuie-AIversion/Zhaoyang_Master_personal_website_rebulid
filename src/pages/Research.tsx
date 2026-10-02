import React, { useState, useMemo, memo } from 'react';
import { SimpleMotion } from '../components/animations/SimpleMotion';
import { useResponsive } from '../hooks/useResponsive';
import { useTranslation } from '../components/common/TranslationProvider';
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
  getPublications,
  getPatents,
  getAwards,
  getStatusColor,
  getLevelColor,
} from '../components/features/research';
import type { AcademicPublication, AcademicPatent, AcademicAward } from '../types';

function Research() {
  const { isMobile, isTablet } = useResponsive();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'publications' | 'patents' | 'awards'>('all');
  const [publicationFilter, setPublicationFilter] = useState<'all' | 'published' | 'under_review'>('all');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [selectedItem, setSelectedItem] = useState<AcademicPublication | AcademicPatent | AcademicAward | null>(null);
  const [modalType, setModalType] = useState<'publication' | 'patent' | 'award'>('publication');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 获取翻译后的学术数据 (保留DOI引用以满足系统完整性校验)
  const publications = useMemo<AcademicPublication[]>(() => getPublications(t), [t]);
  const patents = useMemo<AcademicPatent[]>(() => getPatents(t), [t]);
  const awards = useMemo<AcademicAward[]>(() => getAwards(t), [t]);

  const filteredPublications = useMemo(() => {
    return publications.filter((pub) => {
      const matchesSearch =
        pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pub.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pub.journal.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = publicationFilter === 'all' || pub.status === publicationFilter;
      return matchesSearch && matchesFilter;
    });
  }, [publications, searchTerm, publicationFilter]);

  const filteredPatents = useMemo(() => {
    return patents.filter(
      (patent) =>
        patent.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patent.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patent.number.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [patents, searchTerm]);

  const filteredAwards = useMemo(() => {
    return awards.filter(
      (award) =>
        award.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        award.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        award.organization.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [awards, searchTerm]);

  const openDetailModal = (
    item: AcademicPublication | AcademicPatent | AcademicAward,
    type: 'publication' | 'patent' | 'award'
  ) => {
    setSelectedItem(item);
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

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
          <p className="text-base sm:text-lg md:text-xl text-secondary-dark theme-transition max-w-3xl mx-auto leading-relaxed">
            {t('research.description') as string}
          </p>
        </div>

        {/* 筛选与搜索工具条 */}
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

        {/* 研究支柱模块 */}
        <ResearchAreasSection />

        {/* 学术成果展示区 */}
        <SimpleMotion
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-semibold text-primary-dark theme-transition mb-8 text-center">
            {t('research.academicAchievements') as string}
          </h2>

          {showAnalytics ? (
            <ResearchAnalytics
              publications={publications}
              patents={patents}
              awards={awards}
            />
          ) : (
            <>
              {(filterType === 'all' || filterType === 'publications') && (
                <ResearchPublicationsSection
                  publications={filteredPublications}
                  onOpenModal={(pub) => openDetailModal(pub, 'publication')}
                  getStatusColor={getStatusColor}
                />
              )}

              {(filterType === 'all' || filterType === 'patents') && (
                <ResearchPatentsSection
                  patents={filteredPatents}
                  onOpenModal={(patent) => openDetailModal(patent, 'patent')}
                  getStatusColor={getStatusColor}
                />
              )}

              {(filterType === 'all' || filterType === 'awards') && (
                <ResearchAwardsSection
                  awards={filteredAwards}
                  onOpenModal={(award) => openDetailModal(award, 'award')}
                  getLevelColor={getLevelColor}
                />
              )}

              {/* 教育背景 */}
              <ResearchEducationSection />
            </>
          )}
        </SimpleMotion>
      </SimpleMotion>

      {/* 详细信息弹窗 */}
      <ResearchDetailModal
        isOpen={isModalOpen}
        onClose={closeDetailModal}
        item={selectedItem}
        type={modalType}
      />

      {/* 学术结构化数据SEO */}
      <ResearchStructuredData
        t={t}
        publications={publications}
        patents={patents}
        awards={awards}
      />
    </ResponsiveContainer>
  );
}

export default memo(Research);
