import React, { forwardRef } from 'react';
import { Search, X, Filter } from 'lucide-react';

export interface SearchDialogHeaderProps {
  query: string;
  placeholder?: string;
  showFilters: boolean;
  onQueryChange: (query: string) => void;
  onFocus: () => void;
  onToggleFilters: () => void;
  onClose: () => void;
  t: (key: string) => string;
}

export const SearchDialogHeader = forwardRef<HTMLInputElement, SearchDialogHeaderProps>(
  ({
    query,
    placeholder,
    showFilters,
    onQueryChange,
    onFocus,
    onToggleFilters,
    onClose,
    t
  }, ref) => {
    return (
      <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <Search className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
        <input
          ref={ref}
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onFocus={onFocus}
          placeholder={placeholder || (t('search.placeholder') as string) || '全局搜索...'}
          className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 text-lg"
        />
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleFilters}
            className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
              showFilters ? 'text-blue-500' : 'text-gray-400'
            }`}
            aria-label={t('common.filter') || '筛选'}
          >
            <Filter className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 transition-colors"
            aria-label={t('common.close') || '关闭'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }
);

SearchDialogHeader.displayName = 'SearchDialogHeader';
