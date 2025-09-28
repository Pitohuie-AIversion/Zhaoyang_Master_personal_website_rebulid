import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from './TranslationProvider';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

const SEOOptimization: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  image = '/og-image.jpg',
  url = window.location.href,
  type = 'website',
  author,
  publishedTime,
  modifiedTime
}) => {
  const { t } = useTranslation();

  // 使用翻译键获取默认值
  const defaultTitle = title || t('seo.default.title');
  const defaultDescription = description || t('seo.default.description');
  const defaultKeywords = keywords || t('seo.default.keywords', { returnObjects: true }) as string[];
  const defaultAuthor = author || t('seo.site.author');
  const siteTitle = t('seo.site.title');
  const language = t('seo.site.language');
  const locale = t('seo.site.locale');
  const jobTitle = t('seo.default.jobTitle');
  const organization = t('seo.default.organization');

  const fullTitle = defaultTitle === siteTitle ? defaultTitle : `${defaultTitle} | ${siteTitle}`;

  return (
    <Helmet>
      {/* 基本元数据 */}
      <title>{fullTitle}</title>
      <meta name="description" content={defaultDescription} />
      <meta name="keywords" content={defaultKeywords.join(', ')} />
      <meta name="author" content={defaultAuthor} />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content={language} />
      
      {/* Open Graph 元数据 */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={defaultDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:locale" content={locale} />
      
      {/* Twitter Card 元数据 */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={defaultDescription} />
      <meta name="twitter:image" content={image} />
      
      {/* 文章特定元数据 */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && defaultAuthor && (
        <meta property="article:author" content={defaultAuthor} />
      )}
      
      {/* 结构化数据 */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": type === 'profile' ? 'Person' : 'WebSite',
          "name": defaultAuthor,
          "url": url,
          "description": defaultDescription,
          "image": image,
          ...(type === 'profile' && {
            "jobTitle": jobTitle,
            "worksFor": {
              "@type": "Organization",
              "name": organization
            },
            "knowsAbout": defaultKeywords
          })
        })}
      </script>
      
      {/* 预加载关键资源 */}
      <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* 网站图标 */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* 主题颜色 */}
      <meta name="theme-color" content="#ffffff" />
      <meta name="msapplication-TileColor" content="#ffffff" />
    </Helmet>
  );
};

export default SEOOptimization;

// 页面特定的SEO组件
export const HomeSEO: React.FC = () => {
  const { t } = useTranslation();
  return (
    <SEOOptimization
      title={t('seo.pages.home.title')}
      description={t('seo.pages.home.description')}
      keywords={t('seo.pages.home.keywords', { returnObjects: true }) as string[]}
      type="profile"
    />
  );
};

export const ResearchSEO: React.FC = () => {
  const { t } = useTranslation();
  return (
    <SEOOptimization
      title={t('seo.pages.research.title')}
      description={t('seo.pages.research.description')}
      keywords={t('seo.pages.research.keywords', { returnObjects: true }) as string[]}
      type="website"
    />
  );
};

export const ProjectsSEO: React.FC = () => {
  const { t } = useTranslation();
  return (
    <SEOOptimization
      title={t('seo.pages.projects.title')}
      description={t('seo.pages.projects.description')}
      keywords={t('seo.pages.projects.keywords', { returnObjects: true }) as string[]}
      type="website"
    />
  );
};

export const PublicationsSEO: React.FC = () => {
  const { t } = useTranslation();
  return (
    <SEOOptimization
      title={t('seo.pages.publications.title')}
      description={t('seo.pages.publications.description')}
      keywords={t('seo.pages.publications.keywords', { returnObjects: true }) as string[]}
      type="website"
    />
  );
};

export const SkillsSEO: React.FC = () => {
  const { t } = useTranslation();
  return (
    <SEOOptimization
      title={t('seo.pages.skills.title')}
      description={t('seo.pages.skills.description')}
      keywords={t('seo.pages.skills.keywords', { returnObjects: true }) as string[]}
      type="website"
    />
  );
};

export const ContactSEO: React.FC = () => {
  const { t } = useTranslation();
  return (
    <SEOOptimization
      title={t('seo.pages.contact.title')}
      description={t('seo.pages.contact.description')}
      keywords={t('seo.pages.contact.keywords', { returnObjects: true }) as string[]}
      type="website"
    />
  );
};