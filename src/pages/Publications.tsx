import { useEffect, useState, useMemo } from 'react';
import { SimpleMotion } from '../components/animations/SimpleMotion';
import { useTranslation } from '../components/common/TranslationProvider';
import {
  SearchInput,
  FilterDropdown,
  SortDropdown,
  ActiveFilters,
  SearchStats,
  useAdvancedSearch,
} from '../components/features/search/SearchAndFilter';
import { useResponsive } from '../hooks/useResponsive';
import { PublicationsSEO } from '../components/seo/SEOOptimization';
import { BookOpen, FileText, Award } from 'lucide-react';
import { PublicationItem } from '../types';
import {
  PublicationCard,
  PublicationDetailModal,
} from '../components/features/publications';

const types = ['全部', 'journal', 'conference', 'patent'];

export default function Publications() {
  const { t } = useTranslation();
  const { isMobile, isTablet } = useResponsive();
  const [selectedPublication, setSelectedPublication] = useState<PublicationItem | null>(null);
  const [copiedCitation, setCopiedCitation] = useState<boolean>(false);

  const handleCopyCitation = (pub: PublicationItem) => {
    const citationText = `${pub.authors} (${pub.year}). ${pub.title}. ${pub.journal}${
      pub.doi ? `. https://doi.org/${pub.doi}` : ''
    }`;
    navigator.clipboard.writeText(citationText);
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2000);
  };

  const publications: PublicationItem[] = useMemo(
    () => [
      {
        id: 1,
        title: t('publications.data.nanoEnergy2024.title') as string,
        authors: t('publications.data.nanoEnergy2024.authors') as string,
        journal: t('publications.data.nanoEnergy2024.journal') as string,
        year: '2024',
        type: 'journal',
        status: 'published',
        abstract: t('publications.data.nanoEnergy2024.abstract') as string,
        keywords:
          (t('publications.data.nanoEnergy2024.keywords', {
            returnObjects: true,
          }) as unknown as string[]) || [],
        doi: '10.1016/j.nanoen.2024.110011',
        url: t('publications.data.nanoEnergy2024.url') as string,
      },
      {
        id: 2,
        title: t('publications.data.amtTWSA2025.title') as string,
        authors: t('publications.data.amtTWSA2025.authors') as string,
        journal: t('publications.data.amtTWSA2025.journal') as string,
        year: '2025',
        type: 'journal',
        status: 'published',
        abstract: t('publications.data.amtTWSA2025.abstract') as string,
        keywords:
          (t('publications.data.amtTWSA2025.keywords', {
            returnObjects: true,
          }) as unknown as string[]) || [],
        doi: '10.1002/admt.202401053',
        url: t('publications.data.amtTWSA2025.url') as string,
      },
      {
        id: 3,
        title: t('publications.data.pofDamFormer2025.title') as string,
        authors: t('publications.data.pofDamFormer2025.authors') as string,
        journal: t('publications.data.pofDamFormer2025.journal') as string,
        year: '2025',
        type: 'journal',
        status: 'published',
        abstract: t('publications.data.pofDamFormer2025.abstract') as string,
        keywords:
          (t('publications.data.pofDamFormer2025.keywords', {
            returnObjects: true,
          }) as unknown as string[]) || [],
        doi: '10.1063/5.0245680',
        url: t('publications.data.pofDamFormer2025.url') as string,
      },
      {
        id: 4,
        title: t('publications.data.ieeeCAC2024.title') as string,
        authors: t('publications.data.ieeeCAC2024.authors') as string,
        journal: t('publications.data.ieeeCAC2024.journal') as string,
        year: '2024',
        type: 'conference',
        status: 'published',
        abstract: t('publications.data.ieeeCAC2024.abstract') as string,
        keywords:
          (t('publications.data.ieeeCAC2024.keywords', {
            returnObjects: true,
          }) as unknown as string[]) || [],
        url: t('publications.data.ieeeCAC2024.url') as string,
      },
      {
        id: 5,
        title: t('publications.data.ralRsModCubes2025.title') as string,
        authors: t('publications.data.ralRsModCubes2025.authors') as string,
        journal: t('publications.data.ralRsModCubes2025.journal') as string,
        year: '2025',
        type: 'journal',
        status: 'published',
        abstract: t('publications.data.ralRsModCubes2025.abstract') as string,
        keywords:
          (t('publications.data.ralRsModCubes2025.keywords', {
            returnObjects: true,
          }) as unknown as string[]) || [],
        doi: '10.1109/LRA.2025.3543139',
        url: t('publications.data.ralRsModCubes2025.url') as string,
      },
      {
        id: 6,
        title: t('publications.data.spieCITA2025.title') as string,
        authors: t('publications.data.spieCITA2025.authors') as string,
        journal: t('publications.data.spieCITA2025.journal') as string,
        year: '2025',
        type: 'conference',
        status: 'published',
        abstract: t('publications.data.spieCITA2025.abstract') as string,
        keywords:
          (t('publications.data.spieCITA2025.keywords', {
            returnObjects: true,
          }) as unknown as string[]) || [],
        doi: '10.1117/12.3056794',
        url: t('publications.data.spieCITA2025.url') as string,
      },
      {
        id: 7,
        title: t('publications.data.amtTBLS2025.title') as string,
        authors: t('publications.data.amtTBLS2025.authors') as string,
        journal: t('publications.data.amtTBLS2025.journal') as string,
        year: '2025',
        type: 'journal',
        status: 'published',
        abstract: t('publications.data.amtTBLS2025.abstract') as string,
        keywords:
          (t('publications.data.amtTBLS2025.keywords', {
            returnObjects: true,
          }) as unknown as string[]) || [],
        doi: '10.1002/admt.202500072',
        url: t('publications.data.amtTBLS2025.url') as string,
      },
    ],
    [t]
  );

  const typeLabels = useMemo(
    () => ({
      全部: t('publications.filters.all') as string,
      journal: t('publications.types.journal') as string,
      conference: t('publications.types.conference') as string,
      patent: t('publications.types.patent') as string,
    }),
    [t]
  );

  const hasCitationData = publications.some((publication) => publication.citations !== undefined);

  useEffect(() => {
    if (!selectedPublication) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedPublication(null);
    };

    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [selectedPublication]);

  // 使用高级搜索Hook
  const {
    searchTerm,
    setSearchTerm,
    filters,
    updateFilter,
    removeFilter,
    clearAllFilters,
    sortBy,
    setSortBy,
    filteredData: filteredPublications,
    totalCount,
    filteredCount,
  } = useAdvancedSearch({
    data: publications,
    searchFields: ['title', 'authors', 'journal', 'abstract', 'keywords', 'doi'],
    filterFields: {
      type: (item: PublicationItem) => item.type,
      status: (item: PublicationItem) => item.status,
      year: (item: PublicationItem) => item.year,
    },
    sortFields: {
      year: (item: PublicationItem) => parseInt(item.year) || 0,
      title: (item: PublicationItem) => item.title,
      citations: (item: PublicationItem) => item.citations || 0,
    },
    searchFieldMappers: {
      type: (item: PublicationItem) => {
        const typeLabel = typeLabels[item.type as keyof typeof typeLabels];
        return typeLabel ? [typeLabel] : [];
      },
    },
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'journal':
        return <BookOpen className="w-5 h-5" />;
      case 'conference':
        return <FileText className="w-5 h-5" />;
      case 'patent':
        return <Award className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300';
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300';
      case 'in_preparation':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published':
        return t('publications.status.published') as string;
      case 'under_review':
        return t('publications.status.underReview') as string;
      case 'in_preparation':
        return t('publications.status.inPreparation') as string;
      default:
        return status;
    }
  };

  const filterOptions = {
    type: types.slice(1).map((type) => ({
      value: type,
      label: typeLabels[type as keyof typeof typeLabels] || type,
    })),
    status: [
      { value: 'published', label: t('publications.status.published') as string },
      { value: 'under_review', label: t('publications.status.underReview') as string },
      { value: 'in_preparation', label: t('publications.status.inPreparation') as string },
    ],
    year: Array.from(new Set(publications.map((p) => p.year)))
      .sort((a, b) => parseInt(b) - parseInt(a))
      .map((year) => ({ value: year, label: year })),
  };

  const sortOptions = [
    { value: 'year', label: t('publications.sort.year') as string, direction: 'desc' as const },
    { value: 'title', label: t('publications.sort.title') as string, direction: 'asc' as const },
    ...(hasCitationData
      ? [
          {
            value: 'citations',
            label: t('publications.sort.citations') as string,
            direction: 'desc' as const,
          },
        ]
      : []),
  ];

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
          <div className="space-y-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <SearchInput
                  value={searchTerm}
                  onChange={setSearchTerm}
                  placeholder={t('publications.searchPlaceholder') as string}
                />
              </div>

              <FilterDropdown
                title={t('publications.type') as string}
                options={filterOptions.type}
                selectedValues={filters.type || []}
                onChange={(values) => updateFilter('type', values)}
              />

              <SortDropdown
                options={sortOptions}
                selectedSort={sortBy}
                onChange={setSortBy}
              />
            </div>

            <ActiveFilters
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
            />
            <SearchStats
              totalResults={totalCount}
              filteredResults={filteredCount}
              searchTerm={searchTerm}
              itemsText={t('publications.items') as string}
            />
          </div>
        </SimpleMotion>

        {/* 成果列表 */}
        <div className="space-y-4">
          {filteredPublications.map((publication, index) => (
            <PublicationCard
              key={publication.id}
              publication={publication}
              index={index}
              onClick={() => setSelectedPublication(publication)}
              getTypeIcon={getTypeIcon}
              getStatusColor={getStatusColor}
              getStatusText={getStatusText}
              typeLabels={typeLabels}
            />
          ))}
        </div>

        {/* 详情模态框 */}
        <PublicationDetailModal
          publication={selectedPublication}
          onClose={() => setSelectedPublication(null)}
          getTypeIcon={getTypeIcon}
          getStatusColor={getStatusColor}
          getStatusText={getStatusText}
          typeLabels={typeLabels}
          copiedCitation={copiedCitation}
          onCopyCitation={handleCopyCitation}
        />
      </div>
    </div>
  );
}
