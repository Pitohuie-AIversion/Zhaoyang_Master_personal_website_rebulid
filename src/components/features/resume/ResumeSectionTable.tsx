import React from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useTranslation } from '../../common/TranslationProvider';

export interface ResumeSectionTableProps {
  title: string;
  items: unknown[];
  sectionKey: string;
  fields: string[];
  onEdit: (sectionKey: string, item: unknown) => void;
  onDelete: (sectionKey: string, id: string) => void;
}

export const ResumeSectionTable: React.FC<ResumeSectionTableProps> = ({
  title,
  items,
  sectionKey,
  fields,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation();

  const getFieldLabel = (field: string): string => {
    const key = `common.resume.fields.${field}`;
    const translated = t(key);
    if (translated && translated !== key) return translated as string;
    return field.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const renderHeader = () => (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{title}</h3>
      <button
        onClick={() => onEdit(sectionKey, {})}
        aria-label={t('common.add', { fallback: 'Add' }) as string}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium shadow-sm"
      >
        <Plus size={15} />
        {t('common.add', { fallback: 'Add' }) as string}
      </button>
    </div>
  );

  if (!items || items.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 border border-gray-200 dark:border-gray-700 theme-transition mb-6">
        {renderHeader()}
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          {t('common.noData', { fallback: 'No data available' }) as string}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 border border-gray-200 dark:border-gray-700 theme-transition mb-6">
      {renderHeader()}

      <div className="space-y-4">
        {items.map((item) => {
          const typedItem = item as Record<string, unknown>;
          const primaryTitle = (
            typedItem.title ||
            typedItem.degree ||
            typedItem.position ||
            typedItem.skill_name ||
            typedItem.language ||
            typedItem.name ||
            (t('common.untitled', { fallback: 'Untitled' }) as string)
          ) as string;

          return (
            <div
              key={typedItem.id as string}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900/40 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {primaryTitle}
                </h4>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(sectionKey, item)}
                    className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors"
                    title={t('common.edit', { fallback: 'Edit' }) as string}
                    aria-label={t('common.edit', { fallback: 'Edit' }) as string}
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => onDelete(sectionKey, typedItem.id as string)}
                    className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
                    title={t('common.delete', { fallback: 'Delete' }) as string}
                    aria-label={t('common.delete', { fallback: 'Delete' }) as string}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-300">
                {fields.map((field) => {
                  const value = typedItem[field];
                  if (!value) return null;

                  return (
                    <div key={field}>
                      <span className="font-medium text-gray-700 dark:text-gray-400">
                        {getFieldLabel(field)}:{' '}
                      </span>
                      <span>{Array.isArray(value) ? value.join(', ') : String(value)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResumeSectionTable;
