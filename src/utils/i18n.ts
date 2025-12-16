import type { Language } from '../components/common/TranslationProvider';
import zhTranslations from '../locales/zh.json';
import enTranslations from '../locales/en.json';

type TranslationKey = string;
type TranslationValue = string | number | boolean | { [key: string]: unknown } | unknown[];
type TranslationOptions = { returnObjects?: boolean; fallback?: string };
type Translations = { [key: string]: TranslationValue };

const translations: { [lang in Language]: Translations } = {
  zh: zhTranslations,
  en: enTranslations
};

function generateFallbackText(key: string, fallback?: string) {
  if (fallback) return fallback;
  const lastSegment = key.split('.').pop() || key;
  const friendly = lastSegment
    .replace(/([A-Z])/g, ' $1')
    .replace(/[_-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return friendly || key;
}

/**
 * 获取翻译文本
 * @param key 翻译键，支持嵌套键如 'contact.title'
 * @param language 目标语言
 * @param options 额外选项
 * @returns 翻译后的文本或对象
 */
export function getTranslation(
  key: TranslationKey,
  language: Language,
  options?: TranslationOptions
): unknown {
  const { returnObjects = false, fallback } = options || {};
  const keys = key.split('.');

  const resolveValue = (lang: Language): unknown => {
    let value: unknown = translations[lang];
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return undefined;
      }
    }
    return value;
  };

  const primaryValue = resolveValue(language);
  const fallbackLang = language === 'zh' ? 'en' : 'zh';
  const secondaryValue = primaryValue === undefined ? resolveValue(fallbackLang) : undefined;
  const value = primaryValue !== undefined ? primaryValue : secondaryValue;

  if (value !== undefined) {
    if (typeof value === 'string') return value;
    if (typeof value === 'number' || typeof value === 'boolean') return String(value);
    if (returnObjects && (Array.isArray(value) || typeof value === 'object')) {
      return value;
    }
  }

  return generateFallbackText(key, fallback);
}

/**
 * 创建翻译函数
 * @param language 当前语言
 * @returns 翻译函数
 */
export type TranslationFunction = {
  (key: TranslationKey, options?: Omit<TranslationOptions, 'returnObjects'> & { returnObjects?: false }): string;
  (key: TranslationKey, options: TranslationOptions & { returnObjects: true }): unknown;
};

export function createTranslationFunction(language: Language): TranslationFunction {
  const fn = (key: TranslationKey, options?: TranslationOptions): unknown => {
    return getTranslation(key, language, options);
  };
  return fn as TranslationFunction;
}

/**
 * 获取所有可用的翻译键
 * @param obj 翻译对象
 * @param prefix 前缀
 * @returns 翻译键数组
 */
export function getAllTranslationKeys(obj: Record<string, unknown> = translations.zh, prefix = ''): string[] {
  const keys: string[] = [];

  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (typeof obj[key] === 'object' && obj[key] !== null) {
      keys.push(...getAllTranslationKeys(obj[key] as Record<string, unknown>, fullKey));
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
  let value: unknown = translations[language];

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      return false;
    }
  }

  return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean';
}

export { translations };
export default translations;
