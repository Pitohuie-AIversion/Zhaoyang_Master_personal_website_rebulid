import React from 'react';
import { BookOpen, Eye } from 'lucide-react';
import { SimpleMotion } from '../../animations/SimpleMotion';
import { UnifiedButton } from '../../common/UnifiedButton';
import { useTranslation } from '../../common/TranslationProvider';
import type { AcademicPublication } from '../../../types';

export interface ResearchPublicationsSectionProps {
  publications: AcademicPublication[];
  onOpenModal: (pub: AcademicPublication) => void;
  getStatusColor: (status: string) => string;
}

export const ResearchPublicationsSection: React.FC<ResearchPublicationsSectionProps> = ({
  publications,
  onOpenModal,
  getStatusColor,
}) => {
  const { t } = useTranslation();

  return (
    <div className="card-dark rounded-lg shadow-md-dark p-4 sm:p-6 mb-8 theme-transition">
      <div className="flex items-center mb-6">
        <BookOpen className="w-6 h-6 text-blue-500 mr-3" />
        <h3 className="text-xl font-semibold text-primary-dark theme-transition">
          {t('research.publications.title') as string}
        </h3>
        <span className="ml-auto text-sm text-secondary-dark theme-transition">
          {(t('research.totalCount') as string)
            .replace('{{count}}', publications.length.toString())
            .replace('{{unit}}', t('research.papers') as string)}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-6">
        {publications.map((pub) => (
          <SimpleMotion
            key={pub.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-l-4 border-blue-500 pl-4 sm:pl-6 hover:bg-gray-50 dark:hover:bg-gray-800/40 p-3 sm:p-4 rounded-r-lg transition-colors"
          >
            <h4 className="text-lg font-medium text-primary-dark theme-transition mb-2">
              {pub.title}
            </h4>
            <p className="text-sm text-secondary-dark theme-transition mb-3">
              {pub.description}
            </p>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {pub.journal}
              </span>
              <span className="text-sm text-gray-500">·</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">{pub.year}</span>
              {pub.doi && (
                <>
                  <span className="text-sm text-gray-500">·</span>
                  <a
                    href={`https://doi.org/${pub.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    DOI: {pub.doi}
                  </a>
                </>
              )}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <span className={`text-xs px-2 py-1 rounded ${getStatusColor(pub.status)}`}>
                  {pub.status === 'published'
                    ? (t('research.status.published') as string)
                    : pub.status === 'accepted'
                    ? (t('research.status.accepted') as string)
                    : pub.status === 'under_review'
                    ? (t('research.status.underReview') as string)
                    : (t('research.status.preparing') as string)}
                </span>
                <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-2 py-1 rounded">
                  {pub.type === 'journal'
                    ? (t('research.type.journal') as string)
                    : (t('research.type.conference') as string)}
                </span>
                <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded">
                  {t('research.authors') as string}: {pub.authors.join(', ')}
                </span>
              </div>
              <UnifiedButton
                onClick={() => onOpenModal(pub)}
                variant="ghost"
                size="sm"
                icon={<Eye className="w-4 h-4" />}
                title={t('research.viewDetails') as string}
              />
            </div>
          </SimpleMotion>
        ))}
      </div>
    </div>
  );
};

export default ResearchPublicationsSection;
