import React, { useState, useMemo, memo } from 'react';
import { useTranslation } from '../components/common/TranslationProvider';
import { SimpleMotion } from '../components/animations/SimpleMotion';
import {
  LazyRadarChartComponent,
  LazyBarChartComponent,
  ChartContainer,
} from '../components/common/LazyCharts';
import { useResponsive } from '../hooks/useResponsive';
import { SkillsSEO } from '../components/seo/SEOOptimization';
import type { ShowcaseSkill, SkillCategory, RadarData } from '../types';
import {
  SkillCard,
  SkillControls,
  SkillOverviewCards,
  getSkillCategories,
  getRadarData,
  getSkillLevelColor,
  getSkillLevelText,
} from '../components/features/skills';

function Skills() {
  const { t } = useTranslation();
  const { isMobile, isTablet } = useResponsive();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'radar' | 'chart'>('grid');

  // 技能数据分类
  const skillCategories: SkillCategory[] = useMemo(
    () => getSkillCategories(t),
    [t]
  );

  // 雷达图数据
  const radarData: RadarData[] = useMemo(
    () => getRadarData(t),
    [t]
  );

  // 获取筛选后的技能
  const filteredSkills: ShowcaseSkill[] = useMemo(() => {
    if (selectedCategory === 'all') {
      return skillCategories.flatMap((cat) => cat.skills);
    }
    const category = skillCategories.find((cat) => cat.id === selectedCategory);
    return category ? category.skills : [];
  }, [selectedCategory, skillCategories]);

  return (
    <div className="min-h-screen relative theme-transition">
      <SkillsSEO />
      <div
        className="container mx-auto px-4"
        style={{
          paddingTop: isMobile ? '120px' : isTablet ? '140px' : '160px',
          paddingBottom: '80px',
        }}
      >
        {/* 页面标题 */}
        <SimpleMotion
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            {t('skills.title') as string}
          </h1>
          <p className="text-lg text-secondary-dark theme-transition max-w-2xl mx-auto">
            {t('skills.description') as string}
          </p>
        </SimpleMotion>

        {/* 视图切换和分类筛选 */}
        <SkillControls
          viewMode={viewMode}
          setViewMode={setViewMode}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          skillCategories={skillCategories}
        />

        {/* 内容区域 */}
        <SimpleMotion
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSkills.map((skill, index) => (
                <SkillCard
                  key={skill.name}
                  skill={skill}
                  index={index}
                  getSkillLevelColor={getSkillLevelColor}
                  getSkillLevelText={(level) => getSkillLevelText(level, t)}
                />
              ))}
            </div>
          )}

          {viewMode === 'radar' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-primary-dark theme-transition mb-6 text-center">
                {t('skills.radarChart') as string}
              </h3>
              <ChartContainer delay={300} className="h-96">
                <LazyRadarChartComponent
                  data={radarData as unknown as Record<string, unknown>[]}
                  name={t('skills.skillLevel') as string}
                />
              </ChartContainer>
            </div>
          )}

          {viewMode === 'chart' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-primary-dark theme-transition mb-6 text-center">
                {t('skills.proficiencyStats') as string}
              </h3>
              <ChartContainer delay={300} className="h-96">
                <LazyBarChartComponent
                  data={filteredSkills as unknown as Record<string, unknown>[]}
                />
              </ChartContainer>
            </div>
          )}
        </SimpleMotion>

        {/* 技能统计概览卡片 */}
        <SkillOverviewCards skillCategories={skillCategories} />
      </div>
    </div>
  );
}

export default memo(Skills);
