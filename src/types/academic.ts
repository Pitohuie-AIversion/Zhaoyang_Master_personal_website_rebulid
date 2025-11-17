/**
 * 学术数据类型定义
 * 用于Google Scholar集成和学术影响力展示
 */

// Google Scholar个人资料
export interface ScholarProfile {
  id: string;
  name: string;
  affiliation: string;
  citations: number;
  hIndex: number;
  i10Index: number;
  papers: ScholarPaper[];
}

// Google Scholar论文数据
export interface ScholarPaper {
  title: string;
  authors: string[];
  journal: string;
  year: number;
  citations: number;
  doi?: string;
  url?: string;
  abstract?: string;
}

// 学术指标汇总
export interface AcademicMetrics {
  totalCitations: number;
  hIndex: number;
  i10Index: number;
  totalPapers: number;
  yearCitations: { [year: string]: number }; // 按年份的引用分布
  citationTrend: number[]; // 近5年引用趋势
}

// 论文详细指标
export interface PublicationMetrics {
  title: string;
  authors: string[];
  journal: string;
  year: number;
  citations: number;
  doi?: string;
  url?: string;
  citationVelocity: number; // 引用速度（年均引用数）
  impact?: number; // 影响因子
  quartile?: string; // 期刊分区
}

// 引用趋势数据
export interface CitationTrend {
  year: number;
  citations: number;
  papers: number;
}

// 学术影响力图表数据
export interface AcademicChartData {
  citationTrend: CitationTrend[];
  topPapers: PublicationMetrics[];
  yearlyDistribution: { year: number; count: number }[];
  collaborationNetwork: CollaborationNode[];
}

// 合作网络节点
export interface CollaborationNode {
  name: string;
  affiliation: string;
  collaborationCount: number;
  papers: string[];
  category: 'supervisor' | 'collaborator' | 'student';
}

// UI组件props类型
export interface AcademicMetricsProps {
  scholarId?: string;
  className?: string;
  showCharts?: boolean;
  refreshInterval?: number; // 自动刷新间隔（毫秒）
}

export interface CitationChartProps {
  data: CitationTrend[];
  className?: string;
  height?: number;
}

export interface PaperListProps {
  papers: PublicationMetrics[];
  showCitations?: boolean;
  showVelocity?: boolean;
  maxItems?: number;
  className?: string;
}