import React from 'react';
import { X, Minimize2, Maximize2, RotateCcw, Globe } from 'lucide-react';
import { useTranslation } from '../../../common/TranslationProvider';

interface ChatHeaderProps {
  isMinimized: boolean;
  onToggleMinimize: () => void;
  onClearHistory: () => void;
  onClose: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  isMinimized,
  onToggleMinimize,
  onClearHistory,
  onClose,
}) => {
  const { t, language, setLanguage } = useTranslation();

  const toggleLanguage = () => {
    const newLang = language === 'zh' ? 'en' : 'zh';
    setLanguage(newLang);
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-2xl">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
          <span className="text-sm font-bold">
            {t('research.chatAssistant.aiLabel', { fallback: 'AI' }) as string}
          </span>
        </div>
        <div>
          <h3 className="font-semibold text-sm">{t('research.chatAssistant.title') as string}</h3>
          <p className="text-xs opacity-80">{t('research.chatAssistant.subtitle') as string}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* 语言切换 */}
        <button
          onClick={toggleLanguage}
          className="p-1.5 hover:bg-white/20 rounded-lg transition-colors duration-200"
          title={t('research.chatAssistant.language.switch') as string}
          aria-label={t('research.chatAssistant.language.switch') as string}
        >
          <Globe className="w-4 h-4" />
        </button>

        {/* 清空历史 */}
        <button
          onClick={onClearHistory}
          className="p-1.5 hover:bg-white/20 rounded-lg transition-colors duration-200"
          title={t('research.chatAssistant.clearHistory') as string}
          aria-label={t('research.chatAssistant.clearHistory') as string}
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* 最小化 */}
        <button
          onClick={onToggleMinimize}
          className="p-1.5 hover:bg-white/20 rounded-lg transition-colors duration-200"
          title={
            isMinimized
              ? (t('research.chatAssistant.maximize') as string)
              : (t('research.chatAssistant.minimize') as string)
          }
          aria-label={
            isMinimized
              ? (t('research.chatAssistant.maximize') as string)
              : (t('research.chatAssistant.minimize') as string)
          }
        >
          {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
        </button>

        {/* 关闭 */}
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-white/20 rounded-lg transition-colors duration-200"
          title={t('research.chatAssistant.close') as string}
          aria-label={t('research.chatAssistant.close') as string}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
