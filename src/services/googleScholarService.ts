import { AcademicMetrics, PublicationMetrics, ScholarProfile } from '../types/academic';

/**
 * Google Scholar 学术数据服务
 * 用于获取和展示学术影响力指标
 */
export class GoogleScholarService {
  private static instance: GoogleScholarService;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24小时缓存

  static getInstance(): GoogleScholarService {
    if (!GoogleScholarService.instance) {
      GoogleScholarService.instance = new GoogleScholarService();
    }
    return GoogleScholarService.instance;
  }

  /**
   * 获取Google Scholar个人资料数据
   */
  async getScholarProfile(scholarId: string): Promise<ScholarProfile | null> {
    try {
      // 检查缓存
      const cacheKey = `profile_${scholarId}`;
      const cached = this.cache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
        return cached.data;
      }

      // 模拟Google Scholar数据获取
      // 实际项目中需要使用Google Scholar API或爬虫
      const profile = await this.fetchScholarData(scholarId);
      
      if (profile) {
        this.cache.set(cacheKey, { data: profile, timestamp: Date.now() });
      }
      
      return profile;
    } catch (error) {
      console.error('Failed to fetch Google Scholar profile:', error);
      return null;
    }
  }

  /**
   * 获取学术指标数据
   */
  async getAcademicMetrics(scholarId: string): Promise<AcademicMetrics | null> {
    try {
      const profile = await this.getScholarProfile(scholarId);
      if (!profile) return null;

      return {
        totalCitations: profile.citations,
        hIndex: profile.hIndex,
        i10Index: profile.i10Index,
        totalPapers: profile.papers.length,
        yearCitations: this.calculateYearCitations(profile.papers),
        citationTrend: this.calculateCitationTrend(profile.papers)
      };
    } catch (error) {
      console.error('Failed to calculate academic metrics:', error);
      return null;
    }
  }

  /**
   * 获取论文指标详情
   */
  async getPublicationMetrics(scholarId: string): Promise<PublicationMetrics[]> {
    try {
      const profile = await this.getScholarProfile(scholarId);
      if (!profile) return [];

      return profile.papers.map(paper => ({
        title: paper.title,
        authors: paper.authors,
        journal: paper.journal,
        year: paper.year,
        citations: paper.citations,
        doi: paper.doi,
        url: paper.url,
        citationVelocity: this.calculateCitationVelocity(paper)
      }));
    } catch (error) {
      console.error('Failed to get publication metrics:', error);
      return [];
    }
  }

  /**
   * 模拟Google Scholar数据获取
   * 实际项目中需要替换为真实的API调用
   */
  private async fetchScholarData(scholarId: string): Promise<ScholarProfile | null> {
    // 这里使用模拟数据，实际项目中需要调用Google Scholar API
    // 由于Google Scholar没有官方API，可以考虑使用第三方服务如serpapi.com
    
    await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟网络延迟

    return {
      id: scholarId,
      name: 'Zhaoyang Mu',
      affiliation: 'Dalian Maritime University & Westlake University',
      citations: 156,
      hIndex: 7,
      i10Index: 5,
      papers: [
        {
          title: 'DamFormer: Transformer-based Operator Learning for Dam-Break Flood Simulation',
          authors: ['Zhaoyang Mu', 'Zongjun Li', 'Shunqi Pan'],
          journal: 'Physics of Fluids',
          year: 2025,
          citations: 45,
          doi: '10.1063/5.1234567',
          url: 'https://doi.org/10.1063/5.1234567'
        },
        {
          title: 'Rs-ModCubes: A Modular Cube-based Robotic System for Marine Research',
          authors: ['Zhaoyang Mu', 'Wei Zhang', 'Li Wang'],
          journal: 'IEEE Robotics and Automation Letters',
          year: 2025,
          citations: 32,
          doi: '10.1109/LRA.2025.1234567',
          url: 'https://doi.org/10.1109/LRA.2025.1234567'
        },
        {
          title: 'Sparse-to-Dense Transformer for Marine Flow Field Reconstruction',
          authors: ['Zhaoyang Mu', 'Shunqi Pan', 'Zongjun Li'],
          journal: 'Ocean Engineering',
          year: 2024,
          citations: 28,
          doi: '10.1016/j.oceaneng.2024.123456',
          url: 'https://doi.org/10.1016/j.oceaneng.2024.123456'
        },
        {
          title: 'Bio-inspired Fin Propulsion System for Underwater Robots',
          authors: ['Zhaoyang Mu', 'Zongjun Li', 'Wei Zhang'],
          journal: 'Bioinspiration & Biomimetics',
          year: 2024,
          citations: 24,
          doi: '10.1088/1748-3190/abcd12',
          url: 'https://doi.org/10.1088/1748-3190/abcd12'
        },
        {
          title: 'Transformer Neural Operators for Environmental Flow Prediction',
          authors: ['Zhaoyang Mu', 'Shunqi Pan'],
          journal: 'Environmental Modelling & Software',
          year: 2023,
          citations: 18,
          doi: '10.1016/j.envsoft.2023.105678',
          url: 'https://doi.org/10.1016/j.envsoft.2023.105678'
        },
        {
          title: 'Underwater Robot Path Planning with Deep Reinforcement Learning',
          authors: ['Zhaoyang Mu', 'Li Wang', 'Wei Zhang'],
          journal: 'IEEE Access',
          year: 2023,
          citations: 9,
          doi: '10.1109/ACCESS.2023.1234567',
          url: 'https://doi.org/10.1109/ACCESS.2023.1234567'
        }
      ]
    };
  }

  /**
   * 计算年度引用分布
   */
  private calculateYearCitations(papers: any[]): { [year: string]: number } {
    const yearCitations: { [year: string]: number } = {};
    
    papers.forEach(paper => {
      const year = paper.year.toString();
      yearCitations[year] = (yearCitations[year] || 0) + paper.citations;
    });

    return yearCitations;
  }

  /**
   * 计算引用趋势
   */
  private calculateCitationTrend(papers: any[]): number[] {
    const currentYear = new Date().getFullYear();
    const trends: number[] = [];

    for (let i = 4; i >= 0; i--) {
      const year = currentYear - i;
      const yearPapers = papers.filter(p => p.year <= year);
      const totalCitations = yearPapers.reduce((sum, p) => sum + p.citations, 0);
      trends.push(totalCitations);
    }

    return trends;
  }

  /**
   * 计算引用速度
   */
  private calculateCitationVelocity(paper: any): number {
    const currentYear = new Date().getFullYear();
    const paperAge = Math.max(1, currentYear - paper.year);
    return paper.citations / paperAge;
  }

  /**
   * 清除缓存
   */
  clearCache(): void {
    this.cache.clear();
  }
}

// 导出单例实例
export const googleScholarService = GoogleScholarService.getInstance();