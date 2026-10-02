import React from 'react';
import { useTranslation } from '../common/TranslationProvider';
import { AdvancedSEO } from './AdvancedSEO';

export const HomeSEO: React.FC = () => {
  const { t } = useTranslation();

  return (
    <AdvancedSEO
      title={t('seo.pages.home.title') as string}
      description={t('seo.pages.home.description') as string}
      keywords={(t('seo.pages.home.keywords', { returnObjects: true }) as unknown) as string[]}
      type="profile"
      image="/favicon.svg"
      publishedTime="2024-01-01T00:00:00Z"
      modifiedTime={new Date().toISOString()}
      breadcrumbs={[
        { name: t('common.breadcrumb.home') as string, url: '/' }
      ]}
    />
  );
};

export const ResearchSEO: React.FC = () => {
  const { t } = useTranslation();

  return (
    <AdvancedSEO
      title={t('seo.pages.research.title') as string}
      description={t('seo.pages.research.description') as string}
      keywords={(t('seo.pages.research.keywords', { returnObjects: true }) as unknown) as string[]}
      type="article"
      image="/favicon.svg"
      section="research"
      tags={['scientific computing', 'robotics', 'CFD', 'transformer']}
      breadcrumbs={[
        { name: t('common.breadcrumb.home') as string, url: '/' },
        { name: t('common.breadcrumb.research') as string, url: '/research' }
      ]}
    />
  );
};

export const ProjectsSEO: React.FC = () => {
  const { t } = useTranslation();

  return (
    <AdvancedSEO
      title={t('seo.pages.projects.title') as string}
      description={t('seo.pages.projects.description') as string}
      keywords={(t('seo.pages.projects.keywords', { returnObjects: true }) as unknown) as string[]}
      type="article"
      image="/favicon.svg"
      section="projects"
      tags={['DamFormer', 'Sparse-Dense', 'biomimetic', 'underwater robotics']}
      breadcrumbs={[
        { name: t('common.breadcrumb.home') as string, url: '/' },
        { name: t('common.breadcrumb.projects') as string, url: '/projects' }
      ]}
    />
  );
};

export const PublicationsSEO: React.FC = () => {
  const { t } = useTranslation();

  return (
    <AdvancedSEO
      title={t('seo.pages.publications.title') as string}
      description={t('seo.pages.publications.description') as string}
      keywords={(t('seo.pages.publications.keywords', { returnObjects: true }) as unknown) as string[]}
      type="article"
      image="/favicon.svg"
      section="publications"
      tags={['Physics of Fluids', 'IEEE RA-L', 'patents', 'academic papers']}
      breadcrumbs={[
        { name: t('common.breadcrumb.home') as string, url: '/' },
        { name: t('common.breadcrumb.publications') as string, url: '/publications' }
      ]}
    />
  );
};

export const SkillsSEO: React.FC = () => {
  const { t } = useTranslation();

  return (
    <AdvancedSEO
      title={t('seo.pages.skills.title') as string}
      description={t('seo.pages.skills.description') as string}
      keywords={(t('seo.pages.skills.keywords', { returnObjects: true }) as unknown) as string[]}
      type="article"
      image="/favicon.svg"
      section="skills"
      tags={['Python', 'PyTorch', 'CFD', 'Star-CCM+', 'SolidWorks']}
      breadcrumbs={[
        { name: t('common.breadcrumb.home') as string, url: '/' },
        { name: t('common.breadcrumb.skills') as string, url: '/skills' }
      ]}
    />
  );
};

export const ContactSEO: React.FC = () => {
  const { t } = useTranslation();

  return (
    <AdvancedSEO
      title={t('seo.pages.contact.title') as string}
      description={t('seo.pages.contact.description') as string}
      keywords={(t('seo.pages.contact.keywords', { returnObjects: true }) as unknown) as string[]}
      type="website"
      image="/favicon.svg"
      breadcrumbs={[
        { name: t('common.breadcrumb.home') as string, url: '/' },
        { name: t('common.breadcrumb.contact') as string, url: '/contact' }
      ]}
    />
  );
};
