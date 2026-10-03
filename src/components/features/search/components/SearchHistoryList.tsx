import React from 'react';
import { Clock } from 'lucide-react';
import { useTranslation } from '../../../common/TranslationProvider';

interface SearchHistoryListProps {
  history: string[];
  onSelect: (item: string) => void;
  onClear: () => void;
}

export const SearchHistoryList: React.FC<SearchHistoryListProps> = ({
  history,
  onSelect,
  onClear
}) => {
  const { t } = useTranslation();

  if (history.length === 0) return null;

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            <Clock className="w-4 h-4 inline mr-1" />
            {t('search.recentSearches') || '最近搜索'}
          </h4>
          <button
            onClick={onClear}
            className="text-xs text-red-500 hover:text-red-700"
          >
            {t('common.clear') || '清除'}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {history.map((item, index) => (
            <button
              key={index}
              onClick={() => onSelect(item)}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-sm text-gray-700 dark:text-gray-300"
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
