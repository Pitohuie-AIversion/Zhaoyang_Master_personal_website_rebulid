import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, SortAsc, SortDesc } from 'lucide-react';
import { useTranslation } from '../../../common/TranslationProvider';

export interface SortOption {
  value: string;
  label: string;
  direction: 'asc' | 'desc';
}

export interface SortDropdownProps {
  options: SortOption[];
  selectedSort: string;
  onChange: (sortValue: string) => void;
}

export const SortDropdown: React.FC<SortDropdownProps> = ({
  options,
  selectedSort,
  onChange,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  // 解析当前选中的排序值
  const sortField = selectedSort.includes('_desc')
    ? selectedSort.replace('_desc', '')
    : selectedSort;

  const selectedOption = options.find((opt) => opt.value === sortField);
  const currentDirection = selectedOption?.direction || 'asc';
  const SortIcon = currentDirection === 'desc' ? SortDesc : SortAsc;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-blue-400 hover:shadow-md transition-all duration-200"
      >
        <SortIcon className="w-4 h-4" />
        <span className="text-sm font-medium">
          {selectedOption ? selectedOption.label : (t('common.sortBy') as string)}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50"
          >
            <div className="p-2">
              {options.map((option) => {
                const isSelected = sortField === option.value;
                const OptionIcon = option.direction === 'desc' ? SortDesc : SortAsc;

                return (
                  <button
                    type="button"
                    role="menuitemradio"
                    aria-checked={isSelected}
                    key={option.value}
                    onClick={() => {
                      const sortValue =
                        option.direction === 'desc'
                          ? `${option.value}_desc`
                          : option.value;
                      onChange(sortValue);
                      setIsOpen(false);
                    }}
                    className={`
                      w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors
                      ${
                        isSelected
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }
                    `}
                  >
                    <OptionIcon className="w-4 h-4" />
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 点击外部关闭 */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};
