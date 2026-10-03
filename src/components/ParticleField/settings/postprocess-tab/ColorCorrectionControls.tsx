import React from 'react';
import { useTranslation } from '../../../common/TranslationProvider';
import { ParticleFieldConfig } from '../../../../utils/configManager';

interface ColorCorrectionControlsProps {
  postProcess: ParticleFieldConfig['postProcess'];
  onUpdate: (updates: Partial<ParticleFieldConfig['postProcess']>) => void;
}

export const ColorCorrectionControls: React.FC<ColorCorrectionControlsProps> = ({
  postProcess,
  onUpdate,
}) => {
  const { t } = useTranslation();

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">
        {t('particleField.settings.colorCorrection')}
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            {t('particleField.settings.contrast')}: {postProcess.contrast.toFixed(2)}
          </label>
          <input
            type="range"
            aria-label={t('particleField.settings.contrast') as string}
            min="0.5"
            max="2"
            step="0.01"
            value={postProcess.contrast}
            onChange={(e) => onUpdate({ contrast: parseFloat(e.target.value) })}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            {t('particleField.settings.saturation')}: {postProcess.saturation.toFixed(2)}
          </label>
          <input
            type="range"
            aria-label={t('particleField.settings.saturation') as string}
            min="0"
            max="2"
            step="0.01"
            value={postProcess.saturation}
            onChange={(e) =>
              onUpdate({ saturation: parseFloat(e.target.value) })
            }
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            {t('particleField.settings.colorTemperature')}:{' '}
            {postProcess.colorTemperature.toFixed(0)}K
          </label>
          <input
            type="range"
            aria-label={t('particleField.settings.colorTemperature') as string}
            min="2000"
            max="10000"
            step="100"
            value={postProcess.colorTemperature}
            onChange={(e) =>
              onUpdate({ colorTemperature: parseFloat(e.target.value) })
            }
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};
