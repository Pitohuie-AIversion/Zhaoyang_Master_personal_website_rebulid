import React from 'react';
import { useTranslation } from '../../../common/TranslationProvider';

export interface SearchDialogFooterProps {
  resultCount: number;
}

export const SearchDialogFooter: React.FC<SearchDialogFooterProps> = ({ resultCount }) => {
  const { t } = useTranslation();

  return (
    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center text-xs text-gray-500">
      <div className="flex gap-4">
        <span>{t('search.escClose') as string}</span>
        <span>{t('search.tabNavigate') as string}</span>
      </div>
      {resultCount > 0 && (
        <span>
          {(t('search.foundResults') as string).replace('{{count}}', String(resultCount))}
        </span>
      )}
    </div>
  );
};

