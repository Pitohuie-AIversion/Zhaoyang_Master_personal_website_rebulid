import React from 'react';
import { StructuredDataSEO } from '../../seo/StructuredDataSEO';
import type { AcademicPublication, AcademicPatent, AcademicAward } from '../../../types';
import type { TranslationFn } from './researchData';

interface ResearchStructuredDataProps {
  t: TranslationFn;
  publications: AcademicPublication[];
  patents: AcademicPatent[];
  awards: AcademicAward[];
}

export const ResearchStructuredData: React.FC<ResearchStructuredDataProps> = ({
  t,
  publications,
  patents,
  awards,
}) => {
  return (
    <>
      {/* 学术主页结构化数据 */}
      <StructuredDataSEO
        type="article"
        data={{
          headline: t('research.title') as string,
          author: {
            '@type': 'Person',
            name: '牟昭阳',
            alternateName: 'Zhaoyang Mu',
          },
          publisher: {
            '@type': 'Organization',
            name: '牟昭阳个人学术网站',
          },
          datePublished: new Date().toISOString(),
          about: [
            t('research.keywords.scientificComputing') as string,
            t('research.keywords.roboticsResearch') as string,
            t('research.keywords.artificialIntelligence') as string,
            t('research.keywords.machineLearning') as string,
          ],
        }}
      />

      {/* 论文结构化数据 */}
      {publications.map((publication) => (
        <StructuredDataSEO
          key={`article-${publication.id}`}
          type="article"
          data={{
            headline: publication.title,
            author: publication.authors.map((author) => ({
              '@type': 'Person',
              name: author,
            })),
            publisher: {
              '@type': 'Organization',
              name: publication.journal,
            },
            datePublished: `${publication.year}-01-01`,
            doi: publication.doi,
            citationCount: 0,
            abstract: publication.description,
          }}
        />
      ))}

      {/* 专利结构化数据 */}
      {patents.map((patent) => (
        <StructuredDataSEO
          key={`patent-${patent.id}`}
          type="patent"
          data={{
            name: patent.title,
            patentNumber: patent.number,
            applicant: {
              '@type': 'Organization',
              name: patent.applicant,
            },
            filingDate: patent.applicationDate,
            abstract: patent.description,
            patentStatus: patent.status === 'granted' ? 'Granted' : 'Pending',
          }}
        />
      ))}

      {/* 奖项结构化数据 */}
      {awards.map((award) => (
        <StructuredDataSEO
          key={`award-${award.id}`}
          type="award"
          data={{
            name: award.title,
            provider: {
              '@type': 'Organization',
              name: award.organization,
            },
            datePublished: `${award.date}-01`,
            description: award.description,
            awardCategory:
              award.level === 'national'
                ? (t('research.awardLevels.national') as string)
                : award.level === 'provincial'
                ? (t('research.awardLevels.provincial') as string)
                : (t('research.awardLevels.university') as string),
          }}
        />
      ))}
    </>
  );
};
