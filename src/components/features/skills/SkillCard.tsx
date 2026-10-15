import React from 'react';
import { SimpleMotion } from '../../animations/SimpleMotion';
import { useTranslation } from '../../common/TranslationProvider';
import { ShowcaseSkill } from '../../../types';

export interface SkillCardProps {
  skill: ShowcaseSkill;
  index: number;
  getSkillLevelColor: (level: number) => string;
  getSkillLevelText: (level: number) => string;
}

export const SkillCard: React.FC<SkillCardProps> = ({
  skill,
  index,
  getSkillLevelColor,
  getSkillLevelText,
}) => {
  const { t } = useTranslation();

  return (
    <SimpleMotion
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-primary-dark theme-transition">
          {skill.name}
        </h3>
        <span
          className={`px-2 py-1 rounded text-xs text-white ${getSkillLevelColor(skill.level)}`}
        >
          {getSkillLevelText(skill.level)}
        </span>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600 dark:text-gray-400">
            {t('skills.proficiency') as string}
          </span>
          <span className="text-gray-800 dark:text-gray-200">{skill.level}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${getSkillLevelColor(skill.level)}`}
            style={{ width: `${skill.level}%` }}
          />
        </div>
      </div>

      <p className="text-sm text-secondary-dark theme-transition mb-4">{skill.description}</p>

      {Array.isArray(skill.projects) && skill.projects.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('skills.relatedProjects') as string}:
          </h4>
          <div className="flex flex-wrap gap-1">
            {skill.projects.map((project, idx) => (
              <span
                key={idx}
                className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded"
              >
                {project}
              </span>
            ))}
          </div>
        </div>
      )}
    </SimpleMotion>
  );
};

export default SkillCard;
