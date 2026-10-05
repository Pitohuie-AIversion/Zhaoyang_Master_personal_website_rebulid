import type { TimelineItem } from '../../common/Timeline';

export interface ResearchHighlight {
  id: string;
  title: string;
  description: string;
  visual: 'flow' | 'network' | 'robot';
  category: string;
  link: string;
}

export interface NewsItem {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'publication' | 'award' | 'conference' | 'project';
}

export type TranslationFn = (key: string, options?: { returnObjects?: boolean; fallback?: string }) => string;

export const getResearchHighlights = (t: TranslationFn): ResearchHighlight[] => [
  {
    id: '1',
    title: t('home.researchHighlights.items.damformer.title'),
    description: t('home.researchHighlights.items.damformer.description'),
    visual: 'flow',
    category: t('home.researchHighlights.items.damformer.category'),
    link: '/research'
  },
  {
    id: '2',
    title: t('home.researchHighlights.items.sparseDense.title'),
    description: t('home.researchHighlights.items.sparseDense.description'),
    visual: 'network',
    category: t('home.researchHighlights.items.sparseDense.category'),
    link: '/research'
  },
  {
    id: '3',
    title: t('home.researchHighlights.items.bionicFin.title'),
    description: t('home.researchHighlights.items.bionicFin.description'),
    visual: 'robot',
    category: t('home.researchHighlights.items.bionicFin.category'),
    link: '/research'
  }
];

export const getNewsItems = (t: TranslationFn): NewsItem[] => [
  {
    id: '1',
    date: '2025-01',
    title: t('home.latestNews.items.damformerPaper.title'),
    description: t('home.latestNews.items.damformerPaper.description'),
    type: 'publication'
  },
  {
    id: '2',
    date: '2025-01',
    title: t('home.latestNews.items.rsModCubes.title'),
    description: t('home.latestNews.items.rsModCubes.description'),
    type: 'publication'
  },
  {
    id: '3',
    date: '2024-07',
    title: t('home.latestNews.items.mechanicalCompetition.title'),
    description: t('home.latestNews.items.mechanicalCompetition.description'),
    type: 'award'
  },
  {
    id: '4',
    date: '2024-06',
    title: t('home.latestNews.items.westlakeVisit.title'),
    description: t('home.latestNews.items.westlakeVisit.description'),
    type: 'project'
  }
];

export const getTimelineItems = (t: TranslationFn): TimelineItem[] => [
  {
    id: 'damformer-2025',
    title: t('publications.data.pofDamFormer2025.title'),
    description: t('publications.data.pofDamFormer2025.authors'),
    date: '2025',
    type: 'publication',
    organization: t('publications.data.pofDamFormer2025.journal'),
    tags: ['Transformer', 'CFD', 'Neural Operator'],
    metadata: { url: t('publications.data.pofDamFormer2025.url') },
    isHighlighted: true
  },
  {
    id: 'rs-modcubes-2025',
    title: t('publications.data.ralRsModCubes2025.title'),
    description: t('publications.data.ralRsModCubes2025.authors'),
    date: '2025',
    type: 'publication',
    organization: t('publications.data.ralRsModCubes2025.journal'),
    tags: ['Modular Robots', 'Underwater', 'Reconfiguration'],
    metadata: { url: t('publications.data.ralRsModCubes2025.url') }
  },
  {
    id: 'twsa-2025',
    title: t('publications.data.amtTWSA2025.title'),
    description: t('publications.data.amtTWSA2025.authors'),
    date: '2025',
    type: 'publication',
    organization: t('publications.data.amtTWSA2025.journal'),
    tags: ['Triboelectric', 'Sensor Array', 'Underwater Vehicle'],
    metadata: { url: t('publications.data.amtTWSA2025.url') }
  },
  {
    id: 'auv-swarm-2025',
    title: t('publications.data.spieCITA2025.title'),
    description: t('publications.data.spieCITA2025.authors'),
    date: '2025',
    type: 'publication',
    organization: t('publications.data.spieCITA2025.journal'),
    tags: ['AUV', 'Swarm', 'Modular Design'],
    metadata: { url: t('publications.data.spieCITA2025.url') }
  },
  {
    id: 'nano-energy-2024',
    title: t('publications.data.nanoEnergy2024.title'),
    description: t('publications.data.nanoEnergy2024.authors'),
    date: '2024',
    type: 'publication',
    organization: t('publications.data.nanoEnergy2024.journal'),
    tags: ['Triboelectric', 'Underwater Whisker', 'Deep Learning'],
    metadata: { url: t('publications.data.nanoEnergy2024.url') }
  },
  {
    id: 'tail-fin-2024',
    title: t('publications.data.ieeeCAC2024.title'),
    description: t('publications.data.ieeeCAC2024.authors'),
    date: '2024',
    type: 'publication',
    organization: t('publications.data.ieeeCAC2024.journal'),
    tags: ['Triboelectric', 'Tail-Fin', 'Proprioception'],
    metadata: { url: t('publications.data.ieeeCAC2024.url') }
  }
];
