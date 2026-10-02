import React from 'react';
import { SimpleMotion } from '../../animations/SimpleMotion';
import { UnifiedButton, ButtonGroup } from '../../common/UnifiedButton';
import { Layers, Zap, BarChart3 } from 'lucide-react';
import { useTranslation } from '../../common/TranslationProvider';
import { SkillCategory } from '../../../types';

export interface SkillControlsProps {
  viewMode: 'grid' | 'radar' | 'chart';
  setViewMode: (mode: 'grid' | 'radar' | 'chart') => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  skillCategories: SkillCategory[];
}

export const SkillControls: React.FC<SkillControlsProps> = ({
  viewMode,
  setViewMode,
  selectedCategory,
  setSelectedCategory,
  skillCategories,
}) => {
  const { t } = useTranslation();

  return (
    <SimpleMotion
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4"
    >
      {/* 视图模式切换 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-1 shadow-md">
        <ButtonGroup spacing="sm">
          <UnifiedButton
            variant={viewMode === 'grid' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
            icon={Layers}
            iconPosition="left"
          >
            {t('skills.viewModes.grid') as string}
          </UnifiedButton>
          <UnifiedButton
            variant={viewMode === 'radar' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('radar')}
            icon={Zap}
            iconPosition="left"
          >
            {t('skills.viewModes.radar') as string}
          </UnifiedButton>
          <UnifiedButton
            variant={viewMode === 'chart' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('chart')}
            icon={BarChart3}
            iconPosition="left"
          >
            {t('skills.viewModes.chart') as string}
          </UnifiedButton>
        </ButtonGroup>
      </div>

      {/* 分类筛选 */}
      <div className="flex flex-wrap gap-2">
        <UnifiedButton
          variant={selectedCategory === 'all' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setSelectedCategory('all')}
        >
          {t('skills.filters.all') as string}
        </UnifiedButton>
        {skillCategories.map((category) => (
          <UnifiedButton
            key={category.id}
            variant={selectedCategory === category.id ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
            icon={category.icon}
            iconPosition="left"
          >
            {category.name}
          </UnifiedButton>
        ))}
      </div>
    </SimpleMotion>
  );
};

export default SkillControls;
