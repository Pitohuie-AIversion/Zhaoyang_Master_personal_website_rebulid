import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, ChevronDown, SortAsc, SortDesc, Calendar, Tag, User } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';
import { useTranslation } from './TranslationProvider';

// 搜索输入组件
interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  onFocus?: () => void;
  onBlur?: () => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder,
  className = '',
  onFocus,
  onBlur
}) => {
  const { t } = useTranslation();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => {
            setIsFocused(true);
            onFocus?.();
          }}
          onBlur={() => {
            setIsFocused(false);
            onBlur?.();
          }}
          placeholder={placeholder || t('common.searchPlaceholder')}
          className={`
            w-full pl-10 pr-4 py-2 rounded-lg border transition-all duration-200
            ${isFocused 
              ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-lg' 
              : 'border-gray-300 dark:border-gray-600'
            }
            bg-white dark:bg-gray-800 text-gray-900 dark:text-white
            placeholder-gray-500 dark:placeholder-gray-400
            focus:outline-none
          `}
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

// 筛选选项接口
interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface FilterDropdownProps {
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
  clearAllText
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (value: string) => {
    if (multiple) {
      const newValues = selectedValues.includes(value)
        ? selectedValues.filter(v => v !== value)
        : [...selectedValues, value];
      onChange(newValues);
    } else {
      onChange([value]);
      setIsOpen(false);
    }
  };

  const selectedCount = selectedValues.length;
  const displayText = selectedCount === 0 
    ? title 
    : selectedCount === 1 
      ? options.find(opt => opt.value === selectedValues[0])?.label || title
      : `${title} (${selectedCount})`;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200
          ${selectedCount > 0 
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
                    key={option.value}
                    onClick={() => handleOptionClick(option.value)}
                    className={`
                      w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors
                      ${isSelected 
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
                   onClick={() => onChange([])}
                   className="w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                 >
                   {clearAllText || t('common.clearAllFilters')}
                 </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 点击外部关闭 */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

// 排序选项
interface SortOption {
  value: string;
  label: string;
  direction: 'asc' | 'desc';
}

interface SortDropdownProps {
  options: SortOption[];
  selectedSort: string;
  onChange: (sortValue: string) => void;
}

export const SortDropdown: React.FC<SortDropdownProps> = ({
  options,
  selectedSort,
  onChange
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  
  // 解析当前选中的排序值和方向
  const [sortField, sortDirection] = selectedSort.includes('_desc') 
    ? [selectedSort.replace('_desc', ''), 'desc'] 
    : [selectedSort, 'asc'];
  
  const selectedOption = options.find(opt => opt.value === sortField);
  const currentDirection = selectedOption?.direction || 'asc';
  const SortIcon = currentDirection === 'desc' ? SortDesc : SortAsc;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-blue-400 hover:shadow-md transition-all duration-200"
      >
        <SortIcon className="w-4 h-4" />
        <span className="text-sm font-medium">
           {selectedOption ? selectedOption.label : t('common.sortBy')}
         </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
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
                    key={option.value}
                    onClick={() => {
                      // 根据选项的默认方向构建排序值
                      const sortValue = option.direction === 'desc' 
                        ? `${option.value}_desc` 
                        : option.value;
                      onChange(sortValue);
                      setIsOpen(false);
                    }}
                    className={`
                      w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors
                      ${isSelected 
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
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

// 活跃筛选标签
interface ActiveFiltersProps {
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
  clearAllText
}) => {
  const { t } = useTranslation();
  const activeFilters = Object.entries(filters).filter(([_, values]) => values.length > 0);
  
  if (activeFilters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
       <span className="text-sm text-gray-600 dark:text-gray-400">
         {activeFiltersText || t('common.activeFilters')}
       </span>
      {activeFilters.map(([filterKey, values]) => 
        values.map(value => {
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
              <span>{filterLabel}: {valueLabel}</span>
              <button
                onClick={() => onRemoveFilter(filterKey, value)}
                className="hover:bg-blue-200 dark:hover:bg-blue-800/50 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </motion.div>
          );
        })
      )}
      <button
         onClick={onClearAll}
         className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
       >
         {clearAllText || t('common.clearAll')}
       </button>
    </div>
  );
};

// 搜索结果统计
interface SearchStatsProps {
  totalResults: number;
  filteredResults: number;
  searchTerm: string;
  className?: string;
}

export const SearchStats: React.FC<SearchStatsProps> = ({
  totalResults,
  filteredResults,
  searchTerm,
  className = ''
}) => {
  const { t } = useTranslation();
  
  return (
    <div className={`text-sm text-gray-600 dark:text-gray-400 ${className}`}>
      {searchTerm ? (
        <span>
          {t('common.searchResults.found')} <strong className="text-gray-900 dark:text-white">{filteredResults}</strong> {t('common.searchResults.results')}
          {searchTerm && (
            <span> {t('common.searchResults.containing')} "<strong className="text-blue-600 dark:text-blue-400">{searchTerm}</strong>"
            </span>
          )}
        </span>
      ) : (
        <span>
          {t('common.searchResults.showing')} <strong className="text-gray-900 dark:text-white">{filteredResults}</strong> {t('common.searchResults.of')} {totalResults} {t('common.searchResults.items')}
        </span>
      )}
    </div>
  );
};

// 高级搜索Hook
interface UseAdvancedSearchProps<T> {
  data: T[];
  searchFields: (keyof T)[];
  filterFields?: { [key: string]: (item: T) => string | string[] };
  sortFields?: { [key: string]: (item: T) => any };
  debounceMs?: number;
  // 新增：搜索字段映射函数，用于将代码值转换为可搜索的文本
  searchFieldMappers?: { [key: string]: (item: T) => string[] };
}

export function useAdvancedSearch<T>({
  data,
  searchFields,
  filterFields = {},
  sortFields = {},
  debounceMs = 300,
  searchFieldMappers = {}
}: UseAdvancedSearchProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<{ [key: string]: string[] }>({});
  const [sortBy, setSortBy] = useState('');
  
  const debouncedSearchTerm = useDebounce(searchTerm, debounceMs);

  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    // 应用搜索
    if (debouncedSearchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      result = result.filter(item => 
        searchFields.some(field => {
          const value = item[field];
          
          // 检查原始字段值
          if (typeof value === 'string') {
            if (value.toLowerCase().includes(searchLower)) {
              return true;
            }
          }
          if (Array.isArray(value)) {
            if (value.some(v => 
              typeof v === 'string' && v.toLowerCase().includes(searchLower)
            )) {
              return true;
            }
          }
          
          // 检查映射后的搜索字段
          const fieldKey = String(field);
          if (searchFieldMappers[fieldKey]) {
            const mappedValues = searchFieldMappers[fieldKey](item);
            if (mappedValues.some(mappedValue => 
              mappedValue.toLowerCase().includes(searchLower)
            )) {
              return true;
            }
          }
          
          return false;
        })
      );
    }

    // 应用筛选
    Object.entries(filters).forEach(([filterKey, filterValues]) => {
      if (filterValues.length > 0 && filterFields[filterKey]) {
        result = result.filter(item => {
          const itemValue = filterFields[filterKey](item);
          if (Array.isArray(itemValue)) {
            return filterValues.some(fv => itemValue.includes(fv));
          }
          return filterValues.includes(itemValue as string);
        });
      }
    });

    // 应用排序
    if (sortBy && sortFields) {
      // 解析排序字段和方向
      const isDescending = sortBy.includes('_desc');
      const sortField = isDescending ? sortBy.replace('_desc', '') : sortBy;
      
      if (sortFields[sortField]) {
        result.sort((a, b) => {
          const aValue = sortFields[sortField](a);
          const bValue = sortFields[sortField](b);
          
          let comparison = 0;
          if (typeof aValue === 'string' && typeof bValue === 'string') {
            comparison = aValue.localeCompare(bValue);
          } else if (typeof aValue === 'number' && typeof bValue === 'number') {
            comparison = aValue - bValue;
          } else if (aValue instanceof Date && bValue instanceof Date) {
            comparison = aValue.getTime() - bValue.getTime();
          }
          
          // 如果是降序，反转比较结果
          return isDescending ? -comparison : comparison;
        });
      }
    }

    return result;
  }, [data, debouncedSearchTerm, filters, sortBy, searchFields, filterFields, sortFields, searchFieldMappers]);

  const updateFilter = useCallback((filterKey: string, values: string[]) => {
    setFilters(prev => ({ ...prev, [filterKey]: values }));
  }, []);

  const removeFilter = useCallback((filterKey: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: prev[filterKey]?.filter(v => v !== value) || []
    }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters({});
    setSearchTerm('');
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    filters,
    updateFilter,
    removeFilter,
    clearAllFilters,
    sortBy,
    setSortBy,
    filteredData: filteredAndSortedData,
    totalCount: data.length,
    filteredCount: filteredAndSortedData.length
  };
}

// 导出所有组件和Hook
export default {
  SearchInput,
  FilterDropdown,
  SortDropdown,
  ActiveFilters,
  SearchStats,
  useAdvancedSearch
};