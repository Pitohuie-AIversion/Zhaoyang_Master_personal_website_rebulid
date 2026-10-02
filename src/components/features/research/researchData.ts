import type { AcademicPublication, AcademicPatent, AcademicAward } from '../../../types';

export type TranslationFn = (key: string, options?: { returnObjects?: boolean; fallback?: string }) => unknown;

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
      type: 'journal'
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
      type: 'journal'
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
      type: 'journal'
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
      type: 'journal'
    }
  ];
};

/**
 * 获取翻译后的学术专利列表
 */
export const getPatents = (t: TranslationFn): AcademicPatent[] => [
  {
    id: '1',
    title: t('research.patents.underwaterNavigation.title') as string,
    number: t('research.patents.underwaterNavigation.number') as string,
    applicant: t('research.patents.underwaterNavigation.applicant') as string,
    applicationDate: '2024-11-06',
    publicDate: '2025-02-25',
    priorityDate: '2024-11-06',
    status: 'published',
    type: 'invention',
    description: t('research.patents.underwaterNavigation.description') as string
  },
  {
    id: '2',
    title: t('research.patents.vectorThruster.title') as string,
    number: t('research.patents.vectorThruster.number') as string,
    applicant: t('research.patents.vectorThruster.applicant') as string,
    applicationDate: '2024-06-20',
    publicDate: '2024-11-06',
    priorityDate: '2024-06-20',
    status: 'published',
    type: 'invention',
    description: t('research.patents.vectorThruster.description') as string
  },
  {
    id: '3',
    title: t('research.patents.undulatingFin.title') as string,
    number: t('research.patents.undulatingFin.number') as string,
    applicant: t('research.patents.undulatingFin.applicant') as string,
    applicationDate: '2024-05-10',
    publicDate: '2024-11-06',
    priorityDate: '2024-05-10',
    status: 'published',
    type: 'invention',
    description: t('research.patents.undulatingFin.description') as string
  },
  {
    id: '4',
    title: t('research.patents.flexibleFin.title') as string,
    number: t('research.patents.flexibleFin.number') as string,
    applicant: t('research.patents.flexibleFin.applicant') as string,
    applicationDate: '2023-10-25',
    publicDate: '2024-04-23',
    priorityDate: '2023-10-25',
    status: 'published',
    type: 'invention',
    description: t('research.patents.flexibleFin.description') as string
  },
  {
    id: '5',
    title: t('research.patents.smartShip.title') as string,
    number: t('research.patents.smartShip.number') as string,
    applicant: t('research.patents.smartShip.applicant') as string,
    applicationDate: '2023-09-15',
    publicDate: '2024-03-14',
    priorityDate: '2023-09-15',
    status: 'published',
    type: 'invention',
    description: t('research.patents.smartShip.description') as string
  },
  {
    id: '6',
    title: t('research.patents.mobileBuoy.title') as string,
    number: t('research.patents.mobileBuoy.number') as string,
    applicant: t('research.patents.mobileBuoy.applicant') as string,
    applicationDate: '2022-08-30',
    publicDate: '2023-02-22',
    priorityDate: '2022-08-30',
    status: 'published',
    type: 'design',
    description: t('research.patents.mobileBuoy.description') as string
  }
];

/**
 * 获取翻译后的学术获奖列表
 */
export const getAwards = (t: TranslationFn): AcademicAward[] => [
  {
    id: '1',
    title: t('research.awards.internetPlusGold.title') as string,
    organization: t('research.awards.internetPlusGold.organization') as string,
    date: '2023-04',
    level: 'national',
    description: t('research.awards.internetPlusGold.description') as string,
    certificateNumber: '202310033'
  },
  {
    id: '2',
    title: t('research.awards.roboticsCompetition.title') as string,
    organization: t('research.awards.roboticsCompetition.organization') as string,
    date: '2022-04',
    level: 'national',
    description: t('research.awards.roboticsCompetition.description') as string,
    certificateNumber: 'Y2109R025A0001'
  },
  {
    id: '3',
    title: t('research.awards.mechanicalInnovation.title') as string,
    organization: t('research.awards.mechanicalInnovation.organization') as string,
    date: '2024-07',
    level: 'national',
    description: t('research.awards.mechanicalInnovation.description') as string,
    certificateNumber: 'MEICC05MNSI2024-CV1-006'
  },
  {
    id: '4',
    title: t('research.awards.provincialMechanical.title') as string,
    organization: t('research.awards.provincialMechanical.organization') as string,
    date: '2024-04',
    level: 'provincial',
    description: t('research.awards.provincialMechanical.description') as string
  }
];

/**
 * 成果发布/审查状态配色
 */
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'published':
    case 'granted':
      return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300';
    case 'accepted':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300';
    case 'under_review':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  }
};

/**
 * 荣誉奖项级别配色
 */
export const getLevelColor = (level: string): string => {
  switch (level) {
    case 'national':
      return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300';
    case 'provincial':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300';
    default:
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300';
  }
};
