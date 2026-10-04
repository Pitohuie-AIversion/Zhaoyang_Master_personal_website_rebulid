import React from 'react';
import { useTranslation } from '../../../common/TranslationProvider';

interface ContactMessageFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
}

export const ContactMessageFilterBar: React.FC<ContactMessageFilterBarProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg shadow p-6 mb-8">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('contact.admin.filter.searchLabel') as string}
          </label>
          <input
            type="text"
            placeholder={t('contact.admin.filter.searchPlaceholder') as string}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="md:w-48">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('contact.admin.filter.statusLabel') as string}
          </label>
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">{t('contact.admin.filter.allStatuses') as string}</option>
            <option value="new">{t('contact.admin.status.new') as string}</option>
            <option value="read">{t('contact.admin.status.read') as string}</option>
            <option value="replied">{t('contact.admin.status.replied') as string}</option>
            <option value="archived">{t('contact.admin.status.archived') as string}</option>
          </select>
        </div>
      </div>
    </div>
  );
};

