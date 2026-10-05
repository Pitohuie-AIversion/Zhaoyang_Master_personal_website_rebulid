import React from 'react';
import { BookOpen, FileText, Calendar, Users, ExternalLink, Copy, Check } from 'lucide-react';
import { UnifiedButton } from '../../../common/UnifiedButton';
import { useTranslation } from '../../../common/TranslationProvider';
import { Publication } from './types';
import { getStatusColor } from './modalHelpers';

interface PublicationDetailViewProps {
  pub: Publication;
  copiedField: string | null;
  onCopy: (text: string, field: string) => void;
}

export const PublicationDetailView: React.FC<PublicationDetailViewProps> = ({
  pub,
  copiedField,
  onCopy
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
          <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {pub.title}
          </h2>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(pub.status)}`}>
              {pub.status === 'published' ? t('publications.status.published') as string :
               pub.status === 'accepted' ? t('publications.status.accepted') as string :
               pub.status === 'under_review' ? t('publications.status.underReview') as string : t('publications.status.inPreparation') as string}
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300">
              {pub.type === 'journal' ? t('publications.types.journal') as string : t('publications.types.conference') as string}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {pub.description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-500" />
            <span className="font-medium text-gray-900 dark:text-white">{t('publications.modal.journal') as string}</span>
          </div>
          <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
            <span className="text-gray-700 dark:text-gray-300">{pub.journal}</span>
            <UnifiedButton
              onClick={() => onCopy(pub.journal, 'journal')}
              variant="ghost"
              size="sm"
              icon={copiedField === 'journal' ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4 text-gray-400" />
              )}
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="font-medium text-gray-900 dark:text-white">{t('publications.modal.publishYear') as string}</span>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
            <span className="text-gray-700 dark:text-gray-300">{pub.year}</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="font-medium text-gray-900 dark:text-white">{t('publications.modal.authors') as string}</span>
          </div>
          <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
            <span className="text-gray-700 dark:text-gray-300">{pub.authors.join(', ')}</span>
            <UnifiedButton
              onClick={() => onCopy(pub.authors.join(', '), 'authors')}
              variant="ghost"
              size="sm"
              icon={copiedField === 'authors' ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4 text-gray-400" />
              )}
            />
          </div>
        </div>

        {pub.doi && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-gray-500" />
              <span className="font-medium text-gray-900 dark:text-white">DOI</span>
            </div>
            <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <a 
                href={`https://doi.org/${pub.doi}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline flex-1"
              >
                {pub.doi}
              </a>
              <UnifiedButton
                onClick={() => onCopy(pub.doi!, 'doi')}
                variant="ghost"
                size="sm"
                icon={copiedField === 'doi' ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-400" />
                )}
                className="ml-2"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
