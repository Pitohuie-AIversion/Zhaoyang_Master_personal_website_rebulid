import React, { useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { SearchResult } from '../../../services/searchService';
import { useTranslation } from '../../common/TranslationProvider';
import { SimpleMotion } from '../../animations/SimpleMotion';
import {
  SearchFilterPanel,
  SearchHistoryList,
  SearchSuggestionsList,
  SearchResultsList,
  SearchDialogHeader,
  SearchDialogFooter,
  getTypeLabel,
  getResultIcon
} from './components';
import { useSmartSearch } from './hooks/useSmartSearch';
import { useSearchFocusTrap } from './hooks/useSearchFocusTrap';

export interface SmartSearchProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  placeholder?: string;
}

export const SmartSearch: React.FC<SmartSearchProps> = ({
  isOpen,
  onClose,
  initialQuery = '',
  placeholder
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const {
    query,
    setQuery,
    results,
    suggestions,
    isLoading,
    showFilters,
    setShowFilters,
    filters,
    setFilters,
    searchHistory,
    showHistory,
    setShowHistory,
    handleSuggestionClick,
    handleHistoryClick,
    clearSearchHistory
  } = useSmartSearch({ initialQuery });

  const { searchInputRef, dialogRef } = useSearchFocusTrap({ isOpen, onClose });

  const handleResultClick = useCallback((result: SearchResult) => {
    navigate(result.url);
    onClose();
  }, [navigate, onClose]);

  const getLocalizedTypeLabel = useCallback(
    (type: SearchResult['type']) => getTypeLabel(type, t),
    [t]
  );

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-start justify-center p-4 pt-16">
        <SimpleMotion
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden"
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={placeholder || (t('search.placeholder') as string) || '全局搜索'}
          >
            {/* 搜索输入头部 */}
            <SearchDialogHeader
              ref={searchInputRef}
              query={query}
              placeholder={placeholder}
              showFilters={showFilters}
              onQueryChange={setQuery}
              onFocus={() => setShowHistory(true)}
              onToggleFilters={() => setShowFilters(!showFilters)}
              onClose={onClose}
              t={t}
            />

            {/* 筛选面板 */}
            {showFilters && (
              <SearchFilterPanel
                filters={filters}
                onChange={setFilters}
                getTypeLabel={getLocalizedTypeLabel}
              />
            )}

            {/* 搜索建议 */}
            {query.length > 0 && (
              <SearchSuggestionsList
                suggestions={suggestions}
                onSelect={handleSuggestionClick}
              />
            )}

            {/* 搜索历史 */}
            {showHistory && query.length === 0 && (
              <SearchHistoryList
                history={searchHistory}
                onSelect={handleHistoryClick}
                onClear={clearSearchHistory}
              />
            )}

            {/* 搜索结果 */}
            <SearchResultsList
              isLoading={isLoading}
              results={results}
              query={query}
              hasHistory={searchHistory.length > 0}
              onResultClick={handleResultClick}
              getTypeLabel={getLocalizedTypeLabel}
              getResultIcon={getResultIcon}
              t={t}
            />

            {/* 底部帮助与统计 */}
            <SearchDialogFooter resultCount={results.length} />
          </div>
        </SimpleMotion>
      </div>
    </div>,
    document.body
  );
};
