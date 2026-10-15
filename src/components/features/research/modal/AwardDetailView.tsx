import React from 'react';
import { Award as AwardIcon, FileText, Calendar, Copy, Check } from 'lucide-react';
import { UnifiedButton } from '../../../common/UnifiedButton';
import { useTranslation } from '../../../common/TranslationProvider';
import { Award } from './types';
import { getLevelColor } from './modalHelpers';

interface AwardDetailViewProps {
  award: Award;
  copiedField: string | null;
  onCopy: (text: string, field: string) => void;
}

export const AwardDetailView: React.FC<AwardDetailViewProps> = ({
  award,
  copiedField,
  onCopy
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
          <AwardIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {award.title}
          </h2>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(award.level)}`}>
              {award.level === 'national' ? t('publications.levels.national') as string : 
               award.level === 'provincial' ? t('publications.levels.provincial') as string : t('publications.levels.university') as string}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {award.description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <AwardIcon className="w-4 h-4 text-gray-500" />
            <span className="font-medium text-gray-900 dark:text-white">{t('publications.modal.organization') as string}</span>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
            <span className="text-gray-700 dark:text-gray-300">{award.organization}</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="font-medium text-gray-900 dark:text-white">{t('publications.modal.awardDate') as string}</span>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
            <span className="text-gray-700 dark:text-gray-300">{award.date}</span>
          </div>
        </div>

        {award.certificateNumber && (
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-500" />
              <span className="font-medium text-gray-900 dark:text-white">{t('publications.modal.certificateNumber') as string}</span>
            </div>
            <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <span className="text-gray-700 dark:text-gray-300 font-mono">{award.certificateNumber}</span>
              <UnifiedButton
                onClick={() => onCopy(award.certificateNumber!, 'certificate')}
                variant="ghost"
                size="sm"
                icon={copiedField === 'certificate' ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-400" />
                )}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
