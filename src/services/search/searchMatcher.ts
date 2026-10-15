import type { SearchResult } from '../../types';

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[,.:;!?'"()[\]{}/\\_-]/g, ' ')
    .split(/\s+/)
    .filter(term => term.length > 1);
}

export function getTypeTerms(type: SearchResult['type']): string[] {
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

export function extractSearchTerms(item: SearchResult): string[] {
  const terms: string[] = [];

  // 标题分词
  terms.push(...tokenize(item.title));

  // 描述分词
  terms.push(...tokenize(item.description));

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
  const typeTerms = getTypeTerms(item.type);
  terms.push(...typeTerms);

  // 去重并过滤
  return [...new Set(terms)].filter(term => term.length > 1);
}

export function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1)
    .fill(null)
    .map(() => Array(str1.length + 1).fill(null));

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

export function isFuzzyMatch(term1: string, term2: string): boolean {
  if (Math.abs(term1.length - term2.length) > 2) return false;

  const distance = levenshteinDistance(term1, term2);
  return distance <= 2 && distance < Math.max(term1.length, term2.length) * 0.4;
}

export function calculateRelevance(
  item: SearchResult,
  queryTerms: string[],
  originalQuery: string
): number {
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
