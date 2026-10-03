import React from 'react';
import { SimpleMotion } from '../../animations/SimpleMotion';
import { useTranslation } from '../../common/TranslationProvider';

export const ResearchAreasSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="grid md:grid-cols-2 gap-6 lg:gap-8 mb-12">
      {/* 科学计算模块 */}
      <SimpleMotion
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="card-dark rounded-lg shadow-md-dark p-4 sm:p-6 hover:shadow-lg-dark theme-transition"
      >
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-gray-900 rounded-md flex items-center justify-center mr-3">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-xl md:text-2xl font-semibold text-primary-dark theme-transition leading-tight">
            {t('research.areas.scientificComputing.title') as string}
          </h2>
        </div>
        <div className="space-y-4">
          <div>
            <h3 className="text-base md:text-lg font-medium text-primary-dark theme-transition mb-1 leading-snug">
              {t('research.areas.scientificComputing.transformer.title') as string}
            </h3>
            <p className="text-sm md:text-base text-secondary-dark theme-transition leading-relaxed">
              {t('research.areas.scientificComputing.transformer.description') as string}
            </p>
          </div>
          <div>
            <h3 className="text-base md:text-lg font-medium text-primary-dark theme-transition mb-1 leading-snug">
              {t('research.areas.scientificComputing.sparseToDense.title') as string}
            </h3>
            <p className="text-sm md:text-base text-secondary-dark theme-transition leading-relaxed">
              {t('research.areas.scientificComputing.sparseToDense.description') as string}
            </p>
          </div>
          <div>
            <h3 className="text-base md:text-lg font-medium text-primary-dark theme-transition mb-1 leading-snug">
              {t('research.areas.scientificComputing.damBreak.title') as string}
            </h3>
            <p className="text-sm md:text-base text-secondary-dark theme-transition leading-relaxed">
              {t('research.areas.scientificComputing.damBreak.description') as string}
            </p>
          </div>
        </div>
      </SimpleMotion>

      {/* 机器人研究模块 */}
      <SimpleMotion
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="card-dark rounded-lg shadow-md-dark p-6 hover:shadow-lg-dark theme-transition"
      >
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-gray-900 rounded-md flex items-center justify-center mr-3">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <h2 className="text-xl md:text-2xl font-semibold text-primary-dark theme-transition leading-tight">
            {t('research.areas.robotics.title') as string}
          </h2>
        </div>
        <div className="space-y-4">
          <div>
            <h3 className="text-base md:text-lg font-medium text-primary-dark theme-transition mb-1 leading-snug">
              {t('research.areas.robotics.underwaterPerception.title') as string}
            </h3>
            <p className="text-sm md:text-base text-secondary-dark theme-transition leading-relaxed">
              {t('research.areas.robotics.underwaterPerception.description') as string}
            </p>
          </div>
          <div>
            <h3 className="text-base md:text-lg font-medium text-primary-dark theme-transition mb-1 leading-snug">
              {t('research.areas.robotics.bionicFin.title') as string}
            </h3>
            <p className="text-sm md:text-base text-secondary-dark theme-transition leading-relaxed">
              {t('research.areas.robotics.bionicFin.description') as string}
            </p>
          </div>
          <div>
            <h3 className="text-base md:text-lg font-medium text-primary-dark theme-transition mb-1 leading-snug">
              {t('research.areas.robotics.modularRobot.title') as string}
            </h3>
            <p className="text-sm md:text-base text-secondary-dark theme-transition leading-relaxed">
              {t('research.areas.robotics.modularRobot.description') as string}
            </p>
          </div>
        </div>
      </SimpleMotion>
    </div>
  );
};

export default ResearchAreasSection;
