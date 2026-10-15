import React from 'react';
import { ExternalLink, TrendingUp, Calendar, User, BarChart3 } from 'lucide-react';
import type { PublicationMetrics } from './types';
import { useTranslation } from '../../../common/TranslationProvider';
import { ResponsiveCard } from '../../../common/ResponsiveEnhancements';

export interface PaperCardProps {
  paper: PublicationMetrics;
  showCitations: boolean;
  showVelocity: boolean;
}

export const PaperCard: React.FC<PaperCardProps> = ({
  paper,
  showCitations,
  showVelocity,
}) => {
  const { t } = useTranslation();

  return (
    <ResponsiveCard className="p-4 hover:shadow-md transition-shadow border-l-4 border-blue-500">
      <div className="space-y-3">
        {/* 论文标题 */}
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-semibold text-gray-900 leading-tight flex-1">
            {paper.title}
          </h3>
          {paper.url && (
            <a
              href={paper.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700 transition-colors p-1"
              title={t('academic.papers.viewPaper') as string}
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          )}
        </div>

        {/* 作者信息 */}
        <div className="flex items-center text-sm text-gray-600">
          <User className="w-4 h-4 mr-2" />
          <span>{paper.authors.join(', ')}</span>
        </div>

        {/* 期刊和年份 */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-gray-700">
            <BarChart3 className="w-4 h-4 mr-2" />
            <span className="font-medium">{paper.journal}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{paper.year}</span>
          </div>
        </div>

        {/* 引用统计 */}
        {(showCitations || showVelocity) && (
          <div className="flex items-center gap-4 pt-2 border-t border-gray-200">
            {showCitations && (
              <div className="flex items-center text-sm">
                <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
                <span className="text-gray-600">
                  {t('academic.papers.citations') as string}:
                  <span className="font-semibold text-green-600 ml-1">{paper.citations}</span>
                </span>
              </div>
            )}

            {showVelocity && (
              <div className="flex items-center text-sm">
                <BarChart3 className="w-4 h-4 mr-1 text-blue-500" />
                <span className="text-gray-600">
                  {t('academic.papers.citationVelocity') as string}:
                  <span className="font-semibold text-blue-600 ml-1">
                    {paper.citationVelocity.toFixed(1)}/年
                  </span>
                </span>
              </div>
            )}
          </div>
        )}

        {/* DOI链接 */}
        {paper.doi && (
          <div className="text-xs text-gray-500 mt-2">
            DOI:{' '}
            <a
              href={`https://doi.org/${paper.doi}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {paper.doi}
            </a>
          </div>
        )}
      </div>
    </ResponsiveCard>
  );
};
