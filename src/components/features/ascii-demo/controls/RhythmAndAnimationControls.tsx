import React from 'react';
import { useTranslation } from '../../../common/TranslationProvider';
import {
  DemoConfig,
  getRhythmOptions,
  getAnimationOptions,
} from '../asciiDemoConfig';

interface RhythmAndAnimationControlsProps {
  config: DemoConfig;
  onUpdateConfig: (key: keyof DemoConfig, value: string | boolean | number) => void;
}

export const RhythmAndAnimationControls: React.FC<RhythmAndAnimationControlsProps> = ({
  config,
  onUpdateConfig,
}) => {
  const { t } = useTranslation();
  const rhythmOptions = getRhythmOptions(
    t as unknown as (key: string, options?: Record<string, unknown>) => string
  );
  const animationOptions = getAnimationOptions(
    t as unknown as (key: string, options?: Record<string, unknown>) => string
  );

  return (
    <>
      {/* 律动类型 */}
      {config.showRhythm && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('ascii.rhythm.title', { fallback: '律动类型' }) as string}
          </label>
          <div className="space-y-2">
            {rhythmOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onUpdateConfig('rhythmType', option.value)}
                className={`w-full p-3 rounded-lg border text-left transition-all ${
                  config.rhythmType === option.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <div className="font-medium text-gray-900 dark:text-white">
                  {t(`ascii.rhythm.${option.value}.label`, { fallback: option.label }) as string}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {t(`ascii.rhythm.${option.value}.desc`, { fallback: option.description }) as string}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 动画类型 */}
      {!config.showRhythm && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('ascii.animation.title', { fallback: '动画类型' }) as string}
          </label>
          <div className="space-y-2">
            {animationOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onUpdateConfig('animationType', option.value)}
                className={`w-full p-3 rounded-lg border text-left transition-all ${
                  config.animationType === option.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <div className="font-medium text-gray-900 dark:text-white">
                  {t(`ascii.animation.${option.value}.label`, { fallback: option.label }) as string}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {t(`ascii.animation.${option.value}.desc`, { fallback: option.description }) as string}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
