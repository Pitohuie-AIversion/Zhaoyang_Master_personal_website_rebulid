import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useTranslation } from '../../../common/TranslationProvider';

export interface ActiveFiltersProps {
  filters: { [key: string]: string[] };
  filterLabels: { [key: string]: string };
  optionLabels: { [key: string]: { [value: string]: string } };
  onRemoveFilter: (filterKey: string, value: string) => void;
  onClearAll: () => void;
  activeFiltersText?: string;
  clearAllText?: string;
}

export const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  filters,
  filterLabels,
  optionLabels,
  onRemoveFilter,
  onClearAll,
  activeFiltersText,
  clearAllText,
}) => {
  const { t } = useTranslation();
  const activeFilters = Object.entries(filters).filter(([, values]) => values.length > 0);

  if (activeFilters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-gray-600 dark:text-gray-400">
        {activeFiltersText || (t('common.activeFilters') as string)}
      </span>
      {activeFilters.map(([filterKey, values]) =>
        values.map((value) => {
          const filterLabel = filterLabels[filterKey] || filterKey;
          const valueLabel = optionLabels[filterKey]?.[value] || value;

          return (
            <motion.div
              key={`${filterKey}-${value}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm"
            >
              <span>
                {filterLabel}: {valueLabel}
              </span>
              <button
                type="button"
                onClick={() => onRemoveFilter(filterKey, value)}
                aria-label={`${t('common.close') as string} ${filterLabel}: ${valueLabel}`}
                className="hover:bg-blue-200 dark:hover:bg-blue-800/50 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </motion.div>
          );
        })
      )}
      <button
        type="button"
        onClick={onClearAll}
        className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
      >
        {clearAllText || (t('common.clearAll') as string)}
      </button>
    </div>
  );
};
