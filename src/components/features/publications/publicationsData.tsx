/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import { BookOpen, FileText, Award } from 'lucide-react';
import type { PublicationItem } from '../../../types';

export type TranslationFn = (key: string, options?: { returnObjects?: boolean; fallback?: string }) => unknown;

export const PUBLICATION_TYPES = ['全部', 'journal', 'conference', 'patent'] as const;

/**
 * 完整学术成果列表 (保留DOI与完整学术引用信息，保证系统测试与引用完整性)
 */
export const getPublicationsList = (t: TranslationFn): PublicationItem[] => [
  {
    id: 1,
    title: t('publications.data.nanoEnergy2024.title') as string,
    authors: t('publications.data.nanoEnergy2024.authors') as string,
    journal: t('publications.data.nanoEnergy2024.journal') as string,
    year: '2024',
    type: 'journal',
    status: 'published',
    abstract: t('publications.data.nanoEnergy2024.abstract') as string,
    keywords:
      (t('publications.data.nanoEnergy2024.keywords', {
        returnObjects: true,
      }) as unknown as string[]) || [],
    doi: '10.1016/j.nanoen.2024.110011',
    url: t('publications.data.nanoEnergy2024.url') as string,
  },
  {
    id: 2,
    title: t('publications.data.amtTWSA2025.title') as string,
    authors: t('publications.data.amtTWSA2025.authors') as string,
    journal: t('publications.data.amtTWSA2025.journal') as string,
    year: '2025',
    type: 'journal',
    status: 'published',
    abstract: t('publications.data.amtTWSA2025.abstract') as string,
    keywords:
      (t('publications.data.amtTWSA2025.keywords', {
        returnObjects: true,
      }) as unknown as string[]) || [],
    doi: '10.1002/admt.202401053',
    url: t('publications.data.amtTWSA2025.url') as string,
  },
  {
    id: 3,
    title: t('publications.data.pofDamFormer2025.title') as string,
    authors: t('publications.data.pofDamFormer2025.authors') as string,
    journal: t('publications.data.pofDamFormer2025.journal') as string,
    year: '2025',
    type: 'journal',
    status: 'published',
    abstract: t('publications.data.pofDamFormer2025.abstract') as string,
    keywords:
      (t('publications.data.pofDamFormer2025.keywords', {
        returnObjects: true,
      }) as unknown as string[]) || [],
    doi: '10.1063/5.0245680',
    url: t('publications.data.pofDamFormer2025.url') as string,
  },
  {
    id: 4,
    title: t('publications.data.ieeeCAC2024.title') as string,
    authors: t('publications.data.ieeeCAC2024.authors') as string,
    journal: t('publications.data.ieeeCAC2024.journal') as string,
    year: '2024',
    type: 'conference',
    status: 'published',
    abstract: t('publications.data.ieeeCAC2024.abstract') as string,
    keywords:
      (t('publications.data.ieeeCAC2024.keywords', {
        returnObjects: true,
      }) as unknown as string[]) || [],
    url: t('publications.data.ieeeCAC2024.url') as string,
  },
  {
    id: 5,
    title: t('publications.data.ralRsModCubes2025.title') as string,
    authors: t('publications.data.ralRsModCubes2025.authors') as string,
    journal: t('publications.data.ralRsModCubes2025.journal') as string,
    year: '2025',
    type: 'journal',
    status: 'published',
    abstract: t('publications.data.ralRsModCubes2025.abstract') as string,
    keywords:
      (t('publications.data.ralRsModCubes2025.keywords', {
        returnObjects: true,
      }) as unknown as string[]) || [],
    doi: '10.1109/LRA.2025.3543139',
    url: t('publications.data.ralRsModCubes2025.url') as string,
  },
  {
    id: 6,
    title: t('publications.data.spieCITA2025.title') as string,
    authors: t('publications.data.spieCITA2025.authors') as string,
    journal: t('publications.data.spieCITA2025.journal') as string,
    year: '2025',
    type: 'conference',
    status: 'published',
    abstract: t('publications.data.spieCITA2025.abstract') as string,
    keywords:
      (t('publications.data.spieCITA2025.keywords', {
        returnObjects: true,
      }) as unknown as string[]) || [],
    doi: '10.1117/12.3056794',
    url: t('publications.data.spieCITA2025.url') as string,
  },
  {
    id: 7,
    title: t('publications.data.amtTBLS2025.title') as string,
    authors: t('publications.data.amtTBLS2025.authors') as string,
    journal: t('publications.data.amtTBLS2025.journal') as string,
    year: '2025',
    type: 'journal',
    status: 'published',
    abstract: t('publications.data.amtTBLS2025.abstract') as string,
    keywords:
      (t('publications.data.amtTBLS2025.keywords', {
        returnObjects: true,
      }) as unknown as string[]) || [],
    doi: '10.1002/admt.202500072',
    url: t('publications.data.amtTBLS2025.url') as string,
  },
];

/**
 * 论文类型图标映射
 */
export const getTypeIcon = (type: string): React.ReactElement => {
  switch (type) {
    case 'journal':
      return <BookOpen className="w-5 h-5" />;
    case 'conference':
      return <FileText className="w-5 h-5" />;
    case 'patent':
      return <Award className="w-5 h-5" />;
    default:
      return <FileText className="w-5 h-5" />;
  }
};

/**
 * 论文发布状态配色方案
 */
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'published':
      return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300';
    case 'under_review':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300';
    case 'in_preparation':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

/**
 * 论文发布状态文本翻译映射
 */
export const getStatusText = (status: string, t: TranslationFn): string => {
  switch (status) {
    case 'published':
      return t('publications.status.published') as string;
    case 'under_review':
      return t('publications.status.underReview') as string;
    case 'in_preparation':
      return t('publications.status.inPreparation') as string;
    default:
      return status;
  }
};
