import React, { useState, memo } from 'react';
import { useTranslation } from '../components/TranslationProvider';
import { SimpleMotion } from '../components/SimpleMotion';
import { UnifiedButton, ButtonGroup } from '../components/UnifiedButton';
import { 
  Code, 
  BarChart3, 
  Zap,
  Cpu,
  Brain,
  Wrench,
  Settings,
  Star,
  Layers
} from 'lucide-react';
import { LazyRadarChartComponent, LazyBarChartComponent, ChartContainer } from '../components/LazyCharts';
import { useResponsive } from '../hooks/useResponsive';

// 技能数据接口
interface Skill {
  name: string;
  level: number;
  category: string;
  description: string;
  projects?: string[];
  icon?: React.ReactNode;
}

interface SkillCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  skills: Skill[];
}

// 雷达图数据接口
interface RadarData {
  subject: string;
  A: number;
  fullMark: 100;
}

function Skills() {
  const { t } = useTranslation();
  const { isMobile, isTablet } = useResponsive();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'radar' | 'chart'>('grid');

  // 技能数据
  const skillCategories: SkillCategory[] = [
    {
      id: 'programming',
      name: t('skills.categories.programming') as string,
      icon: <Code className="w-5 h-5" />,
      color: 'blue',
      skills: [
        {
          name: 'Python',
          level: 95,
          category: 'programming',
          description: t('skills.skillData.programming.python.description') as string,
          projects: t('skills.skillData.programming.python.projects', { returnObjects: true }) as unknown as string[]
        },
        {
          name: 'Java',
          level: 85,
          category: 'programming',
          description: t('skills.skillData.programming.java.description') as string,
          projects: t('skills.skillData.programming.java.projects', { returnObjects: true }) as unknown as string[]
        },
        {
          name: 'MATLAB',
          level: 80,
          category: 'programming',
          description: t('skills.skillData.programming.matlab.description') as string,
          projects: t('skills.skillData.programming.matlab.projects', { returnObjects: true }) as unknown as string[]
        },
        {
          name: 'JavaScript/TypeScript',
          level: 80,
          category: 'programming',
          description: t('skills.skillData.programming.javascript.description') as string,
          projects: t('skills.skillData.programming.javascript.projects', { returnObjects: true }) as unknown as string[]
        },
        {
          name: 'PowerShell',
          level: 75,
          category: 'programming',
          description: t('skills.skillData.programming.powershell.description') as string,
          projects: t('skills.skillData.programming.powershell.projects', { returnObjects: true }) as unknown as string[]
        }
      ]
    },
    {
      id: 'simulation',
      name: t('skills.categories.simulation') as string,
      icon: <Cpu className="w-5 h-5" />,
      color: 'green',
      skills: [
        {
          name: 'Star-CCM+',
          level: 90,
          category: 'simulation',
          description: t('skills.skillData.simulation.starccm.description') as string,
          projects: t('skills.skillData.simulation.starccm.projects', { returnObjects: true }) as unknown as string[]
        },
        {
          name: 'COMSOL',
          level: 85,
          category: 'simulation',
          description: t('skills.skillData.simulation.comsol.description') as string,
          projects: t('skills.skillData.simulation.comsol.projects', { returnObjects: true }) as unknown as string[]
        },
        {
          name: 'ANSYS',
          level: 80,
          category: 'simulation',
          description: t('skills.skillData.simulation.ansys.description') as string,
          projects: t('skills.skillData.simulation.ansys.projects', { returnObjects: true }) as unknown as string[]
        },
        {
          name: 'PDEBench',
          level: 75,
          category: 'simulation',
          description: t('skills.skillData.simulation.pdebench.description') as string,
          projects: t('skills.skillData.simulation.pdebench.projects', { returnObjects: true }) as unknown as string[]
        }
      ]
    },
    {
      id: 'ai_ml',
      name: t('skills.categories.aiMl') as string,
      icon: <Brain className="w-5 h-5" />,
      color: 'purple',
      skills: [
        {
          name: 'Transformer',
          level: 90,
          category: 'ai_ml',
          description: t('skills.skillData.aiMl.transformer.description') as string,
          projects: t('skills.skillData.aiMl.transformer.projects', { returnObjects: true }) as unknown as string[]
        },
        {
          name: 'Neural Operator',
          level: 85,
          category: 'ai_ml',
          description: t('skills.skillData.aiMl.neuralOperator.description') as string,
          projects: t('skills.skillData.aiMl.neuralOperator.projects', { returnObjects: true }) as unknown as string[]
        },
        {
          name: 'PyTorch',
          level: 90,
          category: 'ai_ml',
          description: t('skills.skillData.aiMl.pytorch.description') as string,
          projects: t('skills.skillData.aiMl.pytorch.projects', { returnObjects: true }) as unknown as string[]
        },
        {
          name: t('skills.skillData.aiMl.reinforcementLearning.name') as string,
          level: 80,
          category: 'ai_ml',
          description: t('skills.skillData.aiMl.reinforcementLearning.description') as string,
          projects: t('skills.skillData.aiMl.reinforcementLearning.projects', { returnObjects: true }) as unknown as string[]
        },
        {
          name: t('skills.skillData.aiMl.computerVision.name') as string,
          level: 75,
          category: 'ai_ml',
          description: t('skills.skillData.aiMl.computerVision.description') as string,
          projects: t('skills.skillData.aiMl.computerVision.projects', { returnObjects: true }) as unknown as string[]
        }
      ]
    },
    {
      id: 'hardware',
      name: t('skills.categories.hardware') as string,
      icon: <Wrench className="w-5 h-5" />,
      color: 'orange',
      skills: [
        {
          name: 'SolidWorks',
          level: 90,
          category: 'hardware',
          description: t('skills.skillData.hardware.solidworks.description') as string,
          projects: t('skills.skillData.hardware.solidworks.projects', { returnObjects: true }) as unknown as string[]
        },
        {
          name: 'Shapr3D',
          level: 85,
          category: 'hardware',
          description: t('skills.skillData.hardware.shapr3d.description') as string,
          projects: t('skills.skillData.hardware.shapr3d.projects', { returnObjects: true }) as unknown as string[]
        },
        {
          name: 'STM32',
          level: 80,
          category: 'hardware',
          description: t('skills.skillData.hardware.stm32.description') as string,
          projects: t('skills.skillData.hardware.stm32.projects', { returnObjects: true }) as unknown as string[]
        },
        {
          name: t('skills.skillData.hardware.tplink.name') as string,
          level: 75,
          category: 'hardware',
          description: t('skills.skillData.hardware.tplink.description') as string,
          projects: t('skills.skillData.hardware.tplink.projects', { returnObjects: true }) as unknown as string[]
        }
      ]
    },
    {
      id: 'tools',
      name: t('skills.categories.tools') as string,
      icon: <Settings className="w-5 h-5" />,
      color: 'gray',
      skills: [
        {
          name: 'Git/GitHub',
          level: 90,
          category: 'tools',
          description: t('skills.skillData.tools.git.description') as string,
          projects: t('skills.skillData.tools.git.projects', { returnObjects: true }) as unknown as string[]
        },
        {
          name: 'Docker',
          level: 80,
          category: 'tools',
          description: t('skills.skillData.tools.docker.description') as string,
          projects: t('skills.skillData.tools.docker.projects', { returnObjects: true }) as unknown as string[]
        },
        {
          name: 'Linux',
          level: 85,
          category: 'tools',
          description: t('skills.skillData.tools.linux.description') as string,
          projects: t('skills.skillData.tools.linux.projects', { returnObjects: true }) as unknown as string[]
        },
        {
          name: 'VS Code',
          level: 95,
          category: 'tools',
          description: t('skills.skillData.tools.vscode.description') as string,
          projects: t('skills.skillData.tools.vscode.projects', { returnObjects: true }) as unknown as string[]
        },
        {
          name: 'Jupyter',
          level: 90,
          category: 'tools',
          description: t('skills.skillData.tools.jupyter.description') as string,
          projects: t('skills.skillData.tools.jupyter.projects', { returnObjects: true }) as unknown as string[]
        }
      ]
    }
  ];

  // 雷达图数据
  const radarData: RadarData[] = [
    { subject: t('skills.categories.programming') as string, A: 85, fullMark: 100 },
    { subject: t('skills.categories.simulation') as string, A: 85, fullMark: 100 },
    { subject: t('skills.categories.aiMl') as string, A: 80, fullMark: 100 },
    { subject: t('skills.categories.hardware') as string, A: 80, fullMark: 100 },
    { subject: t('skills.categories.tools') as string, A: 90, fullMark: 100 },
    { subject: t('skills.radar.theory') as string, A: 85, fullMark: 100 }
  ];

  // 获取筛选后的技能
  const getFilteredSkills = () => {
    if (selectedCategory === 'all') {
      return skillCategories.flatMap(cat => cat.skills);
    }
    const category = skillCategories.find(cat => cat.id === selectedCategory);
    return category ? category.skills : [];
  };

  // 获取技能等级颜色
  const getSkillLevelColor = (level: number) => {
    if (level >= 90) return 'bg-green-500';
    if (level >= 80) return 'bg-blue-500';
    if (level >= 70) return 'bg-yellow-500';
    if (level >= 60) return 'bg-orange-500';
    return 'bg-red-500';
  };

  // 获取技能等级文本
  const getSkillLevelText = (level: number) => {
    if (level >= 90) return t('skills.levels.expert') as string;
    if (level >= 80) return t('skills.levels.proficient') as string;
    if (level >= 70) return t('skills.levels.good') as string;
    if (level >= 60) return t('skills.levels.average') as string;
    return t('skills.levels.beginner') as string;
  };

  return (
    <div className="min-h-screen relative theme-transition">
      <div className="container mx-auto px-4" style={{ paddingTop: isMobile ? '120px' : isTablet ? '140px' : '160px', paddingBottom: '80px' }}>
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

        {/* 内容区域 */}
        <SimpleMotion
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getFilteredSkills().map((skill, index) => (
                <SimpleMotion
                  key={skill.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-primary-dark theme-transition">
                      {skill.name}
                    </h3>
                    <span className={`px-2 py-1 rounded text-xs text-white ${getSkillLevelColor(skill.level)}`}>
                      {getSkillLevelText(skill.level)}
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">{t('skills.proficiency') as string}</span>
                      <span className="text-gray-800 dark:text-gray-200">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getSkillLevelColor(skill.level)}`}
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>

                  <p className="text-sm text-secondary-dark theme-transition mb-4">
                    {skill.description}
                  </p>

                  {skill.projects && skill.projects.length > 0 && (
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
                  data={radarData} 
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
                <LazyBarChartComponent data={getFilteredSkills()} />
              </ChartContainer>
            </div>
          )}
        </SimpleMotion>

        {/* 技能统计概览 */}
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
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-${category.color}-100 dark:bg-${category.color}-900 mb-4`}>
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
      </div>
    </div>
  );
}

export default memo(Skills);