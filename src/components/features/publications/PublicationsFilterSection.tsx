import React from 'react';
import {
  SearchInput,
  FilterDropdown,
  SortDropdown,
  ActiveFilters,
  SearchStats,
} from '../search/SearchAndFilter';

export interface PublicationsFilterSectionProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  typeTitle: string;
  typeOptions: Array<{ value: string; label: string }>;
  selectedTypeValues: string[];
  onTypeChange: (values: string[]) => void;
  sortOptions: Array<{ value: string; label: string; direction: 'asc' | 'desc' }>;
  selectedSort: string;
  onSortChange: (value: string) => void;
  filters: Record<string, string[]>;
  onRemoveFilter: (key: string, value: string) => void;
  onClearAll: () => void;
  filterLabels: Record<string, string>;
  optionLabels: Record<string, Record<string, string>>;
  totalCount: number;
  filteredCount: number;
  itemsText: string;
}

export const PublicationsFilterSection: React.FC<PublicationsFilterSectionProps> = ({
  searchTerm,
  onSearchChange,
  searchPlaceholder,
  typeTitle,
  typeOptions,
  selectedTypeValues,
  onTypeChange,
  sortOptions,
  selectedSort,
  onSortChange,
  filters,
  onRemoveFilter,
  onClearAll,
  filterLabels,
  optionLabels,
  totalCount,
  filteredCount,
  itemsText,
}) => {
  return (
    <div className="space-y-4 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <SearchInput
            value={searchTerm}
            onChange={onSearchChange}
            placeholder={searchPlaceholder}
          />
        </div>

        <FilterDropdown
          title={typeTitle}
          options={typeOptions}
          selectedValues={selectedTypeValues}
          onChange={onTypeChange}
        />

        <SortDropdown
          options={sortOptions}
          selectedSort={selectedSort}
          onChange={onSortChange}
        />
      </div>

      <ActiveFilters
        filters={filters}
        onRemoveFilter={onRemoveFilter}
        onClearAll={onClearAll}
        filterLabels={filterLabels}
        optionLabels={optionLabels}
      />

      <SearchStats
        totalResults={totalCount}
        filteredResults={filteredCount}
        searchTerm={searchTerm}
        itemsText={itemsText}
      />
    </div>
  );
};
