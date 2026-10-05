/**
 * 全站搜索模块领域类型定义
 */

export type SearchType = 'publication' | 'patent' | 'award' | 'project' | 'skill' | 'page';

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: SearchType;
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
