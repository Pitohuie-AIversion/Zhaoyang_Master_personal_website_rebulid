import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { useTranslation } from '../../common/TranslationProvider';
import type { LanguageSelectorProps } from './types';

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ className = '' }) => {
  const { language, setLanguage, isTranslating, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    {
      code: 'zh',
      name: t('common.languageOptions.chinese', { fallback: '中文' }) as string,
      flag: '🇨🇳',
    },
    {
      code: 'en',
      name: t('common.languageOptions.english', { fallback: 'English' }) as string,
      flag: '🇺🇸',
    },
  ];

  return (
    <div className={`relative ${className}`}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isTranslating}
        className="
          px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm
          border border-white/20 transition-all duration-300
          flex items-center space-x-2 text-white/90 hover:text-white
          disabled:opacity-50 disabled:cursor-not-allowed
        "
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm">
          {languages.find((lang) => lang.code === language)?.flag}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </motion.div>
      </motion.button>

      {/* 下拉菜单 */}
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{
          opacity: isOpen ? 1 : 0,
          y: isOpen ? 0 : -10,
          scale: isOpen ? 1 : 0.95,
        }}
        transition={{ duration: 0.2 }}
        className={`
          absolute top-full mt-2 right-0 z-50
          bg-gray-900/95 backdrop-blur-sm rounded-lg border border-white/20
          shadow-xl overflow-hidden
          ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}
        `}
      >
        {languages.map((lang) => (
          <motion.button
            key={lang.code}
            onClick={() => {
              setLanguage(lang.code as 'zh' | 'en');
              setIsOpen(false);
            }}
            className={`
              w-full px-4 py-3 text-left flex items-center space-x-3
              hover:bg-white/10 transition-colors duration-200
              ${
                language === lang.code
                  ? 'bg-blue-500/20 text-blue-300'
                  : 'text-white/80'
              }
            `}
            whileHover={{ x: 4 }}
          >
            <span className="text-lg">{lang.flag}</span>
            <span className="text-sm font-medium">{lang.name}</span>
            {language === lang.code && (
              <motion.div
                className="ml-auto w-2 h-2 bg-blue-400 rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </motion.button>
        ))}
      </motion.div>

      {/* 点击外部关闭遮罩 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};
