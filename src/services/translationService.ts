import type { Language } from '../components/TranslationProvider';

interface TranslationCache {
  [key: string]: {
    [lang in Language]?: string;
  };
}

class TranslationService {
  private cache: TranslationCache = {};
  private apiKey: string = '';
  private baseUrl = 'https://translate.googleapis.com/translate_a/single';

  constructor() {
    // 在实际项目中，API密钥应该从环境变量获取
    // this.apiKey = process.env.REACT_APP_GOOGLE_TRANSLATE_API_KEY || '';
  }

  // 设置API密钥
  setApiKey(key: string) {
    this.apiKey = key;
  }

  // 获取缓存的翻译
  private getCachedTranslation(text: string, targetLang: Language): string | null {
    return this.cache[text]?.[targetLang] || null;
  }

  // 缓存翻译结果
  private setCachedTranslation(text: string, targetLang: Language, translation: string) {
    if (!this.cache[text]) {
      this.cache[text] = {};
    }
    this.cache[text][targetLang] = translation;
  }

  // 使用Google Translate API翻译文本
  async translateText(text: string, targetLang: Language, sourceLang: Language = 'zh'): Promise<string> {
    if (!text.trim()) return text;
    if (targetLang === sourceLang) return text;

    // 检查缓存
    const cached = this.getCachedTranslation(text, targetLang);
    if (cached) {
      return cached;
    }

    try {
      // 使用免费的Google Translate API（无需API密钥）
      const url = `${this.baseUrl}?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Translation failed: ${response.status}`);
      }

      const data = await response.json();
      const translation = data[0]?.[0]?.[0] || text;

      // 缓存结果
      this.setCachedTranslation(text, targetLang, translation);
      
      return translation;
    } catch (error) {
      console.warn('Translation failed, using fallback:', error);
      return this.getFallbackTranslation(text, targetLang) || text;
    }
  }

  // 批量翻译
  async translateBatch(texts: string[], targetLang: Language, sourceLang: Language = 'zh'): Promise<string[]> {
    const promises = texts.map(text => this.translateText(text, targetLang, sourceLang));
    return Promise.all(promises);
  }

  // 翻译HTML元素的文本内容
  async translateElement(element: HTMLElement, targetLang: Language, sourceLang: Language = 'zh'): Promise<void> {
    if (!element) return;

    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          const text = node.textContent?.trim();
          return text && text.length > 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
        }
      }
    );

    const textNodes: Text[] = [];
    let node;
    while ((node = walker.nextNode())) {
      textNodes.push(node as Text);
    }

    for (const textNode of textNodes) {
      const originalText = textNode.textContent || '';
      if (originalText.trim()) {
        try {
          const translatedText = await this.translateText(originalText, targetLang, sourceLang);
          textNode.textContent = translatedText;
        } catch (error) {
          console.warn('Failed to translate text node:', error);
        }
      }
    }
  }

  // 获取备用翻译（预定义的常用翻译）
  private getFallbackTranslation(text: string, targetLang: Language): string | null {
    const fallbacks: { [key: string]: { [lang in Language]: string } } = {
      '首页': { zh: '首页', en: 'Home' },
      '研究方向': { zh: '研究方向', en: 'Research' },
      '项目展示': { zh: '项目展示', en: 'Projects' },
      '学术成果': { zh: '学术成果', en: 'Publications' },
      '技能工具': { zh: '技能工具', en: 'Skills' },
      '联系方式': { zh: '联系方式', en: 'Contact' },
      'ASCII演示': { zh: 'ASCII演示', en: 'ASCII Demo' },
      '关于我': { zh: '关于我', en: 'About Me' },
      '个人简介': { zh: '个人简介', en: 'Biography' },
      '教育背景': { zh: '教育背景', en: 'Education' },
      '工作经历': { zh: '工作经历', en: 'Experience' },
      '研究兴趣': { zh: '研究兴趣', en: 'Research Interests' },
      '发表论文': { zh: '发表论文', en: 'Publications' },
      '获得荣誉': { zh: '获得荣誉', en: 'Honors & Awards' },
      '技能专长': { zh: '技能专长', en: 'Skills & Expertise' },
      '项目经验': { zh: '项目经验', en: 'Project Experience' },
      '联系信息': { zh: '联系信息', en: 'Contact Information' },
      '加载中...': { zh: '加载中...', en: 'Loading...' },
      '翻译中...': { zh: '翻译中...', en: 'Translating...' },
      '翻译失败': { zh: '翻译失败', en: 'Translation Failed' },
      '切换语言': { zh: '切换语言', en: 'Switch Language' },
      '中文': { zh: '中文', en: 'Chinese' },
      '英文': { zh: '英文', en: 'English' }
    };

    return fallbacks[text]?.[targetLang] || null;
  }

  // 清除缓存
  clearCache() {
    this.cache = {};
  }

  // 获取缓存统计
  getCacheStats() {
    const keys = Object.keys(this.cache);
    return {
      totalEntries: keys.length,
      totalTranslations: keys.reduce((sum, key) => {
        return sum + Object.keys(this.cache[key]).length;
      }, 0)
    };
  }
}

// 创建单例实例
export const translationService = new TranslationService();
export default translationService;