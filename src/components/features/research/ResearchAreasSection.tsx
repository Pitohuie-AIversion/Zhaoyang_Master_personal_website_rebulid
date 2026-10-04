import React from 'react';
import { Cpu, Bot } from 'lucide-react';
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
          <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mr-3 flex-shrink-0 theme-transition">
            <Cpu className="w-5 h-5" />
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
        className="card-dark rounded-lg shadow-md-dark p-4 sm:p-6 hover:shadow-lg-dark theme-transition"
      >
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 flex items-center justify-center mr-3 flex-shrink-0 theme-transition">
            <Bot className="w-5 h-5" />
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

