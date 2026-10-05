import type { RadarData } from '../../../../types';
import type { TranslationFn } from './types';

/**
 * 技能雷达图六维评估数据
 */
export const getRadarData = (t: TranslationFn): RadarData[] => [
  { subject: t('skills.categories.programming') as string, A: 85, fullMark: 100 },
  { subject: t('skills.categories.simulation') as string, A: 85, fullMark: 100 },
  { subject: t('skills.categories.aiMl') as string, A: 80, fullMark: 100 },
  { subject: t('skills.categories.hardware') as string, A: 80, fullMark: 100 },
  { subject: t('skills.categories.tools') as string, A: 90, fullMark: 100 },
  { subject: t('skills.radar.theory') as string, A: 85, fullMark: 100 },
];

/**
 * 熟练度指示条颜色
 */
export const getSkillLevelColor = (level: number): string => {
  if (level >= 90) return 'bg-green-500';
  if (level >= 80) return 'bg-blue-500';
  if (level >= 70) return 'bg-yellow-500';
  if (level >= 60) return 'bg-orange-500';
  return 'bg-red-500';
};

/**
 * 熟练度等级描述文本
 */
export const getSkillLevelText = (level: number, t: TranslationFn): string => {
  if (level >= 90) return t('skills.levels.expert') as string;
  if (level >= 80) return t('skills.levels.proficient') as string;
  if (level >= 70) return t('skills.levels.good') as string;
  if (level >= 60) return t('skills.levels.average') as string;
  return t('skills.levels.beginner') as string;
};
