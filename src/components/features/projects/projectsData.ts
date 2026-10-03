import { Project, CATEGORY_CODES } from '../../../types';

export { CATEGORY_CODES };

export type TranslationFn = (key: string, options?: { returnObjects?: boolean; fallback?: string }) => string;

/**
 * 项目展示核心数据列表
 */
export const getProjects = (t: TranslationFn): Project[] => [
  {
    id: 1,
    title: t('projects.damformer.title'),
    category: CATEGORY_CODES.SCIENTIFIC_COMPUTING,
    description: t('projects.damformer.description'),
    technologies: ['PyTorch', 'Transformer', 'CFD', 'Python', 'CUDA', 'Physics of Fluids'],
    image:
      'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=dam%20break%20simulation%20transformer%20neural%20network%20CFD%20flow%20field%20prediction%20scientific%20computing&image_size=landscape_4_3',
    status: 'completed',
    year: '2024',
    highlights: [
      t('projects.damformer.highlights.crossGeometric'),
      t('projects.damformer.highlights.published'),
      t('projects.damformer.highlights.architecture'),
      t('projects.damformer.highlights.dataset'),
    ],
    githubUrl: 'https://github.com/Pitohuie',
    demoUrl: 'https://pitohuie-aiversion.github.io/Sparse_to_Dense_Transformer/',
  },
  {
    id: 2,
    title: t('projects.sparseToDense.title'),
    category: CATEGORY_CODES.SCIENTIFIC_COMPUTING,
    description: t('projects.sparseToDense.description'),
    technologies: ['PyTorch', 'Transformer', 'Neural Operator', 'Python', 'CFD'],
    image:
      'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=sparse%20to%20dense%20field%20reconstruction%20transformer%20neural%20operator%20scientific%20visualization&image_size=landscape_4_3',
    status: 'ongoing',
    year: '2024',
    highlights: [
      t('projects.sparseToDense.highlights.sparseReconstruction'),
      t('projects.sparseToDense.highlights.transformerBased'),
      t('projects.sparseToDense.highlights.highAccuracy'),
      t('projects.sparseToDense.highlights.realTimeProcessing'),
    ],
    githubUrl: 'https://github.com/Pitohuie',
    demoUrl: 'https://pitohuie-aiversion.github.io/Sparse_to_Dense_Transformer/',
  },
  {
    id: 3,
    title: t('projects.bionicRobot.title'),
    category: CATEGORY_CODES.ROBOTICS_TECHNOLOGY,
    description: t('projects.bionicRobot.description'),
    technologies: [
      t('common.technologies.bionics'),
      t('common.technologies.underwaterRobot'),
      t('common.technologies.sensorFusion'),
      t('common.technologies.realTimeControl'),
    ],
    image:
      'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=bionic%20robot%20underwater%20perception%20sensor%20fusion%20real%20time%20control&image_size=landscape_4_3',
    status: 'completed',
    year: '2023',
    highlights: [
      t('projects.bionicRobot.highlights.bionicPerception'),
      t('projects.bionicRobot.highlights.realTimeDetection'),
      t('projects.bionicRobot.highlights.sensorFusion'),
      t('projects.bionicRobot.highlights.complexEnvironment'),
    ],
    githubUrl: 'https://github.com/Pitohuie',
  },
  {
    id: 4,
    title: t('projects.fanWall.title'),
    category: CATEGORY_CODES.EXPERIMENTAL_PLATFORM,
    description: t('projects.fanWall.description'),
    technologies: [
      'STM32',
      'PWM/TACH',
      'VLAN',
      'DHCP',
      t('common.technologies.networkManagement'),
      t('common.technologies.closedLoopControl'),
    ],
    image:
      'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=fan%20array%20wind%20tunnel%20experimental%20platform%20flow%20control%20testing%20facility&image_size=landscape_4_3',
    status: 'ongoing',
    year: '2023',
    highlights: [
      t('projects.fanWall.highlights.modularArray'),
      t('projects.fanWall.highlights.stm32Control'),
      t('projects.fanWall.highlights.pwmTach'),
      t('projects.fanWall.highlights.vlanDhcp'),
    ],
    githubUrl: 'https://github.com/Pitohuie',
  },
  {
    id: 5,
    title: t('projects.marineBuoy.title'),
    category: CATEGORY_CODES.SIMULATION_ANALYSIS,
    description: t('projects.marineBuoy.description'),
    technologies: ['Star-CCM+', 'Java Macro', 'CFD', 'FSI', t('common.technologies.oceanEngineering')],
    image:
      'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=marine%20buoy%20CFD%20simulation%20fluid%20structure%20interaction%20ocean%20engineering&image_size=landscape_4_3',
    status: 'completed',
    year: '2022',
    highlights: [
      t('projects.marineBuoy.highlights.cfdSimulation'),
      t('projects.marineBuoy.highlights.fluidStructureInteraction'),
      t('projects.marineBuoy.highlights.javaMacro'),
      t('projects.marineBuoy.highlights.oceanEngineering'),
    ],
    githubUrl: 'https://github.com/Pitohuie',
  },
  {
    id: 6,
    title: t('projects.serverHpc.title'),
    category: CATEGORY_CODES.HIGH_PERFORMANCE_COMPUTING,
    description: t('projects.serverHpc.description'),
    technologies: ['PyTorch', 'DDP/AMP', 'SLURM', 'CUDA', 'NCCL', 'W&B', 'Linux'],
    image:
      'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=high%20performance%20computing%20server%20cluster%20distributed%20training%20CUDA%20GPU&image_size=landscape_4_3',
    status: 'ongoing',
    year: '2023',
    highlights: [
      t('projects.serverHpc.highlights.distributedTraining'),
      t('projects.serverHpc.highlights.slurmScheduling'),
      t('projects.serverHpc.highlights.cudaSetup'),
      t('projects.serverHpc.highlights.wandbLogging'),
    ],
    githubUrl: 'https://github.com/Pitohuie',
  },
];

export const getCategories = (t: TranslationFn) => [
  { value: 'all', label: t('projects.filters.all') },
  {
    value: CATEGORY_CODES.SCIENTIFIC_COMPUTING,
    label: t('projects.categories.scientificComputing'),
  },
  {
    value: CATEGORY_CODES.ROBOTICS_TECHNOLOGY,
    label: t('projects.categories.roboticsTechnology'),
  },
  {
    value: CATEGORY_CODES.SIMULATION_ANALYSIS,
    label: t('projects.categories.simulationAnalysis'),
  },
  {
    value: CATEGORY_CODES.EXPERIMENTAL_PLATFORM,
    label: t('projects.categories.experimentalPlatform'),
  },
  {
    value: CATEGORY_CODES.HIGH_PERFORMANCE_COMPUTING,
    label: t('projects.categories.highPerformanceComputing'),
  },
];

export const getYearOptions = (t: TranslationFn) => [t('projects.filters.all'), '2025', '2024', '2023', '2022'];

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'ongoing':
      return 'bg-blue-100 text-blue-800';
    case 'planned':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getStatusText = (status: string, t: TranslationFn) => {
  switch (status) {
    case 'completed':
      return t('projects.status.completed');
    case 'ongoing':
      return t('projects.status.ongoing');
    case 'planned':
      return t('projects.status.planned');
    default:
      return t('projects.status.unknown');
  }
};
