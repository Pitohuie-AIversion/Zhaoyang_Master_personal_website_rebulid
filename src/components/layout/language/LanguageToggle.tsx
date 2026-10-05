import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Languages } from 'lucide-react';
import { useTranslation } from '../../common/TranslationProvider';
import type { LanguageToggleProps } from './types';

export const LanguageToggle: React.FC<LanguageToggleProps> = ({
  variant = 'default',
  showText = true,
  className = '',
}) => {
  const { language, toggleLanguage, isTranslating, t } = useTranslation();

  const handleToggle = () => {
    if (isTranslating) return;
    toggleLanguage();
  };

  const variants = {
    default: {
      button:
        'px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-all duration-300',
      icon: 'w-5 h-5',
      text: 'ml-2 text-sm font-medium',
    },
    compact: {
      button:
        'p-2 w-10 h-10 rounded-lg bg-gray-200/80 dark:bg-gray-700/80 hover:bg-gray-300/80 dark:hover:bg-gray-600/80 backdrop-blur-sm border border-gray-300/20 dark:border-gray-600/20 transition-all duration-300',
      icon: 'w-4 h-4',
      text: 'ml-1 text-xs',
    },
    minimal: {
      button: 'p-1 rounded hover:bg-white/10 transition-all duration-300',
      icon: 'w-4 h-4',
      text: 'ml-1 text-xs',
    },
  };

  const currentVariant = variants[variant];

  return (
    <motion.button
      onClick={handleToggle}
      disabled={isTranslating}
      className={`
        ${currentVariant.button}
        ${className}
        flex items-center justify-center
        text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100
        disabled:opacity-50 disabled:cursor-not-allowed
        relative overflow-hidden
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={
        language === 'zh'
          ? (t('common.languageOptions.switchToEnglish') as string)
          : (t('common.languageOptions.switchToChinese') as string)
      }
      aria-label={
        language === 'zh'
          ? (t('common.languageOptions.switchToEnglish') as string)
          : (t('common.languageOptions.switchToChinese') as string)
      }
    >
      {/* 背景动画 */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg"
        initial={{ opacity: 0, scale: 0.8 }}
        whileHover={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      />

      {/* 加载动画 */}
      {isTranslating && (
        <motion.div
          className="absolute inset-0 bg-blue-500/30 rounded-lg"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}

      <div className="relative flex items-center">
        {/* 图标动画 */}
        <motion.div
          animate={isTranslating ? { rotate: 360 } : { rotate: 0 }}
          transition={{
            duration: 1,
            repeat: isTranslating ? Infinity : 0,
            ease: 'linear',
          }}
        >
          {variant === 'minimal' ? (
            <Languages className={currentVariant.icon} />
          ) : (
            <Globe className={currentVariant.icon} />
          )}
        </motion.div>

        {/* 语言文本 */}
        {showText && (
          <motion.span
            className={currentVariant.text}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {language === 'zh'
              ? (t('common.languageOptions.englishShort', { fallback: 'EN' }) as string)
              : (t('common.languageOptions.chineseShort', { fallback: '中' }) as string)}
          </motion.span>
        )}

        {/* 切换指示器 */}
        <motion.div
          className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full"
          initial={{ scale: 0 }}
          animate={{ scale: language === 'en' ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        />
      </div>
    </motion.button>
  );
};
