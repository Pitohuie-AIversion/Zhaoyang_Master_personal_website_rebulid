import React from 'react';
import { useTranslation } from '../../common/TranslationProvider';

export const ParticleTechnicalFeatures: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="mt-16 text-left">
      <h3 className="text-2xl font-bold text-white mb-6 text-center">
        {t('particleField.technicalFeatures')}
      </h3>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h4 className="text-lg font-semibold text-white mb-3">
            {t('particleField.tech.performance')}
          </h4>
          <p className="text-white/70 leading-relaxed">
            {t('particleField.tech.performanceDesc')}
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h4 className="text-lg font-semibold text-white mb-3">
            {t('particleField.tech.interaction')}
          </h4>
          <p className="text-white/70 leading-relaxed">
            {t('particleField.tech.interactionDesc')}
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h4 className="text-lg font-semibold text-white mb-3">
            {t('particleField.tech.visual')}
          </h4>
          <p className="text-white/70 leading-relaxed">
            {t('particleField.tech.visualDesc')}
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h4 className="text-lg font-semibold text-white mb-3">
            {t('particleField.tech.adaptive')}
          </h4>
          <p className="text-white/70 leading-relaxed">
            {t('particleField.tech.adaptiveDesc')}
          </p>
        </div>
      </div>
    </div>
  );
};
