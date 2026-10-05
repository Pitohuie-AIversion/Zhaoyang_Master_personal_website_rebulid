import { SearchResult } from '../../../../services/searchService';

export const getTypeLabel = (
  type: SearchResult['type'],
  t: (key: string) => string
): string => {
  switch (type) {
    case 'publication': return t('search.publication') || '出版物';
    case 'patent': return t('search.patent') || '专利';
    case 'award': return t('search.award') || '奖项';
    case 'project': return t('search.project') || '项目';
    case 'skill': return t('search.skill') || '技能';
    case 'page': return t('search.page') || '页面';
    default: return type;
  }
};

export const getResultIcon = (type: SearchResult['type']): string => {
  switch (type) {
    case 'publication': return '📄';
    case 'patent': return '💡';
    case 'award': return '🏆';
    case 'project': return '🚀';
    case 'skill': return '⚡';
    case 'page': return '🔗';
    default: return '🔍';
  }
};
