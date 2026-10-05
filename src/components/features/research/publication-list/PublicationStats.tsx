import React from 'react';
import type { PublicationMetrics } from './types';
import { useTranslation } from '../../../common/TranslationProvider';

export interface PublicationStatsProps {
  papers: PublicationMetrics[];
}

export const PublicationStats: React.FC<PublicationStatsProps> = ({ papers }) => {
  const { t } = useTranslation();

  const totalCitations = papers.reduce((sum, p) => sum + p.citations, 0);
  const avgCitations = papers.length > 0 ? Math.round(totalCitations / papers.length) : 0;

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-blue-600">{papers.length}</div>
          <div className="text-sm text-gray-600">{t('academic.papers.totalPapers') as string}</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-green-600">{totalCitations}</div>
          <div className="text-sm text-gray-600">{t('academic.papers.totalCitations') as string}</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-purple-600">{avgCitations}</div>
          <div className="text-sm text-gray-600">{t('academic.papers.avgCitations') as string}</div>
        </div>
      </div>
    </div>
  );
};
