import React from 'react';
import { useTranslation } from '../../../common/TranslationProvider';

export interface SearchStatsProps {
  totalResults: number;
  filteredResults: number;
  searchTerm: string;
  className?: string;
  itemsText?: string;
}

export const SearchStats: React.FC<SearchStatsProps> = ({
  totalResults,
  filteredResults,
  searchTerm,
  className = '',
  itemsText,
}) => {
  const { t } = useTranslation();

  const itemsLabel = itemsText || (t('common.searchResults.items') as string);

  return (
    <div className={`text-sm text-gray-600 dark:text-gray-400 ${className}`}>
      {searchTerm ? (
        <span>
          {(t('common.searchResults.found') as string)}{' '}
          <strong className="text-gray-900 dark:text-white">{filteredResults}</strong>{' '}
          {(t('common.searchResults.results') as string)}
          {searchTerm && (
            <span>
              {' '}
              {(t('common.searchResults.containing') as string)} "
              <strong className="text-blue-600 dark:text-blue-400">{searchTerm}</strong>"
            </span>
          )}
        </span>
      ) : (
        <span>
          {(t('common.searchResults.showing') as string)}{' '}
          <strong className="text-gray-900 dark:text-white">{filteredResults}</strong>{' '}
          {(t('common.searchResults.of') as string)} {totalResults} {itemsLabel}
        </span>
      )}
    </div>
  );
};
