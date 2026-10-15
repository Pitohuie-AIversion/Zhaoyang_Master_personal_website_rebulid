import { AcademicMetrics, PublicationMetrics, ScholarProfile } from '../types/academic';

/**
 * Google Scholar 学术数据服务
 * 用于获取和展示学术影响力指标
 */
export class GoogleScholarService {
  private static instance: GoogleScholarService;
  private cache: Map<string, { data: ScholarProfile | null; timestamp: number }> = new Map();
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
   * Google Scholar has no official public API. Do not manufacture profile
   * metrics when a verified data source is unavailable.
   */
  private async fetchScholarData(_scholarId: string): Promise<ScholarProfile | null> {
    return null;
  }

  /**
   * 计算年度引用分布
   */
  private calculateYearCitations(papers: Array<{ year: number; citations: number }>): { [year: string]: number } {
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
  private calculateCitationTrend(papers: Array<{ year: number; citations: number }>): number[] {
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
  private calculateCitationVelocity(paper: { year: number; citations: number }): number {
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
