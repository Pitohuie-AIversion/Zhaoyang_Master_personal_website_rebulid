import React from 'react';
import type { SortByOption } from './types';
import { useTranslation } from '../../../common/TranslationProvider';

export interface PublicationListControlsProps {
  sortBy: SortByOption;
  onSortByChange: (value: SortByOption) => void;
  filterYear: string;
  onFilterYearChange: (value: string) => void;
  yearOptions: string[];
}

export const PublicationListControls: React.FC<PublicationListControlsProps> = ({
  sortBy,
  onSortByChange,
  filterYear,
  onFilterYearChange,
  yearOptions,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <div className="flex items-center space-x-2">
        <label className="text-sm font-medium text-gray-700">
          {t('academic.papers.sortBy') as string}:
        </label>
        <select
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value as SortByOption)}
          className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="year">{t('academic.papers.year') as string}</option>
          <option value="citations">{t('academic.papers.citations') as string}</option>
          <option value="velocity">{t('academic.papers.citationVelocity') as string}</option>
        </select>
      </div>

      <div className="flex items-center space-x-2">
        <label className="text-sm font-medium text-gray-700">
          {t('academic.papers.filterYear') as string}:
        </label>
        <select
          value={filterYear}
          onChange={(e) => onFilterYearChange(e.target.value)}
          className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">{t('academic.papers.allYears') as string}</option>
          {yearOptions.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
