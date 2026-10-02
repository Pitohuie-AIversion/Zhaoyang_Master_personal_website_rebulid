import React, { useState, useMemo, memo } from 'react';
import { SimpleMotion } from '../components/animations/SimpleMotion';
import { useResponsive } from '../hooks/useResponsive';
import { useTranslation } from '../components/common/TranslationProvider';
import { ResponsiveContainer } from '../components/common/ResponsiveEnhancements';
import { StructuredDataSEO } from '../components/seo/StructuredDataSEO';
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

  // 获取翻译后的论文数据 (保留DOI引用以满足系统完整性校验)
  const publications = useMemo<AcademicPublication[]>(() => {
    const getAuthors = (key: string): string[] => {
      const authors = t(key, { returnObjects: true });
      if (Array.isArray(authors)) {
        return authors.filter((author): author is string => typeof author === 'string');
      }
      return [];
    };

    return [
      {
        id: '1',
        title: t('publications.damformer.title') as string,
        journal: t('publications.damformer.journal') as string,
        year: 2025,
        status: 'published',
        authors: getAuthors('publications.damformer.authors'),
        description: t('publications.damformer.description') as string,
        doi: '10.1063/5.0245680',
        type: 'journal'
      },
      {
        id: '2',
        title: t('publications.rsModCubes.title') as string,
        journal: t('publications.rsModCubes.journal') as string,
        year: 2025,
        status: 'published',
        authors: getAuthors('publications.rsModCubes.authors'),
        description: t('publications.rsModCubes.description') as string,
        doi: '10.1109/LRA.2025.3543139',
        type: 'journal'
      },
      {
        id: '3',
        title: t('publications.whiskerSensorArray.title') as string,
        journal: t('publications.whiskerSensorArray.journal') as string,
        year: 2025,
        status: 'published',
        authors: getAuthors('publications.whiskerSensorArray.authors'),
        description: t('publications.whiskerSensorArray.description') as string,
        doi: '10.1002/admt.202401053',
        type: 'journal'
      },
      {
        id: '4',
        title: t('publications.whiskerSensor.title') as string,
        journal: t('publications.whiskerSensor.journal') as string,
        year: 2024,
        status: 'published',
        authors: getAuthors('publications.whiskerSensor.authors'),
        description: t('publications.whiskerSensor.description') as string,
        doi: '10.1016/j.nanoen.2024.110011',
        type: 'journal'
      }
    ];
  }, [t]);

  const patents = useMemo<AcademicPatent[]>(() => [
    {
      id: '1',
      title: t('research.patents.underwaterNavigation.title') as string,
      number: t('research.patents.underwaterNavigation.number') as string,
      applicant: t('research.patents.underwaterNavigation.applicant') as string,
      applicationDate: '2024-11-06',
      publicDate: '2025-02-25',
      priorityDate: '2024-11-06',
      status: 'published',
      type: 'invention',
      description: t('research.patents.underwaterNavigation.description') as string
    },
    {
      id: '2',
      title: t('research.patents.vectorThruster.title') as string,
      number: t('research.patents.vectorThruster.number') as string,
      applicant: t('research.patents.vectorThruster.applicant') as string,
      applicationDate: '2024-06-20',
      publicDate: '2024-11-06',
      priorityDate: '2024-06-20',
      status: 'published',
      type: 'invention',
      description: t('research.patents.vectorThruster.description') as string
    },
    {
      id: '3',
      title: t('research.patents.undulatingFin.title') as string,
      number: t('research.patents.undulatingFin.number') as string,
      applicant: t('research.patents.undulatingFin.applicant') as string,
      applicationDate: '2024-05-10',
      publicDate: '2024-11-06',
      priorityDate: '2024-05-10',
      status: 'published',
      type: 'invention',
      description: t('research.patents.undulatingFin.description') as string
    },
    {
      id: '4',
      title: t('research.patents.flexibleFin.title') as string,
      number: t('research.patents.flexibleFin.number') as string,
      applicant: t('research.patents.flexibleFin.applicant') as string,
      applicationDate: '2023-10-25',
      publicDate: '2024-04-23',
      priorityDate: '2023-10-25',
      status: 'published',
      type: 'invention',
      description: t('research.patents.flexibleFin.description') as string
    },
    {
      id: '5',
      title: t('research.patents.smartShip.title') as string,
      number: t('research.patents.smartShip.number') as string,
      applicant: t('research.patents.smartShip.applicant') as string,
      applicationDate: '2023-09-15',
      publicDate: '2024-03-14',
      priorityDate: '2023-09-15',
      status: 'published',
      type: 'invention',
      description: t('research.patents.smartShip.description') as string
    },
    {
      id: '6',
      title: t('research.patents.mobileBuoy.title') as string,
      number: t('research.patents.mobileBuoy.number') as string,
      applicant: t('research.patents.mobileBuoy.applicant') as string,
      applicationDate: '2022-08-30',
      publicDate: '2023-02-22',
      priorityDate: '2022-08-30',
      status: 'published',
      type: 'design',
      description: t('research.patents.mobileBuoy.description') as string
    }
  ], [t]);

  const awards = useMemo<AcademicAward[]>(() => [
    {
      id: '1',
      title: t('research.awards.internetPlusGold.title') as string,
      organization: t('research.awards.internetPlusGold.organization') as string,
      date: '2023-04',
      level: 'national',
      description: t('research.awards.internetPlusGold.description') as string,
      certificateNumber: '202310033'
    },
    {
      id: '2',
      title: t('research.awards.roboticsCompetition.title') as string,
      organization: t('research.awards.roboticsCompetition.organization') as string,
      date: '2022-04',
      level: 'national',
      description: t('research.awards.roboticsCompetition.description') as string,
      certificateNumber: 'Y2109R025A0001'
    },
    {
      id: '3',
      title: t('research.awards.mechanicalInnovation.title') as string,
      organization: t('research.awards.mechanicalInnovation.organization') as string,
      date: '2024-07',
      level: 'national',
      description: t('research.awards.mechanicalInnovation.description') as string,
      certificateNumber: 'MEICC05MNSI2024-CV1-006'
    },
    {
      id: '4',
      title: t('research.awards.provincialMechanical.title') as string,
      organization: t('research.awards.provincialMechanical.organization') as string,
      date: '2024-04',
      level: 'provincial',
      description: t('research.awards.provincialMechanical.description') as string
    }
  ], [t]);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
      case 'granted':
        return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300';
      case 'accepted':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300';
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'national':
        return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300';
      case 'provincial':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300';
    }
  };

  const openDetailModal = (item: AcademicPublication | AcademicPatent | AcademicAward, type: 'publication' | 'patent' | 'award') => {
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
      <StructuredDataSEO
        type="article"
        data={{
          headline: t('research.title') as string,
          author: {
            "@type": "Person",
            name: "牟昭阳",
            alternateName: "Zhaoyang Mu"
          },
          publisher: {
            "@type": "Organization",
            name: "牟昭阳个人学术网站"
          },
          datePublished: new Date().toISOString(),
          about: [
            t('research.keywords.scientificComputing') as string,
            t('research.keywords.roboticsResearch') as string,
            t('research.keywords.artificialIntelligence') as string,
            t('research.keywords.machineLearning') as string
          ]
        }}
      />

      {/* 论文结构化数据 */}
      {publications.map((publication) => (
        <StructuredDataSEO
          key={`article-${publication.id}`}
          type="article"
          data={{
            headline: publication.title,
            author: publication.authors.map((author) => ({
              "@type": "Person",
              name: author
            })),
            publisher: {
              "@type": "Organization",
              name: publication.journal
            },
            datePublished: `${publication.year}-01-01`,
            doi: publication.doi,
            citationCount: 0,
            abstract: publication.description
          }}
        />
      ))}

      {/* 专利结构化数据 */}
      {patents.map((patent) => (
        <StructuredDataSEO
          key={`patent-${patent.id}`}
          type="patent"
          data={{
            name: patent.title,
            patentNumber: patent.number,
            applicant: {
              "@type": "Organization",
              name: patent.applicant
            },
            filingDate: patent.applicationDate,
            abstract: patent.description,
            patentStatus: patent.status === 'granted' ? 'Granted' : 'Pending'
          }}
        />
      ))}

      {/* 奖项结构化数据 */}
      {awards.map((award) => (
        <StructuredDataSEO
          key={`award-${award.id}`}
          type="award"
          data={{
            name: award.title,
            provider: {
              "@type": "Organization",
              name: award.organization
            },
            datePublished: `${award.date}-01`,
            description: award.description,
            awardCategory: award.level === 'national' ? t('research.awardLevels.national') as string :
                          award.level === 'provincial' ? t('research.awardLevels.provincial') as string : t('research.awardLevels.university') as string
          }}
        />
      ))}
    </ResponsiveContainer>
  );
}

export default memo(Research);
