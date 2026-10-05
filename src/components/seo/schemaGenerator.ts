export const SITE_ORIGIN = 'https://www.zhaoyangmu.cloud';

export interface SchemaGeneratorParams {
  defaultSiteName: string;
  defaultDescription: string;
  defaultLocale: string;
  type?: 'website' | 'article' | 'profile';
  defaultTitle: string;
  defaultAuthor: string;
  publishedTime?: string;
  modifiedTime?: string;
  image: string;
  currentUrl: string;
  defaultKeywords: string[];
  section?: string;
  breadcrumbs?: { name: string; url: string }[];
  jobTitle?: string;
  dlmuName?: string;
  westlakeName?: string;
}

export const generateSchemaData = (params: SchemaGeneratorParams): Record<string, unknown>[] => {
  const {
    defaultSiteName,
    defaultDescription,
    defaultLocale,
    type = 'website',
    defaultTitle,
    defaultAuthor,
    publishedTime,
    modifiedTime,
    image,
    currentUrl,
    defaultKeywords,
    section,
    breadcrumbs = [],
    jobTitle,
    dlmuName,
    westlakeName
  } = params;

  const schemas: Record<string, unknown>[] = [];

  // 基础网站结构化数据
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: defaultSiteName,
    url: SITE_ORIGIN,
    description: defaultDescription,
    publisher: {
      '@type': 'Organization',
      name: defaultSiteName,
      url: SITE_ORIGIN
    },
    inLanguage: defaultLocale
  });

  // 页面特定结构化数据
  if (type === 'article') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: defaultTitle,
      description: defaultDescription,
      author: {
        '@type': 'Person',
        name: defaultAuthor
      },
      datePublished: publishedTime,
      dateModified: modifiedTime || publishedTime,
      image: image,
      url: currentUrl,
      publisher: {
        '@type': 'Organization',
        name: defaultSiteName,
        url: SITE_ORIGIN
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': currentUrl
      },
      keywords: defaultKeywords.join(', '),
      articleSection: section,
      wordCount: 500
    });
  }

  // 个人资料结构化数据
  if (type === 'profile') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: defaultAuthor,
      jobTitle: jobTitle || 'Master Researcher & Robotics Engineer',
      url: currentUrl,
      image: image,
      sameAs: [
        'https://scholar.google.com/citations?user=T3AV5RgAAAAJ',
        'https://github.com/Pitohuie',
        'https://www.linkedin.com/in/zhaoyang-mou/'
      ],
      alumniOf: {
        '@type': 'Organization',
        name: dlmuName || 'Dalian Maritime University'
      },
      worksFor: {
        '@type': 'Organization',
        name: westlakeName || 'Westlake University'
      },
      knowsAbout: defaultKeywords
    });
  }

  // 面包屑导航结构化数据
  if (breadcrumbs.length > 0) {
    const breadcrumbItems = breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url
    }));

    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbItems
    });
  }

  return schemas;
};
