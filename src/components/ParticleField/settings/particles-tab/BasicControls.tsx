import React from 'react';
import { useTranslation } from '../../../common/TranslationProvider';
import { ParticleFieldConfig } from '../../../../utils/configManager';

interface BasicControlsProps {
  particle: ParticleFieldConfig['particle'];
  onUpdate: (updates: Partial<ParticleFieldConfig['particle']>) => void;
}

export const BasicControls: React.FC<BasicControlsProps> = ({ particle, onUpdate }) => {
  const { t } = useTranslation();

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">{t('particleField.settings.basic')}</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            {t('particleField.settings.maxParticles')}: {particle.particleCount}
          </label>
          <input
            type="range"
            aria-label={t('particleField.settings.maxParticles') as string}
            min="100"
            max="50000"
            step="100"
            value={particle.particleCount}
            onChange={(e) => onUpdate({ particleCount: parseInt(e.target.value) })}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            {t('particleField.settings.opacity')}: {particle.visual.opacity.toFixed(2)}
          </label>
          <input
            type="range"
            aria-label={t('particleField.settings.opacity') as string}
            min="0.1"
            max="1"
            step="0.05"
            value={particle.visual.opacity}
            onChange={(e) =>
              onUpdate({
                visual: { ...particle.visual, opacity: parseFloat(e.target.value) },
              })
            }
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            {t('particleField.settings.size')}: {particle.visual.maxSize.toFixed(1)}
          </label>
          <input
            type="range"
            aria-label={t('particleField.settings.size') as string}
            min="0.5"
            max="10"
            step="0.1"
            value={particle.visual.maxSize}
            onChange={(e) =>
              onUpdate({
                visual: { ...particle.visual, maxSize: parseFloat(e.target.value) },
              })
            }
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};
