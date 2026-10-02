import React from 'react';
import { TrendingUp } from 'lucide-react';
import { SearchResult } from '../../../../services/searchService';
import { SearchResultItem } from './SearchResultItem';

export interface SearchResultsListProps {
  isLoading: boolean;
  results: SearchResult[];
  query: string;
  hasHistory: boolean;
  onResultClick: (result: SearchResult) => void;
  getTypeLabel: (type: SearchResult['type']) => string;
  getResultIcon: (type: SearchResult['type']) => string;
  t: (key: string) => string;
}

export const SearchResultsList: React.FC<SearchResultsListProps> = ({
  isLoading,
  results,
  query,
  hasHistory,
  onResultClick,
  getTypeLabel,
  getResultIcon,
  t
}) => {
  return (
    <div className="max-h-96 overflow-y-auto">
      {isLoading && (
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            {t('search.searching') || '搜索中...'}
          </p>
        </div>
      )}

      {!isLoading && results.length > 0 && (
        <div className="p-2">
          {results.map((result) => (
            <SearchResultItem
              key={result.id}
              result={result}
              onClick={() => onResultClick(result)}
              getTypeLabel={getTypeLabel}
              getResultIcon={getResultIcon}
            />
          ))}
        </div>
      )}

      {!isLoading && query.trim() && results.length === 0 && (
        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
          <p className="text-lg mb-2">{t('search.noResults') || '未找到相关结果'}</p>
          <p className="text-sm">
            {t('search.tryDifferentKeywords') || '请尝试使用不同的关键词搜索'}
          </p>
        </div>
      )}

      {!isLoading && !query.trim() && !hasHistory && (
        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
          <TrendingUp className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm">
            {t('search.startTyping') || '输入关键词开始全局搜索'}
          </p>
        </div>
      )}
    </div>
  );
};
