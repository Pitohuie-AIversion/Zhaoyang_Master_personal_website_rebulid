export interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'publication' | 'patent' | 'award' | 'project' | 'skill' | 'page';
  url: string;
  relevance: number;
  metadata?: {
    year?: number;
    authors?: string[];
    journal?: string;
    patentNumber?: string;
    organization?: string;
    level?: string;
    tags?: string[];
    doi?: string;
  };
}

export interface SearchOptions {
  limit?: number;
  types?: SearchResult['type'][];
  minRelevance?: number;
  fuzzy?: boolean;
}

const SEARCH_CONTENT: SearchResult[] = [
  {
    id: 'pub-damformer',
    title: 'Generalizing morphologies in dam break simulations using transformer model',
    description: 'DamFormer applies a Transformer neural operator to cross-geometry dam-break flow prediction.',
    type: 'publication',
    url: '/research',
    relevance: 0.95,
    metadata: {
      year: 2025,
      authors: ['Zhaoyang Mu', 'Aoming Liang', 'Mingming Ge', 'Dashuai Chen', 'Dixia Fan', 'Minyi Xu'],
      journal: 'Physics of Fluids',
      doi: '10.1063/5.0187644',
      tags: ['Transformer', 'CFD', 'dam break', '论文', '溃坝']
    }
  },
  {
    id: 'pub-rs-modcubes',
    title: 'Rs-ModCubes: Self-reconfigurable, scalable, modular cubic robots for underwater operations',
    description: 'Self-reconfigurable modular cubic robots designed for scalable underwater operations.',
    type: 'publication',
    url: '/research',
    relevance: 0.92,
    metadata: {
      year: 2025,
      authors: ['Jiaxi Zheng', 'Guangmin Dai', 'Botao He', 'Zhaoyang Mu', 'Zhaochen Meng', 'Tianyi Zhang', 'Weiming Zhi', 'Dixia Fan'],
      journal: 'IEEE Robotics and Automation Letters',
      doi: '10.1109/LRA.2025.10891552',
      tags: ['modular robot', 'underwater', 'self-reconfiguration', '论文', '水下机器人']
    }
  },
  {
    id: 'patent-underwater-navigation',
    title: 'Dynamic Environment Perception and Navigation Device and Method for an Underwater Robot',
    description: 'Multi-source sensing, path planning, and dynamic obstacle avoidance for underwater navigation.',
    type: 'patent',
    url: '/research',
    relevance: 0.9,
    metadata: {
      patentNumber: 'CN119509546A',
      organization: 'Westlake University',
      tags: ['patent', 'underwater navigation', '专利', '水下机器人', '西湖大学']
    }
  },
  {
    id: 'award-internet-plus',
    title: 'Gold Award in the 8th China International “Internet+” College Students Innovation and Entrepreneurship Competition',
    description: 'Gold award for the Kunpeng Technology underwater hull inspection robot project.',
    type: 'award',
    url: '/research',
    relevance: 0.86,
    metadata: {
      organization: 'Ministry of Education',
      level: 'national',
      tags: ['award', 'robotics', '金奖', '互联网+', '水下机器人']
    }
  },
  {
    id: 'project-damformer',
    title: 'DamFormer: Transformer-based Dam-break Flow Prediction',
    description: 'Scientific-computing project for high-accuracy, cross-geometry flow prediction.',
    type: 'project',
    url: '/projects',
    relevance: 0.9,
    metadata: {
      year: 2024,
      tags: ['PyTorch', 'Transformer', 'CFD', '科学计算', '溃坝']
    }
  },
  {
    id: 'project-sparse-to-dense',
    title: 'Sparse-to-Dense Flow Field Reconstruction',
    description: 'Transformer neural operator for reconstructing dense flow fields from sparse sensor data.',
    type: 'project',
    url: '/projects',
    relevance: 0.88,
    metadata: {
      year: 2024,
      tags: ['PyTorch', 'neural operator', 'flow field', '科学计算', '流场重构']
    }
  },
  {
    id: 'skill-python',
    title: 'Python and scientific computing',
    description: 'Python development for machine learning, numerical simulation, and scientific computing.',
    type: 'skill',
    url: '/skills',
    relevance: 0.82,
    metadata: { tags: ['Python', 'PyTorch', 'machine learning', '技能', '科学计算'] }
  },
  {
    id: 'page-home',
    title: 'Home / 首页',
    description: 'Zhaoyang Mu personal academic website and research overview.',
    type: 'page',
    url: '/',
    relevance: 0.75,
    metadata: { tags: ['home', '首页', '牟昭阳'] }
  },
  {
    id: 'page-publications',
    title: 'Publications / 论文',
    description: 'Peer-reviewed publications and academic output.',
    type: 'page',
    url: '/publications',
    relevance: 0.8,
    metadata: { tags: ['papers', 'publications', '论文', '学术成果'] }
  },
  {
    id: 'page-contact',
    title: 'Contact / 联系',
    description: 'Contact information and collaboration enquiries.',
    type: 'page',
    url: '/contact',
    relevance: 0.72,
    metadata: { tags: ['contact', 'email', '联系', '合作'] }
  }
];

