import React from 'react';
import { useTranslation } from '../../../common/TranslationProvider';
import { ParticleFieldConfig } from '../../../../utils/configManager';

interface PostEffectsControlsProps {
  postProcess: ParticleFieldConfig['postProcess'];
  onUpdate: (updates: Partial<ParticleFieldConfig['postProcess']>) => void;
}

export const PostEffectsControls: React.FC<PostEffectsControlsProps> = ({
  postProcess,
  onUpdate,
}) => {
  const { t } = useTranslation();

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">{t('particleField.settings.effects')}</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            {t('particleField.settings.noiseAmount')}:{' '}
            {postProcess.noiseAmount.toFixed(3)}
          </label>
          <input
            type="range"
            aria-label={t('particleField.settings.noiseAmount') as string}
            min="0"
            max="0.1"
            step="0.001"
            value={postProcess.noiseAmount}
            onChange={(e) =>
              onUpdate({ noiseAmount: parseFloat(e.target.value) })
            }
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            {t('particleField.settings.vignetteStrength')}:{' '}
            {postProcess.vignetteStrength.toFixed(2)}
          </label>
          <input
            type="range"
            aria-label={t('particleField.settings.vignetteStrength') as string}
            min="0"
            max="1"
            step="0.01"
            value={postProcess.vignetteStrength}
            onChange={(e) =>
              onUpdate({ vignetteStrength: parseFloat(e.target.value) })
            }
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};
