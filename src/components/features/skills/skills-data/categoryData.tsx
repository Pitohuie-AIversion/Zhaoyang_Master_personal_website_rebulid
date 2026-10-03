import React from 'react';
import { Code, Cpu, Brain, Wrench, Settings } from 'lucide-react';
import type { SkillCategory } from '../../../../types';
import type { TranslationFn } from './types';

/**
 * 获取分类专业技能矩阵
 */
export const getSkillCategories = (t: TranslationFn): SkillCategory[] => [
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
        projects: t('skills.skillData.programming.python.projects', {
          returnObjects: true,
        }) as unknown as string[],
      },
      {
        name: 'Java',
        level: 85,
        category: 'programming',
        description: t('skills.skillData.programming.java.description') as string,
        projects: t('skills.skillData.programming.java.projects', {
          returnObjects: true,
        }) as unknown as string[],
      },
      {
        name: 'MATLAB',
        level: 80,
        category: 'programming',
        description: t('skills.skillData.programming.matlab.description') as string,
        projects: t('skills.skillData.programming.matlab.projects', {
          returnObjects: true,
        }) as unknown as string[],
      },
      {
        name: 'JavaScript/TypeScript',
        level: 80,
        category: 'programming',
        description: t('skills.skillData.programming.javascript.description') as string,
        projects: t('skills.skillData.programming.javascript.projects', {
          returnObjects: true,
        }) as unknown as string[],
      },
      {
        name: 'PowerShell',
        level: 75,
        category: 'programming',
        description: t('skills.skillData.programming.powershell.description') as string,
        projects: t('skills.skillData.programming.powershell.projects', {
          returnObjects: true,
        }) as unknown as string[],
      },
    ],
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
        projects: t('skills.skillData.simulation.starccm.projects', {
          returnObjects: true,
        }) as unknown as string[],
      },
      {
        name: 'COMSOL',
        level: 85,
        category: 'simulation',
        description: t('skills.skillData.simulation.comsol.description') as string,
        projects: t('skills.skillData.simulation.comsol.projects', {
          returnObjects: true,
        }) as unknown as string[],
      },
      {
        name: 'ANSYS',
        level: 80,
        category: 'simulation',
        description: t('skills.skillData.simulation.ansys.description') as string,
        projects: t('skills.skillData.simulation.ansys.projects', {
          returnObjects: true,
        }) as unknown as string[],
      },
      {
        name: 'PDEBench',
        level: 75,
        category: 'simulation',
        description: t('skills.skillData.simulation.pdebench.description') as string,
        projects: t('skills.skillData.simulation.pdebench.projects', {
          returnObjects: true,
        }) as unknown as string[],
      },
    ],
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
        projects: t('skills.skillData.aiMl.transformer.projects', {
          returnObjects: true,
        }) as unknown as string[],
      },
      {
        name: 'Neural Operator',
        level: 85,
        category: 'ai_ml',
        description: t('skills.skillData.aiMl.neuralOperator.description') as string,
        projects: t('skills.skillData.aiMl.neuralOperator.projects', {
          returnObjects: true,
        }) as unknown as string[],
      },
      {
        name: 'PyTorch',
        level: 90,
        category: 'ai_ml',
        description: t('skills.skillData.aiMl.pytorch.description') as string,
        projects: t('skills.skillData.aiMl.pytorch.projects', {
          returnObjects: true,
        }) as unknown as string[],
      },
      {
        name: t('skills.skillData.aiMl.reinforcementLearning.name') as string,
        level: 80,
        category: 'ai_ml',
        description: t('skills.skillData.aiMl.reinforcementLearning.description') as string,
        projects: t('skills.skillData.aiMl.reinforcementLearning.projects', {
          returnObjects: true,
        }) as unknown as string[],
      },
      {
        name: t('skills.skillData.aiMl.computerVision.name') as string,
        level: 75,
        category: 'ai_ml',
        description: t('skills.skillData.aiMl.computerVision.description') as string,
        projects: t('skills.skillData.aiMl.computerVision.projects', {
          returnObjects: true,
        }) as unknown as string[],
      },
    ],
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
        projects: t('skills.skillData.hardware.solidworks.projects', {
          returnObjects: true,
        }) as unknown as string[],
      },
      {
        name: 'Shapr3D',
        level: 85,
        category: 'hardware',
        description: t('skills.skillData.hardware.shapr3d.description') as string,
        projects: t('skills.skillData.hardware.shapr3d.projects', {
          returnObjects: true,
        }) as unknown as string[],
      },
      {
        name: 'STM32',
        level: 80,
        category: 'hardware',
        description: t('skills.skillData.hardware.stm32.description') as string,
        projects: t('skills.skillData.hardware.stm32.projects', {
          returnObjects: true,
        }) as unknown as string[],
      },
      {
        name: t('skills.skillData.hardware.tplink.name') as string,
        level: 75,
        category: 'hardware',
        description: t('skills.skillData.hardware.tplink.description') as string,
        projects: t('skills.skillData.hardware.tplink.projects', {
          returnObjects: true,
        }) as unknown as string[],
      },
    ],
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
        projects: t('skills.skillData.tools.git.projects', {
          returnObjects: true,
        }) as unknown as string[],
      },
      {
        name: 'Docker',
        level: 80,
        category: 'tools',
        description: t('skills.skillData.tools.docker.description') as string,
        projects: t('skills.skillData.tools.docker.projects', {
          returnObjects: true,
        }) as unknown as string[],
      },
      {
        name: 'Linux',
        level: 85,
        category: 'tools',
        description: t('skills.skillData.tools.linux.description') as string,
        projects: t('skills.skillData.tools.linux.projects', {
          returnObjects: true,
        }) as unknown as string[],
      },
      {
        name: 'VS Code',
        level: 95,
        category: 'tools',
        description: t('skills.skillData.tools.vscode.description') as string,
        projects: t('skills.skillData.tools.vscode.projects', {
          returnObjects: true,
        }) as unknown as string[],
      },
      {
        name: 'Jupyter',
        level: 90,
        category: 'tools',
        description: t('skills.skillData.tools.jupyter.description') as string,
        projects: t('skills.skillData.tools.jupyter.projects', {
          returnObjects: true,
        }) as unknown as string[],
      },
    ],
  },
];
