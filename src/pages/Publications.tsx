import { SimpleMotion } from '../components/SimpleMotion';
import { useState } from 'react';
import { useTranslation } from '../components/TranslationProvider';
import { SearchInput, FilterDropdown, SortDropdown, ActiveFilters, SearchStats, useAdvancedSearch } from '../components/SearchAndFilter';
import { UnifiedButton } from '../components/UnifiedButton';
import { useResponsive } from '../hooks/useResponsive';

interface Publication {
  id: number;
  title: string;
  authors: string;
  journal: string;
  year: string;
  type: 'journal' | 'conference' | 'patent';
  status: 'published' | 'under_review' | 'in_preparation';
  abstract: string;
  keywords: string[];
  doi?: string;
  citations?: number;
}

const types = ['全部', 'journal', 'conference', 'patent'];

export default function Publications() {
  const { t } = useTranslation();
  const { isMobile, isTablet } = useResponsive();
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null);
  
  const publications: Publication[] = [
    {
      id: 1,
      title: t('publications.data.publication1.title'),
      authors: t('publications.data.publication1.authors'),
      journal: t('publications.data.publication1.journal'),
      year: '2024',
      type: 'journal',
      status: 'published',
      abstract: t('publications.data.publication1.abstract'),
      keywords: t('publications.data.publication1.keywords', { returnObjects: true }) as string[],
      doi: '10.1063/5.0123456',
      citations: 5
    },
    {
      id: 2,
      title: t('publications.data.publication2.title'),
      authors: t('publications.data.publication2.authors'),
      journal: t('publications.data.publication2.journal'),
      year: '2024',
      type: 'journal',
      status: 'in_preparation',
      abstract: t('publications.data.publication2.abstract'),
      keywords: t('publications.data.publication2.keywords', { returnObjects: true }) as string[],
      citations: 0
    },
    {
      id: 3,
      title: t('publications.data.publication3.title'),
      authors: t('publications.data.publication3.authors'),
      journal: t('publications.data.publication3.journal'),
      year: '2024',
      type: 'conference',
      status: 'in_preparation',
      abstract: t('publications.data.publication3.abstract'),
      keywords: t('publications.data.publication3.keywords', { returnObjects: true }) as string[],
      citations: 0
    },
    {
      id: 4,
      title: t('publications.data.patent1.title'),
      authors: t('publications.data.patent1.authors'),
      journal: t('publications.data.patent1.journal'),
      year: '2023',
      type: 'patent',
      status: 'published',
      abstract: t('publications.data.patent1.abstract'),
      keywords: t('publications.data.patent1.keywords', { returnObjects: true }) as string[],
      doi: 'CN202310123456.7'
    },
    {
      id: 5,
      title: t('publications.data.patent2.title'),
      authors: t('publications.data.patent2.authors'),
      journal: t('publications.data.patent2.journal'),
      year: '2023',
      type: 'patent',
      status: 'published',
      abstract: t('publications.data.patent2.abstract'),
      keywords: t('publications.data.patent2.keywords', { returnObjects: true }) as string[],
      doi: 'CN202310234567.8'
    },
    {
      id: 6,
      title: t('publications.data.patent3.title'),
      authors: t('publications.data.patent3.authors'),
      journal: t('publications.data.patent3.journal'),
      year: '2023',
      type: 'patent',
      status: 'published',
      abstract: t('publications.data.patent3.abstract'),
      keywords: t('publications.data.patent3.keywords', { returnObjects: true }) as string[],
      doi: 'CN202320345678.9'
    }
  ];
  
  const typeLabels = {
    '全部': t('publications.filters.all'),
    'journal': t('publications.types.journal'),
    'conference': t('publications.types.conference'),
    'patent': t('publications.types.patent')
  };
  
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
    filteredCount
  } = useAdvancedSearch({
    data: publications,
    searchFields: ['title', 'authors', 'journal', 'abstract', 'keywords'],
    filterFields: {
      type: (item: Publication) => item.type,
      status: (item: Publication) => item.status,
      year: (item: Publication) => item.year
    },
    sortFields: {
      title: (item: Publication) => item.title,
      year: (item: Publication) => item.year,
      citations: (item: Publication) => item.citations || 0,
      authors: (item: Publication) => item.authors,
      journal: (item: Publication) => item.journal
    }
  });
  
  // 筛选选项
  const filterOptions = {
    type: types.slice(1).map(type => ({ 
      value: type, 
      label: typeLabels[type as keyof typeof typeLabels] 
    })),
    status: [
      { value: 'published', label: t('publications.status.published') },
      { value: 'under_review', label: t('publications.status.underReview') },
      { value: 'in_preparation', label: t('publications.status.inPreparation') }
    ],
    year: [...new Set(publications.map(p => p.year))]
      .sort((a, b) => b.localeCompare(a))
      .map(year => ({ value: year, label: year }))
  };
  
  const sortOptions = [
    { value: 'title', label: t('publications.sort.title') },
    { value: 'year', label: t('publications.sort.year') },
    { value: 'citations', label: t('publications.sort.citations') },
    { value: 'authors', label: t('publications.sort.authors') },
    { value: 'journal', label: t('publications.sort.journal') }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'under_review': return 'bg-blue-100 text-blue-800';
      case 'in_preparation': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published': return t('publications.status.published');
      case 'under_review': return t('publications.status.underReview');
      case 'in_preparation': return t('publications.status.inPreparation');
      default: return t('publications.status.unknown');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'journal':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case 'conference':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      case 'patent':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
      default:
        return null;
    }
  };

  // 统计数据
  const stats = {
    total: publications.length,
    published: publications.filter(p => p.status === 'published').length,
    citations: publications.reduce((sum, p) => sum + (p.citations || 0), 0),
    patents: publications.filter(p => p.type === 'patent').length
  };

  return (
    <div className="min-h-screen relative theme-transition">
      <div className="max-w-7xl mx-auto px-6" style={{ paddingTop: isMobile ? '120px' : isTablet ? '140px' : '160px', paddingBottom: '80px' }}>
        <SimpleMotion
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-primary-dark theme-transition mb-4">
            {t('publications.title')}
          </h1>
          <p className="text-lg text-secondary-dark theme-transition max-w-2xl mx-auto">
            {t('publications.description')}
          </p>
        </SimpleMotion>

        {/* 成果统计 */}
        <SimpleMotion
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200">
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.total}</div>
            <div className="text-sm text-gray-600">{t('publications.stats.total')}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200">
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.published}</div>
            <div className="text-sm text-gray-600">{t('publications.stats.published')}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200">
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.citations}</div>
            <div className="text-sm text-gray-600">{t('publications.stats.citations')}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200">
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.patents}</div>
            <div className="text-sm text-gray-600">{t('publications.stats.patents')}</div>
          </div>
        </SimpleMotion>

        {/* 搜索和筛选 */}
        <SimpleMotion
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1">
              <SearchInput
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder={t('publications.search.placeholder')}
                className="w-full"
              />
            </div>
            <div className="flex gap-3">
              <FilterDropdown
                title={t('publications.filters.type')}
                options={filterOptions.type}
                selectedValues={filters.type || []}
                onChange={(values) => updateFilter('type', values)}
              />
              <FilterDropdown
                title={t('publications.filters.status')}
                options={filterOptions.status}
                selectedValues={filters.status || []}
                onChange={(values) => updateFilter('status', values)}
              />
              <SortDropdown
                options={sortOptions.map(opt => ({ ...opt, direction: 'asc' as const }))}
                selectedSort={sortBy}
                onChange={setSortBy}
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <ActiveFilters
              filters={filters}
              onRemoveFilter={removeFilter}
              onClearAll={clearAllFilters}
              filterLabels={{ 
                type: t('publications.filters.type'), 
                status: t('publications.filters.status'), 
                year: t('publications.filters.year') 
              }}
              optionLabels={{
                type: { 
                  'journal': t('publications.types.journal'), 
                  'conference': t('publications.types.conference'), 
                  'patent': t('publications.types.patent') 
                },
                status: { 
                  'published': t('publications.status.published'), 
                  'under_review': t('publications.status.underReview'), 
                  'in_preparation': t('publications.status.inPreparation') 
                }
              }}
            />
            <SearchStats
              totalResults={totalCount}
              filteredResults={filteredCount}
              searchTerm={searchTerm}
              itemsText={t('publications.items')}
            />
          </div>
        </SimpleMotion>

        {/* 成果列表 */}
        <div className="space-y-4">
          {filteredPublications.map((publication, index) => (
            <SimpleMotion
              key={publication.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="card-dark rounded-lg border border-gray-200 dark:border-gray-600 p-6 hover:border-gray-300 dark:hover:border-gray-500 theme-transition duration-200 cursor-pointer"
              onClick={() => setSelectedPublication(publication)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-blue-600">
                    {getTypeIcon(publication.type)}
                  </div>
                  <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    {typeLabels[publication.type as keyof typeof typeLabels]}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(publication.status)}`}>
                    {getStatusText(publication.status)}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">{publication.year}</div>
                  {publication.citations !== undefined && (
                    <div className="text-sm text-gray-600 mt-1">
                      {t('publications.citations')}: {publication.citations}
                    </div>
                  )}
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-primary-dark theme-transition mb-2">{publication.title}</h3>
              <p className="text-sm text-secondary-dark theme-transition mb-2">{publication.authors}</p>
              <p className="text-sm text-primary-dark theme-transition font-medium mb-3">{publication.journal}</p>
              <p className="text-sm text-secondary-dark theme-transition mb-3 line-clamp-2">{publication.abstract}</p>
              
              <div className="flex flex-wrap gap-2">
                {publication.keywords.slice(0, 4).map((keyword, keywordIndex) => (
                  <span
                    key={keywordIndex}
                    className="px-2 py-1 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200 text-xs rounded-md theme-transition"
                  >
                    {keyword}
                  </span>
                ))}
                {publication.keywords.length > 4 && (
                  <span className="text-xs text-gray-400">+{publication.keywords.length - 4}</span>
                )}
              </div>
            </SimpleMotion>
          ))}
        </div>

        {/* 详情模态框 */}
        {selectedPublication && (
          <SimpleMotion
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedPublication(null)}
          >
            <SimpleMotion
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="text-blue-600">
                      {getTypeIcon(selectedPublication.type)}
                    </div>
                    <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded">
                      {typeLabels[selectedPublication.type as keyof typeof typeLabels]}
                    </span>
                    <span className={`px-3 py-1 rounded text-sm font-medium ${getStatusColor(selectedPublication.status)}`}>
                      {getStatusText(selectedPublication.status)}
                    </span>
                  </div>
                  <UnifiedButton
                    onClick={() => setSelectedPublication(null)}
                    variant="ghost"
                    size="sm"
                    className="w-8 h-8 bg-gray-100 hover:bg-gray-200"
                  >
                    ×
                  </UnifiedButton>
                </div>
                
                <h2 className="text-xl font-bold text-gray-900 mb-3">{selectedPublication.title}</h2>
                <p className="text-sm text-gray-600 mb-2"><strong>{t('publications.modal.authors')}:</strong> {selectedPublication.authors}</p>
                <p className="text-sm text-gray-900 font-medium mb-2">{selectedPublication.journal}</p>
                <p className="text-sm text-gray-600 mb-3"><strong>{t('publications.modal.year')}:</strong> {selectedPublication.year}</p>
                
                {selectedPublication.doi && (
                  <p className="text-gray-600 mb-4"><strong>{t('publications.modal.doi')}:</strong> {selectedPublication.doi}</p>
                )}
                
                {selectedPublication.citations !== undefined && (
                  <p className="text-gray-600 mb-4"><strong>{t('publications.modal.citationsCount')}:</strong> {selectedPublication.citations}</p>
                )}
                
                <div className="mb-5">
                  <h3 className="text-base font-semibold text-gray-900 mb-2">{t('publications.modal.abstract')}</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{selectedPublication.abstract}</p>
                </div>
                
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">{t('publications.modal.keywords')}</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedPublication.keywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="bg-gray-50 text-gray-600 px-3 py-1 rounded text-sm"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </SimpleMotion>
          </SimpleMotion>
        )}
      </div>
    </div>
  );
}