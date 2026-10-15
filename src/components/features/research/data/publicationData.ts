import type { AcademicPublication } from '../../../../types';

export type TranslationFn = (
  key: string,
  options?: { returnObjects?: boolean; fallback?: string }
) => unknown;

/**
 * 获取翻译后的论文成果数据 (严格保留DOI引用以满足系统完整性与学术引用规范)
 */
export const getPublications = (t: TranslationFn): AcademicPublication[] => {
  const getAuthors = (key: string): string[] => {
    const authors = t(key, { returnObjects: true });
    if (Array.isArray(authors)) {
      return authors.filter((author): author is string => typeof author === 'string');
    }
    return [];
  };

  return [
    {
      id: '1',
      title: t('publications.damformer.title') as string,
      journal: t('publications.damformer.journal') as string,
      year: 2025,
      status: 'published',
      authors: getAuthors('publications.damformer.authors'),
      description: t('publications.damformer.description') as string,
      doi: '10.1063/5.0245680',
      type: 'journal',
    },
    {
      id: '2',
      title: t('publications.rsModCubes.title') as string,
      journal: t('publications.rsModCubes.journal') as string,
      year: 2025,
      status: 'published',
      authors: getAuthors('publications.rsModCubes.authors'),
      description: t('publications.rsModCubes.description') as string,
      doi: '10.1109/LRA.2025.3543139',
      type: 'journal',
    },
    {
      id: '3',
      title: t('publications.whiskerSensorArray.title') as string,
      journal: t('publications.whiskerSensorArray.journal') as string,
      year: 2025,
      status: 'published',
      authors: getAuthors('publications.whiskerSensorArray.authors'),
      description: t('publications.whiskerSensorArray.description') as string,
      doi: '10.1002/admt.202401053',
      type: 'journal',
    },
    {
      id: '4',
      title: t('publications.whiskerSensor.title') as string,
      journal: t('publications.whiskerSensor.journal') as string,
      year: 2024,
      status: 'published',
      authors: getAuthors('publications.whiskerSensor.authors'),
      description: t('publications.whiskerSensor.description') as string,
      doi: '10.1016/j.nanoen.2024.110011',
      type: 'journal',
    },
  ];
};
