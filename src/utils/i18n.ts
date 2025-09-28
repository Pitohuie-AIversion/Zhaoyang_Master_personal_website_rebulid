import type { Language } from '../components/TranslationProvider';
import zhTranslations from '../locales/zh.json';
import enTranslations from '../locales/en.json';

type TranslationKey = string;
type TranslationValue = string | { [key: string]: any };
type Translations = { [key: string]: TranslationValue };

const translations: { [lang in Language]: Translations } = {
  zh: zhTranslations,
  en: enTranslations
};

/**
 * 获取翻译文本
 * @param key 翻译键，支持嵌套键如 'contact.title'
 * @param language 目标语言
 * @param fallback 备用文本
 * @returns 翻译后的文本
 */
export function getTranslation(
  key: TranslationKey,
  language: Language,
  fallback?: string
): string {
  const keys = key.split('.');
  let value: any = translations[language];
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      // 如果找不到翻译，尝试使用备用语言
      const fallbackLang = language === 'zh' ? 'en' : 'zh';
      let fallbackValue: any = translations[fallbackLang];
      
      for (const fk of keys) {
        if (fallbackValue && typeof fallbackValue === 'object' && fk in fallbackValue) {
          fallbackValue = fallbackValue[fk];
        } else {
          fallbackValue = null;
          break;
        }
      }
      
      if (typeof fallbackValue === 'string') {
        return fallbackValue;
      }
      
      return fallback || key;
    }
  }
  
  return typeof value === 'string' ? value : (fallback || key);
}

/**
 * 创建翻译函数
 * @param language 当前语言
 * @returns 翻译函数
 */
export function createTranslationFunction(language: Language) {
  return (key: TranslationKey, options?: { returnObjects?: boolean; fallback?: string }): any => {
    const fallback = options?.fallback;
    
    if (options?.returnObjects) {
      const keys = key.split('.');
      let value: any = translations[language];
      
      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          // 如果找不到翻译，尝试使用备用语言
          const fallbackLang = language === 'zh' ? 'en' : 'zh';
          let fallbackValue: any = translations[fallbackLang];
          
          for (const fk of keys) {
            if (fallbackValue && typeof fallbackValue === 'object' && fk in fallbackValue) {
              fallbackValue = fallbackValue[fk];
            } else {
              fallbackValue = null;
              break;
            }
          }
          
          return fallbackValue || fallback || [];
        }
      }
      
      return value || fallback || [];
    }
    
    return getTranslation(key, language, fallback);
  };
}

/**
 * 获取所有可用的翻译键
 * @param obj 翻译对象
 * @param prefix 前缀
 * @returns 翻译键数组
 */
export function getAllTranslationKeys(obj: any = translations.zh, prefix = ''): string[] {
  const keys: string[] = [];
  
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      keys.push(...getAllTranslationKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  
  return keys;
}

/**
 * 检查翻译键是否存在
 * @param key 翻译键
 * @param language 语言
 * @returns 是否存在
 */
export function hasTranslation(key: TranslationKey, language: Language): boolean {
  const keys = key.split('.');
  let value: any = translations[language];
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return false;
    }
  }
  
  return typeof value === 'string';
}

export { translations };
export default translations;