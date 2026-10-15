import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from '../../../common/TranslationProvider';

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface FilterDropdownProps {
  title: string;
  options: FilterOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  icon?: React.ReactNode;
  multiple?: boolean;
  clearAllText?: string;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  title,
  options,
  selectedValues,
  onChange,
  icon,
  multiple = true,
  clearAllText,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (value: string) => {
    if (multiple) {
      const newValues = selectedValues.includes(value)
        ? selectedValues.filter((v) => v !== value)
        : [...selectedValues, value];
      onChange(newValues);
    } else {
      onChange([value]);
      setIsOpen(false);
    }
  };

  const selectedCount = selectedValues.length;
  const displayText =
    selectedCount === 0
      ? title
      : selectedCount === 1
      ? options.find((opt) => opt.value === selectedValues[0])?.label || title
      : `${title} (${selectedCount})`;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200
          ${
            selectedCount > 0
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
          }
          hover:border-blue-400 hover:shadow-md
        `}
      >
        {icon}
        <span className="text-sm font-medium">{displayText}</span>
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
            className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50"
          >
            <div className="p-2 max-h-64 overflow-y-auto">
              {options.map((option) => {
                const isSelected = selectedValues.includes(option.value);
                return (
                  <button
                    type="button"
                    role="menuitemcheckbox"
                    aria-checked={isSelected}
                    key={option.value}
                    onClick={() => handleOptionClick(option.value)}
                    className={`
                      w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors
                      ${
                        isSelected
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }
                    `}
                  >
                    <span>{option.label}</span>
                    {option.count !== undefined && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">({option.count})</span>
                    )}
                  </button>
                );
              })}
            </div>

            {multiple && selectedCount > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-700 p-2">
                <button
                  type="button"
                  onClick={() => onChange([])}
                  className="w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                >
                  {clearAllText || (t('common.clearAllFilters') as string)}
                </button>
              </div>
            )}
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
