import React from 'react';
import { GraduationCap } from 'lucide-react';
import { SimpleMotion } from '../../animations/SimpleMotion';
import { useTranslation } from '../../common/TranslationProvider';

export const ResearchEducationSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="card-dark rounded-lg shadow-md-dark p-6 theme-transition">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/40 text-green-600 dark:text-green-400 flex items-center justify-center mr-3 flex-shrink-0 theme-transition">
          <GraduationCap className="w-5 h-5" />
        </div>
        <h3 className="text-xl md:text-2xl font-semibold text-primary-dark theme-transition">
          {t('research.educationSectionTitle') as string}
        </h3>
      </div>
      <div className="space-y-6">
        <SimpleMotion
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-l-4 border-blue-600 pl-6 hover:bg-gray-50 dark:hover:bg-gray-800/40 p-4 rounded-r-lg transition-colors"
        >
          <h4 className="text-lg font-medium text-primary-dark theme-transition mb-2">
            {t('research.educationItems.master.title') as string}
          </h4>
          <p className="text-sm text-secondary-dark theme-transition mb-3">
            {t('research.educationItems.master.description') as string}
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 px-2 py-1 rounded">
              {t('research.educationItems.master.period') as string}
            </span>
            <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 px-2 py-1 rounded">
              {t('research.educationItems.master.status') as string}
            </span>
          </div>
        </SimpleMotion>
        
        <SimpleMotion
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="border-l-4 border-purple-600 pl-6 hover:bg-gray-50 dark:hover:bg-gray-800/40 p-4 rounded-r-lg transition-colors"
        >
          <h4 className="text-lg font-medium text-primary-dark theme-transition mb-2">
            {t('research.educationItems.visiting.title') as string}
          </h4>
          <p className="text-sm text-secondary-dark theme-transition mb-3">
            {t('research.educationItems.visiting.description') as string}
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 px-2 py-1 rounded">
              {t('research.educationItems.visiting.period') as string}
            </span>
            <span className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 px-2 py-1 rounded">
              {t('research.educationItems.visiting.status') as string}
            </span>
          </div>
        </SimpleMotion>
        
        <SimpleMotion
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="border-l-4 border-green-600 pl-6 hover:bg-gray-50 dark:hover:bg-gray-800/40 p-4 rounded-r-lg transition-colors"
        >
          <h4 className="text-lg font-medium text-primary-dark theme-transition mb-2">
            {t('research.educationItems.bachelor.title') as string}
          </h4>
          <p className="text-sm text-secondary-dark theme-transition mb-3">
            {t('research.educationItems.bachelor.description') as string}
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 px-2 py-1 rounded">
              {t('research.educationItems.bachelor.period') as string}
            </span>
            <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 px-2 py-1 rounded">
              {t('research.educationItems.bachelor.status') as string}
            </span>
          </div>
        </SimpleMotion>
      </div>
    </div>
  );
};

export default ResearchEducationSection;
