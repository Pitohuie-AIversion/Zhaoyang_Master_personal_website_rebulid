import { useState, useMemo, useCallback } from 'react';
import { useDebounce } from './useDebounce';

export interface UseAdvancedSearchProps<T> {
  data: T[];
  searchFields: (keyof T)[];
  filterFields?: { [key: string]: (item: T) => string | string[] };
  sortFields?: { [key: string]: (item: T) => string | number | Date };
  debounceMs?: number;
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
