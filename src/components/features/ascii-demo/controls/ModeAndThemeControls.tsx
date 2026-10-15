import React from 'react';
import { useTranslation } from '../../../common/TranslationProvider';
import { DemoConfig, getThemeOptions } from '../asciiDemoConfig';

interface ModeAndThemeControlsProps {
  config: DemoConfig;
  onUpdateConfig: (key: keyof DemoConfig, value: string | boolean | number) => void;
}

export const ModeAndThemeControls: React.FC<ModeAndThemeControlsProps> = ({
  config,
  onUpdateConfig,
}) => {
  const { t } = useTranslation();
  const themeOptions = getThemeOptions(
    t as unknown as (key: string, options?: Record<string, unknown>) => string
  );

  return (
    <>
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
                  background:
                    option.value === 'rainbow'
                      ? 'linear-gradient(45deg, #ff0080, #8000ff, #00ff80)'
                      : option.color,
                }}
              />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {t(`ascii.theme.${option.value}`, { fallback: option.label }) as string}
              </span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};
