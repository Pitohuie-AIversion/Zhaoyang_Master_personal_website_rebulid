import type { SearchResult, SearchOptions, SearchType } from '../../types';
import { SEARCH_CONTENT } from './searchData';
import {
  tokenize,
  extractSearchTerms,
  isFuzzyMatch,
  calculateRelevance
} from './searchMatcher';

export type { SearchResult, SearchOptions, SearchType };

export class SearchService {
  private searchIndex: Map<string, SearchResult[]> = new Map();
  private isInitialized = false;

  // 初始化搜索索引
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // 构建搜索索引
      this.buildSearchIndex(SEARCH_CONTENT);
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize search service:', error);
      throw error;
    }
  }

  // 构建搜索索引
  private buildSearchIndex(data: SearchResult[]): void {
    // 为每个项目创建搜索词
    data.forEach(item => {
      const searchTerms = extractSearchTerms(item);
      searchTerms.forEach(term => {
        if (!this.searchIndex.has(term)) {
          this.searchIndex.set(term, []);
        }
        this.searchIndex.get(term)!.push(item);
      });
    });
  }

  // 搜索功能
  async search(query: string, options: SearchOptions = {}): Promise<SearchResult[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const {
      limit = 20,
      types = ['publication', 'patent', 'award', 'project', 'skill', 'page'],
      minRelevance = 0.1,
      fuzzy = true
    } = options;

    const queryTerms = tokenize(query);

    if (queryTerms.length === 0) {
      return [];
    }

    const results = new Map<string, { item: SearchResult; score: number }>();

    // 搜索匹配
    queryTerms.forEach(term => {
      const matches = this.searchIndex.get(term) || [];

      matches.forEach(item => {
        if (!types.includes(item.type)) return;

        const score = calculateRelevance(item, queryTerms, query);

        if (score >= minRelevance) {
          const existing = results.get(item.id);
          if (!existing || existing.score < score) {
            results.set(item.id, { item, score });
          }
        }
      });

      // 模糊搜索
      if (fuzzy) {
        this.searchIndex.forEach((items, indexTerm) => {
          if (isFuzzyMatch(term, indexTerm)) {
            items.forEach(item => {
              if (!types.includes(item.type)) return;

              const score = calculateRelevance(item, queryTerms, query) * 0.7; // 降低模糊匹配分数

              if (score >= minRelevance) {
                const existing = results.get(item.id);
                if (!existing || existing.score < score) {
                  results.set(item.id, { item, score });
                }
              }
            });
          }
        });
      }
    });

    // 排序并限制结果数量
    const sortedResults = Array.from(results.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(result => ({
        ...result.item,
        relevance: result.score
      }));

    return sortedResults;
  }

  // 获取搜索建议
  async getSuggestions(query: string, limit: number = 5): Promise<string[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (query.length < 2) return [];

    const suggestions = new Set<string>();
    const queryLower = query.toLowerCase();

    // 从索引中提取建议
    this.searchIndex.forEach((_items, term) => {
      if (term.startsWith(queryLower) && suggestions.size < limit) {
        suggestions.add(term);
      }
    });

    // 从标题中提取建议
    if (suggestions.size < limit) {
      const allItems = Array.from(this.searchIndex.values()).flat();
      allItems.forEach(item => {
        if (suggestions.size >= limit) return;

        const titleWords = item.title.toLowerCase().split(/\s+/);
        titleWords.forEach(word => {
          if (word.startsWith(queryLower) && suggestions.size < limit) {
            suggestions.add(word);
          }
        });
      });
    }

    return Array.from(suggestions).slice(0, limit);
  }

  // 清除缓存
  clearCache(): void {
    this.searchIndex.clear();
    this.isInitialized = false;
  }
}

export const searchService = new SearchService();
