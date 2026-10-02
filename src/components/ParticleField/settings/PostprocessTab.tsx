import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useTranslation } from '../../common/TranslationProvider';
import { ParticleFieldConfig } from '../../../utils/configManager';

export interface PostprocessTabProps {
  config: ParticleFieldConfig;
  updatePostProcessConfig: (updates: Partial<ParticleFieldConfig['postProcess']>) => void;
}

export const PostprocessTab: React.FC<PostprocessTabProps> = ({
  config,
  updatePostProcessConfig,
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3">{t('particleField.settings.bloom')}</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">
              {t('particleField.settings.enableBloom')}
            </label>
            <button
              type="button"
              onClick={() =>
                updatePostProcessConfig({ bloomEnabled: !config.postProcess.bloomEnabled })
              }
              aria-label={t('particleField.settings.enableBloom') as string}
              aria-pressed={config.postProcess.bloomEnabled}
              className={`p-2 rounded ${
                config.postProcess.bloomEnabled
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-600 text-gray-300'
              }`}
            >
              {config.postProcess.bloomEnabled ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
            </button>
          </div>

          {config.postProcess.bloomEnabled && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('particleField.settings.bloomIntensity')}:{' '}
                  {config.postProcess.bloomIntensity.toFixed(2)}
                </label>
                <input
                  type="range"
                  aria-label={t('particleField.settings.bloomIntensity') as string}
                  min="0"
                  max="2"
                  step="0.01"
                  value={config.postProcess.bloomIntensity}
                  onChange={(e) =>
                    updatePostProcessConfig({ bloomIntensity: parseFloat(e.target.value) })
                  }
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('particleField.settings.blurAmount')}: {config.postProcess.blurAmount.toFixed(1)}
                </label>
                <input
                  type="range"
                  aria-label={t('particleField.settings.blurAmount') as string}
                  min="0"
                  max="10"
                  step="0.1"
                  value={config.postProcess.blurAmount}
                  onChange={(e) =>
                    updatePostProcessConfig({ blurAmount: parseFloat(e.target.value) })
                  }
                  className="w-full"
                />
              </div>
            </>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">
          {t('particleField.settings.colorCorrection')}
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              {t('particleField.settings.contrast')}: {config.postProcess.contrast.toFixed(2)}
            </label>
            <input
              type="range"
              aria-label={t('particleField.settings.contrast') as string}
              min="0.5"
              max="2"
              step="0.01"
              value={config.postProcess.contrast}
              onChange={(e) => updatePostProcessConfig({ contrast: parseFloat(e.target.value) })}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {t('particleField.settings.saturation')}: {config.postProcess.saturation.toFixed(2)}
            </label>
            <input
              type="range"
              aria-label={t('particleField.settings.saturation') as string}
              min="0"
              max="2"
              step="0.01"
              value={config.postProcess.saturation}
              onChange={(e) =>
                updatePostProcessConfig({ saturation: parseFloat(e.target.value) })
              }
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {t('particleField.settings.colorTemperature')}:{' '}
              {config.postProcess.colorTemperature.toFixed(0)}K
            </label>
            <input
              type="range"
              aria-label={t('particleField.settings.colorTemperature') as string}
              min="2000"
              max="10000"
              step="100"
              value={config.postProcess.colorTemperature}
              onChange={(e) =>
                updatePostProcessConfig({ colorTemperature: parseFloat(e.target.value) })
              }
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">{t('particleField.settings.effects')}</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              {t('particleField.settings.noiseAmount')}:{' '}
              {config.postProcess.noiseAmount.toFixed(3)}
            </label>
            <input
              type="range"
              aria-label={t('particleField.settings.noiseAmount') as string}
              min="0"
              max="0.1"
              step="0.001"
              value={config.postProcess.noiseAmount}
              onChange={(e) =>
                updatePostProcessConfig({ noiseAmount: parseFloat(e.target.value) })
              }
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {t('particleField.settings.vignetteStrength')}:{' '}
              {config.postProcess.vignetteStrength.toFixed(2)}
            </label>
            <input
              type="range"
              aria-label={t('particleField.settings.vignetteStrength') as string}
              min="0"
              max="1"
              step="0.01"
              value={config.postProcess.vignetteStrength}
              onChange={(e) =>
                updatePostProcessConfig({ vignetteStrength: parseFloat(e.target.value) })
              }
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostprocessTab;
