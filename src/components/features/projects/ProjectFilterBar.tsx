import React from 'react';
import { SimpleMotion } from '../../animations/SimpleMotion';
import {
  SearchInput,
  FilterDropdown,
  SortDropdown,
  ActiveFilters,
} from '../search/SearchAndFilter';
import { useTranslation } from '../../common/TranslationProvider';

export interface ProjectFilterBarProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  filterOptions: Record<string, { value: string; label: string; count?: number }[]>;
  filters: Record<string, string[]>;
  updateFilter: (key: string, values: string[]) => void;
  removeFilter: (key: string, value: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  sortOptions: { value: string; label: string; direction: 'asc' | 'desc' }[];
  categories: { value: string; label: string }[];
  yearOptions: string[];
}

export const ProjectFilterBar: React.FC<ProjectFilterBarProps> = ({
  searchTerm,
  onSearchChange,
  filterOptions,
  filters,
  updateFilter,
  removeFilter,
  sortBy,
  setSortBy,
  sortOptions,
  categories,
  yearOptions,
}) => {
  const { t } = useTranslation();

  return (
    <SimpleMotion
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mb-6 sm:mb-8"
    >
      {/* 高级搜索栏 */}
      <div className="flex flex-col gap-4 mb-4">
        <div className="w-full">
          <SearchInput
            value={searchTerm}
            onChange={onSearchChange}
            placeholder={t('projects.searchPlaceholder') as string}
            className="w-full"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <FilterDropdown
            title={t('projects.category') as string}
            options={filterOptions.category}
            selectedValues={filters.category || []}
            onChange={(values) => updateFilter('category', values)}
            multiple
          />
          <FilterDropdown
            title={t('projects.statusLabel') as string}
            options={filterOptions.status}
            selectedValues={filters.status || []}
            onChange={(values) => updateFilter('status', values)}
            multiple
          />
          <FilterDropdown
            title={t('projects.year') as string}
            options={filterOptions.year}
            selectedValues={filters.year || []}
            onChange={(values) => updateFilter('year', values)}
            multiple
          />
          <SortDropdown options={sortOptions} selectedSort={sortBy} onChange={setSortBy} />
        </div>
      </div>

      {/* 活跃筛选标签 */}
      <ActiveFilters
        filters={filters}
        filterLabels={{
          category: t('projects.category') as string,
          status: t('projects.statusLabel') as string,
          year: t('projects.year') as string,
        }}
        optionLabels={{
          category: Object.fromEntries(categories.map((cat) => [cat.value, cat.label])),
          status: {
            completed: t('projects.status.completed') as string,
            ongoing: t('projects.status.ongoing') as string,
            planned: t('projects.status.planned') as string,
          },
          year: Object.fromEntries(yearOptions.map((year) => [year, year])),
        }}
        activeFiltersText={t('projects.activeFilters') as string}
        clearAllText={t('projects.clearAll') as string}
        onRemoveFilter={removeFilter}
        onClearAll={() => {
          Object.keys(filters).forEach((key) => {
            if (filters[key].length > 0) {
              filters[key].forEach((value) => removeFilter(key, value));
            }
          });
        }}
      />
    </SimpleMotion>
  );
};

export default ProjectFilterBar;
