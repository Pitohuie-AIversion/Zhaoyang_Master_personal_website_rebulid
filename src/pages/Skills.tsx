import React, { useState, memo } from 'react';
import { useTranslation } from '../components/TranslationProvider';
import { SimpleMotion } from '../components/SimpleMotion';
import { PageLoader, usePageLoading } from '../components/LoadingComponents';
import { ScrollReveal, HoverCard } from '../components/InteractiveEffects';
import { ResponsiveContainer } from '../components/ResponsiveEnhancements';
import { UnifiedButton, ButtonGroup } from '../components/UnifiedButton';
import { 
  Code, 
  Cpu, 
  Database, 
  Globe, 
  Layers, 
  Monitor, 
  Settings, 
  Zap,
  Brain,
  Wrench,
  BarChart3,
  Star
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
      name: t('skills.categories.programming'),
      icon: <Code className="w-5 h-5" />,
      color: 'blue',
      skills: [
        {
          name: 'Python',
          level: 95,
          category: 'programming',
          description: 'PyTorch/NumPy/Pandas/Matplotlib，深度学习与科学计算',
          projects: ['Transformer/神经算子建模', '深度强化学习算法', 'CFD时空场预测']
        },
        {
          name: 'Java',
          level: 85,
          category: 'programming',
          description: 'Star-CCM+ Macro/Workflow开发',
          projects: ['CFD自动化仿真', '仿生波动鳍推进仿真']
        },
        {
          name: 'MATLAB',
          level: 80,
          category: 'programming',
          description: '数值计算、信号处理、控制系统',
          projects: ['流体力学仿真', '控制算法设计']
        },
        {
          name: 'JavaScript/TypeScript',
          level: 80,
          category: 'programming',
          description: '前端开发、全栈应用',
          projects: ['个人网站', '数据可视化平台']
        },
        {
          name: 'PowerShell',
          level: 75,
          category: 'programming',
          description: '自动化脚本、系统管理',
          projects: ['自动刷写脚本', '系统配置管理']
        }
      ]
    },
    {
      id: 'simulation',
      name: t('skills.categories.simulation'),
      icon: <Cpu className="w-5 h-5" />,
      color: 'green',
      skills: [
        {
          name: 'Star-CCM+',
          level: 90,
          category: 'simulation',
          description: 'CFD/FSI仿真，Java Macro开发',
          projects: ['仿生波动鳍推进仿真', '流固耦合分析']
        },
        {
          name: 'COMSOL',
          level: 85,
          category: 'simulation',
          description: '多物理场耦合仿真',
          projects: ['流固耦合分析', '传热传质仿真', '校核验证']
        },
        {
          name: 'ANSYS',
          level: 80,
          category: 'simulation',
          description: '工程仿真分析',
          projects: ['结构分析', '流体仿真', '多物理场耦合']
        },
        {
          name: 'PDEBench',
          level: 75,
          category: 'simulation',
          description: '偏微分方程基准测试',
          projects: ['Neural Operator验证', 'PDE求解器对比']
        }
      ]
    },
    {
      id: 'ai_ml',
      name: t('skills.categories.aiMl'),
      icon: <Brain className="w-5 h-5" />,
      color: 'purple',
      skills: [
        {
          name: 'Transformer',
          level: 90,
          category: 'ai_ml',
          description: '注意力机制，时空序列建模',
          projects: ['CFD时空场预测', '序列到序列学习']
        },
        {
          name: 'Neural Operator',
          level: 85,
          category: 'ai_ml',
          description: 'FNO, DeepONet等算子学习',
          projects: ['PDE求解', '科学计算加速']
        },
        {
          name: 'PyTorch',
          level: 90,
          category: 'ai_ml',
          description: '深度学习框架',
          projects: ['神经网络训练', 'DDP/AMP并行计算']
        },
        {
          name: '强化学习',
          level: 80,
          category: 'ai_ml',
          description: 'DQN, PPO等算法',
          projects: ['仿生鱼控制策略', '机器人控制']
        },
        {
          name: '计算机视觉',
          level: 75,
          category: 'ai_ml',
          description: '仿生感知，图像处理',
          projects: ['水下机器人视觉', '仿生感知系统']
        }
      ]
    },
    {
      id: 'hardware',
      name: t('skills.categories.hardware'),
      icon: <Wrench className="w-5 h-5" />,
      color: 'orange',
      skills: [
        {
          name: 'SolidWorks',
          level: 90,
          category: 'hardware',
          description: '3D/2D设计、BOM、干涉检查',
          projects: ['仿生鱼机器人设计', '机械结构优化', '装配体设计']
        },
        {
          name: 'Shapr3D',
          level: 85,
          category: 'hardware',
          description: '移动端3D建模设计',
          projects: ['快速原型设计', '概念建模']
        },
        {
          name: 'STM32',
          level: 80,
          category: 'hardware',
          description: 'NUCLEO-F439ZI，PWM/TACH控制',
          projects: ['嵌入式控制系统', '传感器接口']
        },
        {
          name: 'TP-Link L3交换机',
          level: 75,
          category: 'hardware',
          description: '网管交换机配置管理',
          projects: ['网络架构设计', '设备管理']
        }
      ]
    },
    {
      id: 'tools',
      name: t('skills.categories.tools'),
      icon: <Settings className="w-5 h-5" />,
      color: 'gray',
      skills: [
        {
          name: 'Git/GitHub',
          level: 90,
          category: 'tools',
          description: '版本控制与协作',
          projects: ['所有项目代码管理']
        },
        {
          name: 'Docker',
          level: 80,
          category: 'tools',
          description: '容器化部署',
          projects: ['仿真环境部署', '微服务架构']
        },
        {
          name: 'Linux',
          level: 85,
          category: 'tools',
          description: '系统管理与脚本',
          projects: ['服务器运维', '自动化脚本']
        },
        {
          name: 'VS Code',
          level: 95,
          category: 'tools',
          description: '集成开发环境',
          projects: ['日常开发工具']
        },
        {
          name: 'Jupyter',
          level: 90,
          category: 'tools',
          description: '交互式开发',
          projects: ['数据分析', '算法原型']
        }
      ]
    }
  ];

  // 雷达图数据
  const radarData: RadarData[] = [
    { subject: t('skills.categories.programming'), A: 85, fullMark: 100 },
    { subject: t('skills.categories.simulation'), A: 85, fullMark: 100 },
    { subject: t('skills.categories.aiMl'), A: 80, fullMark: 100 },
    { subject: t('skills.categories.hardware'), A: 80, fullMark: 100 },
    { subject: t('skills.categories.tools'), A: 90, fullMark: 100 },
    { subject: t('skills.radar.theory'), A: 85, fullMark: 100 }
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
    if (level >= 90) return t('skills.levels.expert');
    if (level >= 80) return t('skills.levels.proficient');
    if (level >= 70) return t('skills.levels.good');
    if (level >= 60) return t('skills.levels.average');
    return t('skills.levels.beginner');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 theme-transition">
      <div className="container mx-auto px-4" style={{ paddingTop: isMobile ? '120px' : isTablet ? '140px' : '160px', paddingBottom: '80px' }}>
        {/* 页面标题 */}
        <SimpleMotion
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            {t('skills.title')}
          </h1>
          <p className="text-lg text-secondary-dark theme-transition max-w-2xl mx-auto">
            {t('skills.description')}
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
                {t('skills.viewModes.grid')}
              </UnifiedButton>
              <UnifiedButton
                variant={viewMode === 'radar' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('radar')}
                icon={Zap}
                iconPosition="left"
              >
                {t('skills.viewModes.radar')}
              </UnifiedButton>
              <UnifiedButton
                variant={viewMode === 'chart' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('chart')}
                icon={BarChart3}
                iconPosition="left"
              >
                {t('skills.viewModes.chart')}
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
              {t('skills.filters.all')}
            </UnifiedButton>
            {skillCategories.map((category) => (
              <UnifiedButton
                key={category.id}
                variant={selectedCategory === category.id ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
icon={category.icon as any}
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
                      <span className="text-gray-600 dark:text-gray-400">{t('skills.proficiency')}</span>
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
                        {t('skills.relatedProjects')}:
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
                {t('skills.radarChart')}
              </h3>
              <ChartContainer delay={300} className="h-96">
                <LazyRadarChartComponent 
                  data={radarData} 
                  name={t('skills.skillLevel')} 
                />
              </ChartContainer>
            </div>
          )}

          {viewMode === 'chart' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-primary-dark theme-transition mb-6 text-center">
                {t('skills.proficiencyStats')}
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
                  {t('skills.avgProficiency')}: {avgLevel}%
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {category.skills.length} {t('skills.skillsCount')}
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