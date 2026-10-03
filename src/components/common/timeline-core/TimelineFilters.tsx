import React from 'react';
import { Filter } from 'lucide-react';
import { TimelineSortBy, TimelineSortOrder } from './types';
import { allTimelineTypes, getTypeLabel } from './timelineHelpers';

export interface TimelineFiltersProps {
  selectedTypes: string[];
  onToggleType: (type: string) => void;
  onClearTypes: () => void;
  sortBy: TimelineSortBy;
  onSortByChange: (sortBy: TimelineSortBy) => void;
  sortOrder: TimelineSortOrder;
  onToggleSortOrder: () => void;
  t: (key: string) => string;
}

export const TimelineFilters: React.FC<TimelineFiltersProps> = ({
  selectedTypes,
  onToggleType,
  onClearTypes,
  sortBy,
  onSortByChange,
  sortOrder,
  onToggleSortOrder,
  t
}) => {
  return (
    <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('timeline.filters') || '筛选'}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {allTimelineTypes.map(type => (
            <button
              key={type}
              onClick={() => onToggleType(type)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                selectedTypes.includes(type)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {getTypeLabel(type, t)}
            </button>
          ))}
          {selectedTypes.length > 0 && (
            <button
              onClick={onClearTypes}
              className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800 transition-colors"
            >
              {t('timeline.clearFilters') || '清除筛选'}
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('timeline.sortBy') || '排序'}
          </span>
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as TimelineSortBy)}
            className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="date">{t('timeline.sortByDate') || '按日期'}</option>
            <option value="type">{t('timeline.sortByType') || '按类型'}</option>
            <option value="title">{t('timeline.sortByTitle') || '按标题'}</option>
          </select>
        </div>
        <button
          onClick={onToggleSortOrder}
          className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-gray-700 dark:text-gray-300 transition-colors"
          aria-label={sortOrder === 'desc' ? '降序' : '升序'}
        >
          {sortOrder === 'desc' ? '↓' : '↑'}
        </button>
      </div>
    </div>
  );
};
