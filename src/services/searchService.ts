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

class SearchService {
  private searchIndex: Map<string, SearchResult[]> = new Map();
  private isInitialized = false;

  // 初始化搜索索引
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // 这里可以从API获取数据，现在使用模拟数据
      const mockData: SearchResult[] = [
        // 论文
        {
          id: 'pub-1',
          title: 'DAMFormer: A Deep Learning Approach for Sparse-to-Dense Modeling',
          description: 'A novel transformer-based architecture for sparse-to-dense modeling in scientific computing applications.',
          type: 'publication',
          url: '/research#publication-1',
          relevance: 0.95,
          metadata: {
            year: 2025,
            authors: ['Zhaoyang Mu', 'Co-author 1', 'Co-author 2'],
            journal: 'Journal of Computational Physics',
            doi: '10.1063/5.0187644'
          }
        },
        {
          id: 'pub-2', 
          title: 'RS-ModCubes: Remote Sensing Data Processing',
          description: 'Advanced modular cube processing framework for remote sensing data analysis and visualization.',
          type: 'publication',
          url: '/research#publication-2',
          relevance: 0.90,
          metadata: {
            year: 2025,
            authors: ['Zhaoyang Mu', 'Co-author 3'],
            journal: 'Remote Sensing Journal'
          }
        },
        // 专利
        {
          id: 'pat-1',
          title: '水下机器人导航系统',
          description: '基于多传感器融合的水下机器人自主导航与定位系统。',
          type: 'patent',
          url: '/research#patent-1', 
          relevance: 0.92,
          metadata: {
            patentNumber: 'CN119509546A',
            organization: '研究机构',
            year: 2024
          }
        },
        {
          id: 'pat-2',
          title: '矢量推进器控制方法',
          description: '新型矢量推进器控制算法，提高水下机器人机动性能。',
          type: 'patent',
          url: '/research#patent-2',
          relevance: 0.88,
          metadata: {
            patentNumber: 'CN119239885A',
            organization: '研究机构', 
            year: 2024
          }
        },
        // 奖项
        {
          id: 'awd-1',
          title: '互联网+大学生创新创业大赛金奖',
          description: '基于人工智能的水下机器人系统获得国家级金奖。',
          type: 'award',
          url: '/research#award-1',
          relevance: 0.85,
          metadata: {
            organization: '教育部',
            level: 'national',
            year: 2023
          }
        },
        {
          id: 'awd-2',
          title: '全国机器人大赛一等奖',
          description: '在复杂环境下的机器人控制算法获得全国一等奖。',
          type: 'award',
          url: '/research#award-2',
          relevance: 0.83,
          metadata: {
            organization: '中国人工智能学会',
            level: 'national', 
            year: 2022
          }
        },
        // 项目
        {
          id: 'prj-1',
          title: '智能水下机器人系统',
          description: '集成感知、决策、控制于一体的智能水下机器人平台开发。',
          type: 'project',
          url: '/projects#project-1',
          relevance: 0.90,
          metadata: {
            year: 2024,
            tags: ['机器人', '人工智能', '水下探测']
          }
        },
        {
          id: 'prj-2',
          title: '科学计算可视化平台',
          description: '高性能科学计算数据可视化与分析平台。',
          type: 'project',
          url: '/projects#project-2', 
          relevance: 0.87,
          metadata: {
            year: 2023,
            tags: ['科学计算', '数据可视化', '高性能计算']
          }
        },
        // 技能
        {
          id: 'skl-1',
          title: 'Python编程',
          description: '高级Python开发，包括科学计算、机器学习、Web开发等。',
          type: 'skill',
          url: '/skills#skill-1',
          relevance: 0.80,
          metadata: {
            tags: ['编程语言', '科学计算', '机器学习']
          }
        },
        {
          id: 'skl-2',
          title: '机器学习与深度学习',
          description: '掌握主流机器学习算法和深度学习框架。',
          type: 'skill',
          url: '/skills#skill-2',
          relevance: 0.85,
          metadata: {
            tags: ['人工智能', '深度学习', 'TensorFlow', 'PyTorch']
          }
        },
        // 页面
        {
          id: 'page-home',
          title: '首页',
          description: '牟昭阳个人学术网站首页，展示个人简介和最新动态。',
          type: 'page',
          url: '/',
          relevance: 0.75
        },
        {
          id: 'page-research',
          title: '学术研究',
          description: '展示学术研究成果，包括论文、专利、奖项等。',
          type: 'page',
          url: '/research',
          relevance: 0.80
        },
        {
          id: 'page-projects',
          title: '项目作品',
          description: '个人项目作品集，展示技术能力和创新成果。',
          type: 'page',
          url: '/projects',
          relevance: 0.78
        }
      ];

      // 构建搜索索引
      this.buildSearchIndex(mockData);
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize search service:', error);
      throw error;
    }
  }

  // 构建搜索索引
  private buildSearchIndex(data: SearchResult[]): void {
    // 按类型分组
    const grouped = data.reduce((acc, item) => {
      if (!acc[item.type]) {
        acc[item.type] = [];
      }
      acc[item.type].push(item);
      return acc;
    }, {} as Record<string, SearchResult[]>);

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