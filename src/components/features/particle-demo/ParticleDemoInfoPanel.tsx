import React from 'react';
import { useTranslation } from '../../common/TranslationProvider';

export interface ParticleDemoInfoPanelProps {
  show: boolean;
}

export const ParticleDemoInfoPanel: React.FC<ParticleDemoInfoPanelProps> = ({ show }) => {
  const { t } = useTranslation();

  if (!show) return null;

  return (
    <div className="absolute top-20 left-4 bg-black/80 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-white max-w-md">
      <h3 className="text-lg font-semibold mb-4">{t('particleField.controls')}</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>{t('particleField.shortcuts.space')}:</span>
          <span className="text-white/70">{t('particleField.shortcuts.playPause')}</span>
        </div>
        <div className="flex justify-between">
          <span>R:</span>
          <span className="text-white/70">{t('particleField.shortcuts.reset')}</span>
        </div>
        <div className="flex justify-between">
          <span>S:</span>
          <span className="text-white/70">{t('particleField.shortcuts.stats')}</span>
        </div>
        <div className="flex justify-between">
          <span>P:</span>
          <span className="text-white/70">{t('particleField.shortcuts.presets')}</span>
        </div>
        <div className="flex justify-between">
          <span>F:</span>
          <span className="text-white/70">{t('particleField.shortcuts.fullscreen')}</span>
        </div>
        <div className="flex justify-between">
          <span>I:</span>
          <span className="text-white/70">{t('particleField.shortcuts.info')}</span>
        </div>
        <div className="flex justify-between">
          <span>{t('particleField.shortcuts.mouse')}:</span>
          <span className="text-white/70">{t('particleField.shortcuts.interact')}</span>
        </div>
      </div>
    </div>
  );
};
