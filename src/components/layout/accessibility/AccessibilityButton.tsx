import React, { useState } from 'react';
import { useTranslation } from '../../common/TranslationProvider';
import { Eye } from 'lucide-react';
import { AccessibilityConfig } from './types';
import { useAccessibility } from './AccessibilityContext';
import { AccessibilitySettingsPanel } from './AccessibilitySettingsPanel';

export const AccessibilityButton: React.FC<{
  className?: string;
  variant?: 'compact' | 'full';
  showText?: boolean;
}> = ({ className = '', variant = 'compact', showText = false }) => {
  const { config, updateConfig, speakText, stopSpeaking, isSpeaking } = useAccessibility();
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const toggleOption = (option: keyof AccessibilityConfig) => {
    const newValue = !config[option];
    updateConfig({ [option]: newValue });

    // 语音反馈
    if (config.textToSpeech) {
      const optionNameMap: Record<keyof AccessibilityConfig, string> = {
        highContrast: t('common.accessibilityLabels.highContrast') as string,
        largeText: t('common.accessibilityLabels.largeText') as string,
        reducedMotion: t('common.accessibilityLabels.reducedMotion') as string,
        screenReader: t('common.accessibilityLabels.screenReader') as string,
        keyboardNavigation: t('common.accessibilityLabels.keyboardNavigation') as string,
        focusVisible: t('common.accessibilityLabels.focusVisible', { fallback: '焦点可见' }) as string,
        colorBlindFriendly: t('common.accessibilityLabels.colorBlindFriendly') as string,
        textToSpeech: t('common.accessibilityLabels.textToSpeech') as string
      };
      speakText(`${optionNameMap[option]}${newValue ? t('common.open', { fallback: '已开启' }) : t('common.close', { fallback: '已关闭' })}`);
    }
  };

  return (
    <div className={`${variant === 'compact' ? 'relative' : ''} ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t('common.aria.accessibilitySettings') as string}
        title={t('common.aria.accessibilitySettings') as string}
        className="relative p-2 w-10 h-10 rounded-lg bg-gray-200/80 dark:bg-gray-700/80 hover:bg-gray-300/80 dark:hover:bg-gray-600/80 backdrop-blur-sm border border-gray-300/20 dark:border-gray-600/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
      >
        <Eye className="w-5 h-5" />
        {showText && <span className="ml-2 text-sm">{t('common.accessibility', { fallback: '可访问性' }) as string}</span>}
      </button>

      {isOpen && (
        <AccessibilitySettingsPanel
          config={config}
          variant={variant}
          isSpeaking={isSpeaking}
          onToggleOption={toggleOption}
          onSpeakHelp={() => speakText(t('common.accessibilityLabels.readHelpMessage') as string)}
          onStopSpeaking={stopSpeaking}
        />
      )}
    </div>
  );
};

// 保留原有的 AccessibilityToolbar 组件以保持向后兼容
export const AccessibilityToolbar: React.FC<{ className?: string }> = ({ className = '' }) => {
  return <AccessibilityButton className={`fixed bottom-24 right-6 z-40 ${className}`} variant="full" />;
};
