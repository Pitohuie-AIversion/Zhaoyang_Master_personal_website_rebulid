import type { SearchResult } from '../../types';

export const SEARCH_CONTENT: SearchResult[] = [
  {
    id: 'pub-damformer',
    title: 'Generalizing morphologies in dam break simulations using transformer model',
    description: 'DamFormer applies a Transformer neural operator to cross-geometry dam-break flow prediction.',
    type: 'publication',
    url: '/research',
    relevance: 0.95,
    metadata: {
      year: 2025,
      authors: ['Zhaoyang Mu', 'Aoming Liang', 'Mingming Ge', 'Dashuai Chen', 'Dixia Fan', 'Minyi Xu'],
      journal: 'Physics of Fluids',
      doi: '10.1063/5.0245680',
      tags: ['Transformer', 'CFD', 'dam break', '论文', '溃坝']
    }
  },
  {
    id: 'pub-rs-modcubes',
    title: 'Rs-ModCubes: Self-reconfigurable, scalable, modular cubic robots for underwater operations',
    description: 'Self-reconfigurable modular cubic robots designed for scalable underwater operations.',
    type: 'publication',
    url: '/research',
    relevance: 0.92,
    metadata: {
      year: 2025,
      authors: ['Jiaxi Zheng', 'Guangmin Dai', 'Botao He', 'Zhaoyang Mu', 'Zhaochen Meng', 'Tianyi Zhang', 'Weiming Zhi', 'Dixia Fan'],
      journal: 'IEEE Robotics and Automation Letters',
      doi: '10.1109/LRA.2025.3543139',
      tags: ['modular robot', 'underwater', 'self-reconfiguration', '论文', '水下机器人']
    }
  },
  {
    id: 'patent-underwater-navigation',
    title: 'Dynamic Environment Perception and Navigation Device and Method for an Underwater Robot',
    description: 'Multi-source sensing, path planning, and dynamic obstacle avoidance for underwater navigation.',
    type: 'patent',
    url: '/research',
    relevance: 0.9,
    metadata: {
      patentNumber: 'CN119509546A',
      organization: 'Westlake University',
      tags: ['patent', 'underwater navigation', '专利', '水下机器人', '西湖大学']
    }
  },
  {
    id: 'award-internet-plus',
    title: 'Gold Award in the 8th China International “Internet+” College Students Innovation and Entrepreneurship Competition',
    description: 'Gold award for the Kunpeng Technology underwater hull inspection robot project.',
    type: 'award',
    url: '/research',
    relevance: 0.86,
    metadata: {
      organization: 'Ministry of Education',
      level: 'national',
      tags: ['award', 'robotics', '金奖', '互联网+', '水下机器人']
    }
  },
  {
    id: 'project-damformer',
    title: 'DamFormer: Transformer-based Dam-break Flow Prediction',
    description: 'Scientific-computing project for high-accuracy, cross-geometry flow prediction.',
    type: 'project',
    url: '/projects',
    relevance: 0.9,
    metadata: {
      year: 2024,
      tags: ['PyTorch', 'Transformer', 'CFD', '科学计算', '溃坝']
    }
  },
  {
    id: 'project-sparse-to-dense',
    title: 'Sparse-to-Dense Flow Field Reconstruction',
    description: 'Transformer neural operator for reconstructing dense flow fields from sparse sensor data.',
    type: 'project',
    url: '/projects',
    relevance: 0.88,
    metadata: {
      year: 2024,
      tags: ['PyTorch', 'neural operator', 'flow field', '科学计算', '流场重构']
    }
  },
  {
    id: 'skill-python',
    title: 'Python and scientific computing',
    description: 'Python development for machine learning, numerical simulation, and scientific computing.',
    type: 'skill',
    url: '/skills',
    relevance: 0.82,
    metadata: { tags: ['Python', 'PyTorch', 'machine learning', '技能', '科学计算'] }
  },
  {
    id: 'page-home',
    title: 'Home / 首页',
    description: 'Zhaoyang Mu personal academic website and research overview.',
    type: 'page',
    url: '/',
    relevance: 0.75,
    metadata: { tags: ['home', '首页', '牟昭阳'] }
  },
  {
    id: 'page-publications',
    title: 'Publications / 论文',
    description: 'Peer-reviewed publications and academic output.',
    type: 'page',
    url: '/publications',
    relevance: 0.8,
    metadata: { tags: ['papers', 'publications', '论文', '学术成果'] }
  },
  {
    id: 'page-contact',
    title: 'Contact / 联系',
    description: 'Contact information and collaboration enquiries.',
    type: 'page',
    url: '/contact',
    relevance: 0.72,
    metadata: { tags: ['contact', 'email', '联系', '合作'] }
  }
];
