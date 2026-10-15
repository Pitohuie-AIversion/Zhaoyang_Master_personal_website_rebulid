import React from 'react';
import { SimpleMotion } from '../../animations/SimpleMotion';
import { useTranslation } from '../../common/TranslationProvider';
import { PublicationItem } from '../../../types';

export interface PublicationCardProps {
  publication: PublicationItem;
  index: number;
  onClick: () => void;
  getTypeIcon: (type: string) => React.ReactNode;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
  typeLabels: Record<string, string>;
}

export const PublicationCard: React.FC<PublicationCardProps> = ({
  publication,
  index,
  onClick,
  getTypeIcon,
  getStatusColor,
  getStatusText,
  typeLabels,
}) => {
  const { t } = useTranslation();

  return (
    <SimpleMotion
      as="button"
      type="button"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="card-dark w-full rounded-lg border border-gray-200 dark:border-gray-600 p-6 text-left hover:border-gray-300 dark:hover:border-gray-500 theme-transition duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      onClick={onClick}
      ariaLabel={publication.title}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-blue-600 dark:text-blue-400">
            {getTypeIcon(publication.type)}
          </div>
          <span className="text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded">
            {typeLabels[publication.type] || publication.type}
          </span>
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
              publication.status
            )}`}
          >
            {getStatusText(publication.status)}
          </span>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500 dark:text-gray-400">{publication.year}</div>
          {publication.citations !== undefined && (
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {t('publications.citations') as string}: {publication.citations}
            </div>
          )}
        </div>
      </div>

      <h3 className="text-lg font-semibold text-primary-dark theme-transition mb-2">
        {publication.title}
      </h3>
      {publication.authors && (
        <p className="text-sm text-secondary-dark theme-transition mb-2">
          {publication.authors}
        </p>
      )}
      <p className="text-sm text-primary-dark theme-transition font-medium mb-3">
        {publication.journal}
      </p>
      {publication.abstract && (
        <p className="text-sm text-secondary-dark theme-transition mb-3 line-clamp-2">
          {publication.abstract}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {Array.isArray(publication.keywords) &&
          publication.keywords.slice(0, 4).map((keyword, keywordIndex) => (
            <span
              key={keywordIndex}
              className="px-2 py-1 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200 text-xs rounded-md theme-transition"
            >
              {keyword}
            </span>
          ))}
        {Array.isArray(publication.keywords) && publication.keywords.length > 4 && (
          <span className="text-xs text-gray-400">
            +{publication.keywords.length - 4}
          </span>
        )}
      </div>
    </SimpleMotion>
  );
};

export default PublicationCard;
