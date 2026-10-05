import React from 'react';
import { FileText, Calendar, Users, Copy, Check } from 'lucide-react';
import { UnifiedButton } from '../../../common/UnifiedButton';
import { useTranslation } from '../../../common/TranslationProvider';
import { Patent } from './types';
import { getStatusColor } from './modalHelpers';

interface PatentDetailViewProps {
  patent: Patent;
  copiedField: string | null;
  onCopy: (text: string, field: string) => void;
}

export const PatentDetailView: React.FC<PatentDetailViewProps> = ({
  patent,
  copiedField,
  onCopy
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
          <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {patent.title}
          </h2>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(patent.status)}`}>
              {patent.status === 'granted' ? t('publications.status.granted') as string : 
               patent.status === 'published' ? t('publications.status.published') as string : t('publications.status.pending') as string}
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
              {patent.type === 'invention' ? t('publications.types.invention') as string : 
               patent.type === 'utility' ? t('publications.types.utility') as string : t('publications.types.design') as string}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {patent.description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-500" />
            <span className="font-medium text-gray-900 dark:text-white">{t('publications.modal.patentNumber') as string}</span>
          </div>
          <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
            <span className="text-gray-700 dark:text-gray-300 font-mono">{patent.number}</span>
            <UnifiedButton
              onClick={() => onCopy(patent.number, 'number')}
              variant="ghost"
              size="sm"
              icon={copiedField === 'number' ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4 text-gray-400" />
              )}
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="font-medium text-gray-900 dark:text-white">{t('publications.modal.applicant') as string}</span>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
            <span className="text-gray-700 dark:text-gray-300">{patent.applicant}</span>
          </div>
        </div>

        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="font-medium text-gray-900 dark:text-white">{t('publications.modal.publicDate') as string}</span>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
            <span className="text-gray-700 dark:text-gray-300">{patent.publicDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
