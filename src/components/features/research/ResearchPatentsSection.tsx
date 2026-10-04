import React from 'react';
import { FileText, Eye } from 'lucide-react';
import { SimpleMotion } from '../../animations/SimpleMotion';
import { UnifiedButton } from '../../common/UnifiedButton';
import { useTranslation } from '../../common/TranslationProvider';
import type { AcademicPatent } from '../../../types';

export interface ResearchPatentsSectionProps {
  patents: AcademicPatent[];
  onOpenModal: (patent: AcademicPatent) => void;
  getStatusColor: (status: string) => string;
}

export const ResearchPatentsSection: React.FC<ResearchPatentsSectionProps> = ({
  patents,
  onOpenModal,
  getStatusColor,
}) => {
  const { t } = useTranslation();

  return (
    <div className="card-dark rounded-lg shadow-md-dark p-4 sm:p-6 mb-8 theme-transition">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center mr-3 flex-shrink-0 theme-transition">
          <FileText className="w-5 h-5" />
        </div>
        <h3 className="text-xl md:text-2xl font-semibold text-primary-dark theme-transition">
          {t('research.patents.title') as string}
        </h3>
        <span className="ml-auto text-sm text-secondary-dark theme-transition font-medium">
          {(t('research.totalCount') as string)
            .replace('{{count}}', patents.length.toString())
            .replace('{{unit}}', t('research.items') as string)}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-6">
        {patents.map((patent) => (
          <SimpleMotion
            key={patent.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-l-4 border-purple-500 pl-4 sm:pl-6 hover:bg-gray-50 dark:hover:bg-gray-800/40 p-3 sm:p-4 rounded-r-lg transition-colors"
          >
            <h4 className="text-lg font-medium text-primary-dark theme-transition mb-2">
              {patent.title}
            </h4>
            <p className="text-sm text-secondary-dark theme-transition mb-3">
              {patent.description}
            </p>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <a
                href={`https://patents.google.com/patent/${patent.number}/zh`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                {t('research.patentNumber') as string}: {patent.number}
              </a>
              <span className="text-sm text-gray-500">·</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {t('research.applicant') as string}: {patent.applicant}
              </span>
              <span className="text-sm text-gray-500">·</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {t('research.applicationDate') as string}: {patent.applicationDate}
              </span>
              <span className="text-sm text-gray-500">·</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {t('research.publicDate') as string}: {patent.publicDate}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                <span className={`text-xs px-2 py-1 rounded ${getStatusColor(patent.status)}`}>
                  {patent.status === 'granted'
                    ? (t('research.status.granted') as string)
                    : patent.status === 'published'
                    ? (t('research.status.published') as string)
                    : (t('research.status.underReview') as string)}
                </span>
                <span className="text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 px-2 py-1 rounded">
                  {patent.type === 'invention'
                    ? (t('research.patentType.invention') as string)
                    : patent.type === 'utility'
                    ? (t('research.patentType.utility') as string)
                    : (t('research.patentType.design') as string)}
                </span>
              </div>
              <UnifiedButton
                onClick={() => onOpenModal(patent)}
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

export default ResearchPatentsSection;
