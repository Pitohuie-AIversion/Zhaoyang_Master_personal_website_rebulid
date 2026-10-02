import React from 'react';
import type { SearchResult } from '../../../../services/searchService';
import { useTranslation } from '../../../common/TranslationProvider';

export interface SearchFilters {
  types: SearchResult['type'][];
  yearRange?: { start: number; end: number };
  minRelevance: number;
}

interface SearchFilterPanelProps {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
  getTypeLabel: (type: SearchResult['type']) => string;
}

export const SearchFilterPanel: React.FC<SearchFilterPanelProps> = ({
  filters,
  onChange,
  getTypeLabel
}) => {
  const { t } = useTranslation();

  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('search.contentTypes') || '内容类型'}
          </h4>
          <div className="flex flex-wrap gap-2">
            {(['publication', 'patent', 'award', 'project', 'skill', 'page'] as const).map(type => (
              <label key={type} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.types.includes(type)}
                  onChange={(e) => {
                    const newTypes = e.target.checked
                      ? [...filters.types, type]
                      : filters.types.filter(t => t !== type);
                    onChange({ ...filters, types: newTypes });
                  }}
                  className="mr-2"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {getTypeLabel(type)}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('search.minRelevance') || '最小相关度'}
          </h4>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={filters.minRelevance}
            onChange={(e) => onChange({ ...filters, minRelevance: parseFloat(e.target.value) })}
            className="w-full"
          />
          <div className="text-xs text-gray-500 mt-1">
            {Math.round(filters.minRelevance * 100)}%
          </div>
        </div>
      </div>
    </div>
  );
};
