import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import translationService from '../services/translationService';
import { toast } from 'sonner';
import { createTranslationFunction } from '../utils/i18n';

type Language = 'zh' | 'en';

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, options?: { returnObjects?: boolean; fallback?: string }) => any;
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

  const [isTranslating, setIsTranslating] = useState(false);
  const [translationCache, setTranslationCache] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = async (newLanguage: Language) => {
    if (newLanguage === language) return;
    
    setLanguageState(newLanguage);
    localStorage.setItem('language', newLanguage);
    
    setIsTranslating(true);
    
    try {
      await translatePageContent(newLanguage);
    } catch (error) {
      console.error('Translation failed:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  const translatePageContent = async (targetLang: Language) => {
    const sourceLang = language;
    
    // 获取所有需要翻译的文本元素
    const elementsToTranslate = document.querySelectorAll(
      '[data-translate], h1, h2, h3, h4, h5, h6, p, span:not([class*="icon"]):not([class*="lucide"]), button:not([aria-label]), a:not([aria-label])'
    );

    const translationPromises: Promise<void>[] = [];

    elementsToTranslate.forEach((element) => {
      const htmlElement = element as HTMLElement;
      
      // 跳过已经处理过的元素或包含子元素的复杂元素
      if (htmlElement.dataset.translated === 'true' || 
          htmlElement.children.length > 0 || 
          !htmlElement.textContent?.trim()) {
        return;
      }

      const originalText = htmlElement.textContent.trim();
      if (originalText.length === 0) return;

      // 跳过纯数字、符号或很短的文本
      if (/^[\d\s\-_.,!@#$%^&*()+={}\[\]|\\:;"'<>?/~`]+$/.test(originalText) || 
          originalText.length < 2) {
        return;
      }

      const translationPromise = (async () => {
        try {
          const cacheKey = `${originalText}_${sourceLang}_${targetLang}`;
          let translatedText = translationCache.get(cacheKey);
          
          if (!translatedText) {
            translatedText = await translationService.translateText(
              originalText, 
              targetLang, 
              sourceLang
            );
            
            // 更新缓存
            setTranslationCache(prev => new Map(prev.set(cacheKey, translatedText!)));
          }
          
          if (translatedText && translatedText !== originalText) {
            htmlElement.textContent = translatedText;
            htmlElement.dataset.translated = 'true';
            htmlElement.dataset.originalText = originalText;
          }
        } catch (error) {
          console.warn(`Failed to translate: "${originalText}"`, error);
        }
      })();

      translationPromises.push(translationPromise);
    });

    // 等待所有翻译完成
    await Promise.allSettled(translationPromises);
  };

  // 翻译函数，使用新的翻译文件系统
  const t = createTranslationFunction(language);

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

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}

export { TranslationContext, type Language, type TranslationContextType };