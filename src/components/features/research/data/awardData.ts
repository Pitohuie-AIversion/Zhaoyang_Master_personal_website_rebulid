import type { AcademicAward } from '../../../../types';
import type { TranslationFn } from './publicationData';

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
    certificateNumber: '202310033',
  },
  {
    id: '2',
    title: t('research.awards.roboticsCompetition.title') as string,
    organization: t('research.awards.roboticsCompetition.organization') as string,
    date: '2022-04',
    level: 'national',
    description: t('research.awards.roboticsCompetition.description') as string,
    certificateNumber: 'Y2109R025A0001',
  },
  {
    id: '3',
    title: t('research.awards.mechanicalInnovation.title') as string,
    organization: t('research.awards.mechanicalInnovation.organization') as string,
    date: '2024-07',
    level: 'national',
    description: t('research.awards.mechanicalInnovation.description') as string,
    certificateNumber: 'MEICC05MNSI2024-CV1-006',
  },
  {
    id: '4',
    title: t('research.awards.provincialMechanical.title') as string,
    organization: t('research.awards.provincialMechanical.organization') as string,
    date: '2024-04',
    level: 'provincial',
    description: t('research.awards.provincialMechanical.description') as string,
  },
];
