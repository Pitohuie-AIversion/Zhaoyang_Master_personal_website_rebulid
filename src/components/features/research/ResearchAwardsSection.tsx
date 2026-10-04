import React from 'react';
import { Award, Eye } from 'lucide-react';
import { SimpleMotion } from '../../animations/SimpleMotion';
import { UnifiedButton } from '../../common/UnifiedButton';
import { useTranslation } from '../../common/TranslationProvider';
import type { AcademicAward } from '../../../types';

export interface ResearchAwardsSectionProps {
  awards: AcademicAward[];
  onOpenModal: (award: AcademicAward) => void;
  getLevelColor: (level: string) => string;
}

export const ResearchAwardsSection: React.FC<ResearchAwardsSectionProps> = ({
  awards,
  onOpenModal,
  getLevelColor,
}) => {
  const { t } = useTranslation();

  return (
    <div className="card-dark rounded-lg shadow-md-dark p-6 mb-8 theme-transition">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mr-3 flex-shrink-0 theme-transition">
          <Award className="w-5 h-5" />
        </div>
        <h3 className="text-xl md:text-2xl font-semibold text-primary-dark theme-transition">
          {t('research.awards.title') as string}
        </h3>
        <span className="ml-auto text-sm text-secondary-dark theme-transition font-medium">
          {(t('research.totalCount') as string)
            .replace('{{count}}', awards.length.toString())
            .replace('{{unit}}', t('research.items') as string)}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        {awards.map((award) => (
          <SimpleMotion
            key={award.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-l-4 border-yellow-500 pl-6 hover:bg-gray-50 dark:hover:bg-gray-800/40 p-4 rounded-r-lg transition-colors"
          >
            <h4 className="text-lg font-medium text-primary-dark theme-transition mb-2">
              {award.title}
            </h4>
            <p className="text-sm text-secondary-dark theme-transition mb-3">
              {award.description}
            </p>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {award.organization}
              </span>
              <span className="text-sm text-gray-500">·</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">{award.date}</span>
              {award.certificateNumber && (
                <>
                  <span className="text-sm text-gray-500">·</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {t('research.certificateNumber') as string}: {award.certificateNumber}
                  </span>
                </>
              )}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                <span className={`text-xs px-2 py-1 rounded ${getLevelColor(award.level)}`}>
                  {award.level === 'national'
                    ? (t('research.level.national') as string)
                    : award.level === 'provincial'
                    ? (t('research.level.provincial') as string)
                    : (t('research.level.school') as string)}
                </span>
              </div>
              <UnifiedButton
                onClick={() => onOpenModal(award)}
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

export default ResearchAwardsSection;
