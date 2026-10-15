import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createTranslationFunction } from '../../utils/i18n';

type Language = 'zh' | 'en';

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: import('../../utils/i18n').TranslationFunction;
  isTranslating: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

interface TranslationProviderProps {
  children: ReactNode;
}

export function TranslationProvider({ children }: TranslationProviderProps) {
  const [language, setLanguageState] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['zh', 'en'].includes(savedLanguage)) {
      return savedLanguage;
    }
    // 检测浏览器语言
    const browserLang = navigator.language.toLowerCase();
    return browserLang.startsWith('zh') ? 'zh' : 'en';
  });

  const isTranslating = false;
  
  // console.log('TranslationProvider 当前语言:', language);

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (newLanguage: Language) => {
    if (newLanguage === language) return;
    
    setLanguageState(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  // 翻译函数，使用新的翻译文件系统
  const t = createTranslationFunction(language);
  
  // 调试翻译函数
  // console.log('翻译函数测试:', {
  //   'navigation.home': t('navigation.home'),
  //   'navigation.publications': t('navigation.publications'),
  //   language,
  //   'createTranslationFunction': typeof createTranslationFunction
  // });

  const toggleLanguage = () => {
    const newLanguage = language === 'zh' ? 'en' : 'zh';
    setLanguage(newLanguage);
  };

  const value: TranslationContextType = {
    language,
    setLanguage,
    toggleLanguage,
    t,
    isTranslating
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
}

// useTranslation hook
// eslint-disable-next-line react-refresh/only-export-components
export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within TranslationProvider');
  }
  return context;
};

export { TranslationContext, type Language, type TranslationContextType };
