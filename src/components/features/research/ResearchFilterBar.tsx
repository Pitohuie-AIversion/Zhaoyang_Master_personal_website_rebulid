import React from 'react';
import { Search, BarChart3 } from 'lucide-react';
import { UnifiedButton } from '../../common/UnifiedButton';
import { useTranslation } from '../../common/TranslationProvider';

export interface ResearchFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterType: 'all' | 'publications' | 'patents' | 'awards';
  onFilterTypeChange: (type: 'all' | 'publications' | 'patents' | 'awards') => void;
  publicationFilter: 'all' | 'published' | 'under_review';
  onPublicationFilterChange: (status: 'all' | 'published' | 'under_review') => void;
  showAnalytics: boolean;
  onToggleAnalytics: () => void;
}

export const ResearchFilterBar: React.FC<ResearchFilterBarProps> = ({
  searchTerm,
  onSearchChange,
  filterType,
  onFilterTypeChange,
  publicationFilter,
  onPublicationFilterChange,
  showAnalytics,
  onToggleAnalytics,
}) => {
  const { t } = useTranslation();

  return (
    <div className="card-dark rounded-lg shadow-md-dark p-4 sm:p-6 mb-8 theme-transition">
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* 搜索框 */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={t('research.searchPlaceholder') as string}
            aria-label={t('research.searchPlaceholder') as string}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
          />
        </div>

        {/* 过滤器与分析切换 */}
        <div className="flex flex-wrap gap-2 sm:gap-3 items-center">
          <select
            value={filterType}
            aria-label={t('research.filters.allTypes') as string}
            onChange={(e) =>
              onFilterTypeChange(e.target.value as 'all' | 'publications' | 'patents' | 'awards')
            }
            className="px-3 sm:px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
          >
            <option value="all">{t('research.filters.allTypes') as string}</option>
            <option value="publications">{t('research.filters.publications') as string}</option>
            <option value="patents">{t('research.filters.patents') as string}</option>
            <option value="awards">{t('research.filters.awards') as string}</option>
          </select>

          {filterType === 'publications' && (
            <select
              value={publicationFilter}
              aria-label={t('research.filters.allStatus') as string}
              onChange={(e) =>
                onPublicationFilterChange(e.target.value as 'all' | 'published' | 'under_review')
              }
              className="px-3 sm:px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
            >
              <option value="all">{t('research.filters.allStatus') as string}</option>
              <option value="published">{t('research.filters.published') as string}</option>
              <option value="under_review">{t('research.filters.underReview') as string}</option>
            </select>
          )}

          <UnifiedButton
            onClick={onToggleAnalytics}
            variant={showAnalytics ? 'primary' : 'outline'}
            size="md"
            icon={<BarChart3 className="w-4 h-4" />}
            className="whitespace-nowrap"
            ariaLabel={
              showAnalytics
                ? (t('research.analytics.hideAnalytics') as string)
                : (t('research.analytics.showAnalytics') as string)
            }
            ariaExpanded={showAnalytics}
          >
            {showAnalytics
              ? (t('research.analytics.hideAnalytics') as string)
              : (t('research.analytics.showAnalytics') as string)}
          </UnifiedButton>
        </div>
      </div>
    </div>
  );
};

export default ResearchFilterBar;
