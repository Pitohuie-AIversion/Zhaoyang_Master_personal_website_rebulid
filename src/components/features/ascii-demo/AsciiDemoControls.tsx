import React from 'react';
import { useTranslation } from '../../common/TranslationProvider';
import { Settings } from 'lucide-react';
import {
  DemoConfig,
  Intensity,
  Size,
  getThemeOptions,
  getRhythmOptions,
  getAnimationOptions
} from './asciiDemoConfig';

interface AsciiDemoControlsProps {
  config: DemoConfig;
  onUpdateConfig: (key: keyof DemoConfig, value: string | boolean | number) => void;
  className?: string;
}

export const AsciiDemoControls: React.FC<AsciiDemoControlsProps> = ({
  config,
  onUpdateConfig,
  className = ''
}) => {
  const { t } = useTranslation();

  const themeOptions = getThemeOptions(t as unknown as (key: string, options?: Record<string, unknown>) => string);
  const rhythmOptions = getRhythmOptions(t as unknown as (key: string, options?: Record<string, unknown>) => string);
  const animationOptions = getAnimationOptions(t as unknown as (key: string, options?: Record<string, unknown>) => string);

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 theme-transition">
        <div className="flex items-center gap-2 mb-4">
          <Settings size={20} className="text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('common.settings') as string}</h2>
        </div>

        {/* 显示模式 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('ascii.displayMode', { fallback: '显示模式' }) as string}
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => onUpdateConfig('showRhythm', false)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                !config.showRhythm
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {t('ascii.display.staticText', { fallback: '静态文字' }) as string}
            </button>
            <button
              onClick={() => onUpdateConfig('showRhythm', true)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                config.showRhythm
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {t('ascii.display.rhythmEffect', { fallback: '律动效果' }) as string}
            </button>
          </div>
        </div>

        {/* 主题选择 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('ascii.theme.title', { fallback: '主题配色' }) as string}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {themeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onUpdateConfig('theme', option.value)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  config.theme === option.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <div
                  className="w-4 h-4 rounded-full mx-auto mb-1"
                  style={{
                    background: option.value === 'rainbow'
                      ? 'linear-gradient(45deg, #ff0080, #8000ff, #00ff80)'
                      : option.color
                  }}
                />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {t(`ascii.theme.${option.value}`, { fallback: option.label }) as string}
                </span>
              </button>
            ))}
          </div>
        </div>

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
      </div>
    </div>
  );
};
