import React from 'react';
import type { ResumeData } from '../../../types';

interface ResumeOverviewCardsProps {
  resumeData: ResumeData | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: (key: string, fallbackOrOptions?: any) => string;
}

export const ResumeOverviewCards: React.FC<ResumeOverviewCardsProps> = ({
  resumeData,
  t,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          {t('common.resume.dataQuality', 'Data Quality')}
        </h3>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {t('common.resume.completeness', 'Completeness')}
          </span>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">85%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          {t('common.resume.sections', 'Sections')}
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">
              {t('common.resume.personalInfo', 'Personal Info')}
            </span>
            <span className="text-gray-900 dark:text-white">
              {resumeData?.personal_info ? '✓' : '○'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">
              {t('common.resume.education', 'Education')}
            </span>
            <span className="text-gray-900 dark:text-white">
              {resumeData?.education?.length || 0} {t('common.items', 'items')}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">
              {t('common.resume.experience', 'Experience')}
            </span>
            <span className="text-gray-900 dark:text-white">
              {resumeData?.work_experience?.length || 0} {t('common.items', 'items')}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">
              {t('common.resume.skills', 'Skills')}
            </span>
            <span className="text-gray-900 dark:text-white">
              {resumeData?.skills?.length || 0} {t('common.items', 'items')}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          {t('common.resume.syncStatus', 'Sync Status')}
        </h3>
        <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
          <div className="w-2.5 h-2.5 bg-green-600 dark:bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">
            {t('common.resume.synced', 'Synchronized')}
          </span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {t('common.resume.lastSync', 'Last sync')}: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};
