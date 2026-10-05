import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useTranslation } from '../../../common/TranslationProvider';
import { ParticleFieldConfig } from '../../../../utils/configManager';

interface BloomControlsProps {
  postProcess: ParticleFieldConfig['postProcess'];
  onUpdate: (updates: Partial<ParticleFieldConfig['postProcess']>) => void;
}

export const BloomControls: React.FC<BloomControlsProps> = ({
  postProcess,
  onUpdate,
}) => {
  const { t } = useTranslation();

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">{t('particleField.settings.bloom')}</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">
            {t('particleField.settings.enableBloom')}
          </label>
          <button
            type="button"
            onClick={() => onUpdate({ bloomEnabled: !postProcess.bloomEnabled })}
            aria-label={t('particleField.settings.enableBloom') as string}
            aria-pressed={postProcess.bloomEnabled}
            className={`p-2 rounded ${
              postProcess.bloomEnabled
                ? 'bg-blue-600 text-white'
                : 'bg-gray-600 text-gray-300'
            }`}
          >
            {postProcess.bloomEnabled ? (
              <Eye className="w-4 h-4" />
            ) : (
              <EyeOff className="w-4 h-4" />
            )}
          </button>
        </div>

        {postProcess.bloomEnabled && (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('particleField.settings.bloomIntensity')}:{' '}
                {postProcess.bloomIntensity.toFixed(2)}
              </label>
              <input
                type="range"
                aria-label={t('particleField.settings.bloomIntensity') as string}
                min="0"
                max="2"
                step="0.01"
                value={postProcess.bloomIntensity}
                onChange={(e) =>
                  onUpdate({ bloomIntensity: parseFloat(e.target.value) })
                }
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {t('particleField.settings.blurAmount')}:{' '}
                {postProcess.blurAmount.toFixed(1)}
              </label>
              <input
                type="range"
                aria-label={t('particleField.settings.blurAmount') as string}
                min="0"
                max="10"
                step="0.1"
                value={postProcess.blurAmount}
                onChange={(e) =>
                  onUpdate({ blurAmount: parseFloat(e.target.value) })
                }
                className="w-full"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
