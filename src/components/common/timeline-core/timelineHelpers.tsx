import React from 'react';
import { Calendar, Award, BookOpen, FileText, Briefcase, GraduationCap } from 'lucide-react';
import { TimelineItem } from './types';

export const allTimelineTypes: TimelineItem['type'][] = [
  'education',
  'research',
  'publication',
  'patent',
  'award',
  'project',
  'skill'
];

export const getTypeIcon = (type: string): React.ReactElement => {
  switch (type) {
    case 'education': return <GraduationCap className="w-5 h-5" />;
    case 'research': return <BookOpen className="w-5 h-5" />;
    case 'publication': return <BookOpen className="w-5 h-5" />;
    case 'patent': return <FileText className="w-5 h-5" />;
    case 'award': return <Award className="w-5 h-5" />;
    case 'project': return <Briefcase className="w-5 h-5" />;
    case 'skill': return <Calendar className="w-5 h-5" />;
    default: return <Calendar className="w-5 h-5" />;
  }
};

export const getTypeColor = (type: string): string => {
  switch (type) {
    case 'education': return 'bg-blue-500';
    case 'research': return 'bg-purple-500';
    case 'publication': return 'bg-green-500';
    case 'patent': return 'bg-orange-500';
    case 'award': return 'bg-yellow-500';
    case 'project': return 'bg-indigo-500';
    case 'skill': return 'bg-pink-500';
    default: return 'bg-gray-500';
  }
};

export const getTypeBadgeColor = (type: string): string => {
  switch (type) {
    case 'education':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'publication':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'patent':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    case 'award':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'project':
      return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  }
};

export const getTypeLabel = (type: string, t: (key: string) => string): string => {
  const labels: Record<string, string> = {
    education: t('timeline.types.education') || '教育',
    research: t('timeline.types.research') || '研究',
    publication: t('timeline.types.publication') || '论文',
    patent: t('timeline.types.patent') || '专利',
    award: t('timeline.types.award') || '奖项',
    project: t('timeline.types.project') || '项目',
    skill: t('timeline.types.skill') || '技能'
  };
  return labels[type] || type;
};

export const formatTimelineDate = (dateString: string, language: string): string => {
  if (/^\d{4}$/.test(dateString)) return dateString;
  const date = new Date(dateString + '-01');
  return date.toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: 'short'
  });
};
