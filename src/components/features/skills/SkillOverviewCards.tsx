import React from 'react';
import { SimpleMotion } from '../../animations/SimpleMotion';
import { Star } from 'lucide-react';
import { useTranslation } from '../../common/TranslationProvider';
import { SkillCategory } from '../../../types';

export interface SkillOverviewCardsProps {
  skillCategories: SkillCategory[];
}

export const SkillOverviewCards: React.FC<SkillOverviewCardsProps> = ({
  skillCategories,
}) => {
  const { t } = useTranslation();

  return (
    <SimpleMotion
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {skillCategories.map((category) => {
        const avgLevel = Math.round(
          category.skills.reduce((sum, skill) => sum + skill.level, 0) / category.skills.length
        );

        return (
          <div
            key={category.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center"
          >
            <div
              className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-${category.color}-100 dark:bg-${category.color}-900 mb-4`}
            >
              <div className={`text-${category.color}-600 dark:text-${category.color}-400`}>
                {category.icon}
              </div>
            </div>
            <h3 className="text-lg font-semibold text-primary-dark theme-transition mb-2">
              {category.name}
            </h3>
            <div className="flex items-center justify-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(avgLevel / 20)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-secondary-dark theme-transition">
              {t('skills.avgProficiency') as string}: {avgLevel}%
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {category.skills.length} {t('skills.skillsCount') as string}
            </p>
          </div>
        );
      })}
    </SimpleMotion>
  );
};

export default SkillOverviewCards;
