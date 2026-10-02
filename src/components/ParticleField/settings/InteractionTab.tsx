import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useTranslation } from '../../common/TranslationProvider';
import { ParticleFieldConfig } from '../../../utils/configManager';

export interface InteractionTabProps {
  config: ParticleFieldConfig;
  updateInteractionConfig: (updates: Partial<ParticleFieldConfig['interaction']>) => void;
}

export const InteractionTab: React.FC<InteractionTabProps> = ({
  config,
  updateInteractionConfig,
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3">{t('particleField.settings.mouse')}</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">
              {t('particleField.settings.enableMouse')}
            </label>
            <button
              type="button"
              onClick={() =>
                updateInteractionConfig({ enabled: !config.interaction.enabled })
              }
              aria-label={t('particleField.settings.enableMouse') as string}
              aria-pressed={config.interaction.enabled}
              className={`p-2 rounded ${
                config.interaction.enabled
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-600 text-gray-300'
              }`}
            >
              {config.interaction.enabled ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
            </button>
          </div>

          {config.interaction.enabled && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('particleField.settings.mouseRadius')}:{' '}
                  {config.interaction.interactionRadius}
                </label>
                <input
                  type="range"
                  aria-label={t('particleField.settings.mouseRadius') as string}
                  min="50"
                  max="500"
                  step="10"
                  value={config.interaction.interactionRadius}
                  onChange={(e) =>
                    updateInteractionConfig({ interactionRadius: parseInt(e.target.value) })
                  }
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('particleField.settings.mouseStrength')}:{' '}
                  {config.interaction.mouseInfluence.toFixed(1)}
                </label>
                <input
                  type="range"
                  aria-label={t('particleField.settings.mouseStrength') as string}
                  min="0"
                  max="10"
                  step="0.1"
                  value={config.interaction.mouseInfluence}
                  onChange={(e) =>
                    updateInteractionConfig({ mouseInfluence: parseFloat(e.target.value) })
                  }
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('particleField.settings.smoothing')}:{' '}
                  {config.interaction.dampingFactor.toFixed(2)}
                </label>
                <input
                  type="range"
                  aria-label={t('particleField.settings.smoothing') as string}
                  min="0.1"
                  max="1"
                  step="0.01"
                  value={config.interaction.dampingFactor}
                  onChange={(e) =>
                    updateInteractionConfig({ dampingFactor: parseFloat(e.target.value) })
                  }
                  className="w-full"
                />
              </div>
            </>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">{t('particleField.settings.touch')}</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">
              {t('particleField.settings.enableTouch')}
            </label>
            <button
              type="button"
              onClick={() =>
                updateInteractionConfig({ enableTouch: !config.interaction.enableTouch })
              }
              aria-label={t('particleField.settings.enableTouch') as string}
              aria-pressed={config.interaction.enableTouch}
              className={`p-2 rounded ${
                config.interaction.enableTouch
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-600 text-gray-300'
              }`}
            >
              {config.interaction.enableTouch ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {t('particleField.settings.maxTouches')}: {config.interaction.maxTouches}
            </label>
            <input
              type="range"
              aria-label={t('particleField.settings.maxTouches') as string}
              min="1"
              max="10"
              step="1"
              value={config.interaction.maxTouches}
              onChange={(e) =>
                updateInteractionConfig({ maxTouches: parseInt(e.target.value) })
              }
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractionTab;
