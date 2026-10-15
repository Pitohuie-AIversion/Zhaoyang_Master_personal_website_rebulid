import React from 'react';
import { useTranslation } from '../../../common/TranslationProvider';
import { DemoConfig, Intensity, Size } from '../asciiDemoConfig';

interface IntensityAndSizeControlsProps {
  config: DemoConfig;
  onUpdateConfig: (key: keyof DemoConfig, value: string | boolean | number) => void;
}

export const IntensityAndSizeControls: React.FC<IntensityAndSizeControlsProps> = ({
  config,
  onUpdateConfig,
}) => {
  const { t } = useTranslation();

  return (
    <>
      {/* 强度控制 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('ascii.intensity.title', { fallback: '效果强度' }) as string}
        </label>
        <div className="flex gap-2">
          {(['low', 'medium', 'high'] as Intensity[]).map((intensity) => (
            <button
              key={intensity}
              onClick={() => onUpdateConfig('intensity', intensity)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                config.intensity === intensity
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {intensity === 'low'
                ? (t('ascii.intensity.low') as string)
                : intensity === 'medium'
                ? (t('ascii.intensity.medium') as string)
                : (t('ascii.intensity.high') as string)}
            </button>
          ))}
        </div>
      </div>

      {/* 尺寸控制 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('ascii.size.title', { fallback: '显示尺寸' }) as string}
        </label>
        <div className="flex gap-2">
          {(['small', 'medium', 'large'] as Size[]).map((size) => (
            <button
              key={size}
              onClick={() => onUpdateConfig('size', size)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                config.size === size
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {size === 'small'
                ? (t('ascii.size.small') as string)
                : size === 'medium'
                ? (t('ascii.size.medium') as string)
                : (t('ascii.size.large') as string)}
            </button>
          ))}
        </div>
      </div>

      {/* 速度控制 */}
      {!config.showRhythm && config.animationType === 'typewriter' && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('ascii.typewriter.speedLabel', { fallback: '打字速度' }) as string}: {config.speed}ms
          </label>
          <input
            type="range"
            min="50"
            max="500"
            step="50"
            value={config.speed}
            onChange={(e) => onUpdateConfig('speed', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      )}
    </>
  );
};
