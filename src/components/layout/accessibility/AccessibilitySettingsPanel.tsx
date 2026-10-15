import React from 'react';
import { useTranslation } from '../../common/TranslationProvider';
import { Eye, EyeOff, Type, Contrast, Volume2, VolumeX, Keyboard, Mouse } from 'lucide-react';
import { AccessibilityConfig } from './types';

interface AccessibilitySettingsPanelProps {
  config: AccessibilityConfig;
  variant?: 'compact' | 'full';
  isSpeaking: boolean;
  onToggleOption: (option: keyof AccessibilityConfig) => void;
  onSpeakHelp: () => void;
  onStopSpeaking: () => void;
}

export const AccessibilitySettingsPanel: React.FC<AccessibilitySettingsPanelProps> = ({
  config,
  variant = 'compact',
  isSpeaking,
  onToggleOption,
  onSpeakHelp,
  onStopSpeaking
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={`absolute z-50 w-[min(20rem,calc(100vw-2rem))] rounded-xl border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-gray-800 ${
        variant === 'full' ? 'bottom-12 right-0' : 'top-12 right-0'
      }`}
    >
      <h3 className="font-semibold mb-4 text-gray-900 dark:text-gray-100 flex items-center">
        <Eye className="w-4 h-4 mr-2" />
        {t('common.accessibilityLabels.settingsTitle') as string}
      </h3>

      <div className="space-y-3">
        {/* 高对比度 */}
        <label className="flex items-center justify-between cursor-pointer">
          <span className="flex items-center text-sm text-gray-700 dark:text-gray-300">
            <Contrast className="w-4 h-4 mr-2" />
            {t('common.accessibilityLabels.highContrast') as string}
          </span>
          <input
            type="checkbox"
            checked={config.highContrast}
            onChange={() => onToggleOption('highContrast')}
            className="sr-only"
          />
          <div
            className={`w-10 h-6 rounded-full transition-colors ${
              config.highContrast ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <div
              className={`w-4 h-4 bg-white rounded-full mt-1 transition-transform ${
                config.highContrast ? 'translate-x-5' : 'translate-x-1'
              }`}
            />
          </div>
        </label>

        {/* 大字体 */}
        <label className="flex items-center justify-between cursor-pointer">
          <span className="flex items-center text-sm text-gray-700 dark:text-gray-300">
            <Type className="w-4 h-4 mr-2" />
            {t('common.accessibilityLabels.largeText') as string}
          </span>
          <input
            type="checkbox"
            checked={config.largeText}
            onChange={() => onToggleOption('largeText')}
            className="sr-only"
          />
          <div
            className={`w-10 h-6 rounded-full transition-colors ${
              config.largeText ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <div
              className={`w-4 h-4 bg-white rounded-full mt-1 transition-transform ${
                config.largeText ? 'translate-x-5' : 'translate-x-1'
              }`}
            />
          </div>
        </label>

        {/* 减少动画 */}
        <label className="flex items-center justify-between cursor-pointer">
          <span className="flex items-center text-sm text-gray-700 dark:text-gray-300">
            <Mouse className="w-4 h-4 mr-2" />
            {t('common.accessibilityLabels.reducedMotion') as string}
          </span>
          <input
            type="checkbox"
            checked={config.reducedMotion}
            onChange={() => onToggleOption('reducedMotion')}
            className="sr-only"
          />
          <div
            className={`w-10 h-6 rounded-full transition-colors ${
              config.reducedMotion ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <div
              className={`w-4 h-4 bg-white rounded-full mt-1 transition-transform ${
                config.reducedMotion ? 'translate-x-5' : 'translate-x-1'
              }`}
            />
          </div>
        </label>

        {/* 键盘导航 */}
        <label className="flex items-center justify-between cursor-pointer">
          <span className="flex items-center text-sm text-gray-700 dark:text-gray-300">
            <Keyboard className="w-4 h-4 mr-2" />
            {t('common.accessibilityLabels.keyboardNavigation') as string}
          </span>
          <input
            type="checkbox"
            checked={config.keyboardNavigation}
            onChange={() => onToggleOption('keyboardNavigation')}
            className="sr-only"
          />
          <div
            className={`w-10 h-6 rounded-full transition-colors ${
              config.keyboardNavigation ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <div
              className={`w-4 h-4 bg-white rounded-full mt-1 transition-transform ${
                config.keyboardNavigation ? 'translate-x-5' : 'translate-x-1'
              }`}
            />
          </div>
        </label>

        {/* 文本转语音 */}
        <label className="flex items-center justify-between cursor-pointer">
          <span className="flex items-center text-sm text-gray-700 dark:text-gray-300">
            {isSpeaking ? <VolumeX className="w-4 h-4 mr-2" /> : <Volume2 className="w-4 h-4 mr-2" />}
            {t('common.accessibilityLabels.textToSpeech') as string}
          </span>
          <input
            type="checkbox"
            checked={config.textToSpeech}
            onChange={() => onToggleOption('textToSpeech')}
            className="sr-only"
          />
          <div
            className={`w-10 h-6 rounded-full transition-colors ${
              config.textToSpeech ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <div
              className={`w-4 h-4 bg-white rounded-full mt-1 transition-transform ${
                config.textToSpeech ? 'translate-x-5' : 'translate-x-1'
              }`}
            />
          </div>
        </label>

        {/* 色盲友好 */}
        <label className="flex items-center justify-between cursor-pointer">
          <span className="flex items-center text-sm text-gray-700 dark:text-gray-300">
            <EyeOff className="w-4 h-4 mr-2" />
            {t('common.accessibilityLabels.colorBlindFriendly') as string}
          </span>
          <input
            type="checkbox"
            checked={config.colorBlindFriendly}
            onChange={() => onToggleOption('colorBlindFriendly')}
            className="sr-only"
          />
          <div
            className={`w-10 h-6 rounded-full transition-colors ${
              config.colorBlindFriendly ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <div
              className={`w-4 h-4 bg-white rounded-full mt-1 transition-transform ${
                config.colorBlindFriendly ? 'translate-x-5' : 'translate-x-1'
              }`}
            />
          </div>
        </label>
      </div>

      {/* 语音控制按钮 */}
      {config.textToSpeech && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
          <button
            onClick={() => (isSpeaking ? onStopSpeaking() : onSpeakHelp())}
            className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isSpeaking
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            {isSpeaking
              ? (t('common.accessibilityLabels.stopReading') as string)
              : (t('common.accessibilityLabels.readDescription') as string)}
          </button>
        </div>
      )}
    </div>
  );
};