class SearchService {
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
      const searchTerms = this.extractSearchTerms(item);
      searchTerms.forEach(term => {
        if (!this.searchIndex.has(term)) {
          this.searchIndex.set(term, []);
        }
        this.searchIndex.get(term)!.push(item);
      });
    });
  }

  // 提取搜索词
  private extractSearchTerms(item: SearchResult): string[] {
    const terms: string[] = [];

    // 标题分词
    const titleWords = item.title.toLowerCase().split(/\s+/);
    terms.push(...titleWords);

    // 描述分词
    const descriptionWords = item.description.toLowerCase().split(/\s+/);
    terms.push(...descriptionWords);

    // 元数据分词
    if (item.metadata) {
      if (item.metadata.authors) {
        item.metadata.authors.forEach(author => {
          terms.push(...author.toLowerCase().split(/\s+/));
        });
      }
      if (item.metadata.journal) {
        terms.push(...item.metadata.journal.toLowerCase().split(/\s+/));
      }
      if (item.metadata.tags) {
        item.metadata.tags.forEach(tag => {
          terms.push(tag.toLowerCase());
        });
      }
    }

    // 添加类型相关的词
    const typeTerms = this.getTypeTerms(item.type);
    terms.push(...typeTerms);

    // 去重并过滤
    return [...new Set(terms)].filter(term => term.length > 1);
  }

  // 获取类型相关的搜索词
  private getTypeTerms(type: SearchResult['type']): string[] {
    const termsMap: Record<string, string[]> = {
      publication: ['论文', 'paper', 'publication', '发表', 'journal', '会议'],
      patent: ['专利', 'patent', '发明', '知识产权'],
      award: ['奖项', 'award', '荣誉', '奖励', 'competition'],
      project: ['项目', 'project', '作品', '开发'],
      skill: ['技能', 'skill', '技术', 'technology'],
      page: ['页面', 'page', 'section']
    };
    return termsMap[type] || [];
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

    const queryTerms = query.toLowerCase().split(/\s+/).filter(term => term.length > 1);

    if (queryTerms.length === 0) {
      return [];
    }

    const results = new Map<string, { item: SearchResult; score: number }>();

    // 搜索匹配
    queryTerms.forEach(term => {
      const matches = this.searchIndex.get(term) || [];

      matches.forEach(item => {
        if (!types.includes(item.type)) return;

        const score = this.calculateRelevance(item, queryTerms, query);

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
          if (this.isFuzzyMatch(term, indexTerm)) {
            items.forEach(item => {
              if (!types.includes(item.type)) return;

              const score = this.calculateRelevance(item, queryTerms, query) * 0.7; // 降低模糊匹配分数

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

  // 计算相关性分数
  private calculateRelevance(item: SearchResult, queryTerms: string[], originalQuery: string): number {
    let score = item.relevance;

    // 标题完全匹配
    const titleLower = item.title.toLowerCase();
    if (titleLower.includes(originalQuery.toLowerCase())) {
      score += 0.3;
    }

    // 描述完全匹配
    const descriptionLower = item.description.toLowerCase();
    if (descriptionLower.includes(originalQuery.toLowerCase())) {
      score += 0.2;
    }

    // 词项匹配
    queryTerms.forEach(term => {
      if (titleLower.includes(term)) {
        score += 0.1;
      }
      if (descriptionLower.includes(term)) {
        score += 0.05;
      }
    });

    // 类型优先级
    const typeScores: Record<string, number> = {
      publication: 0.1,
      patent: 0.08,
      award: 0.06,
      project: 0.04,
      skill: 0.02,
      page: 0.01
    };
    score += typeScores[item.type] || 0;

    return Math.min(score, 1.0);
  }

  // 模糊匹配
  private isFuzzyMatch(term1: string, term2: string): boolean {
    if (Math.abs(term1.length - term2.length) > 2) return false;

    const distance = this.levenshteinDistance(term1, term2);
    return distance <= 2 && distance < Math.max(term1.length, term2.length) * 0.4;
  }

  // Levenshtein距离算法
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }

    return matrix[str2.length][str1.length];
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
    this.searchIndex.forEach((items, term) => {
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
