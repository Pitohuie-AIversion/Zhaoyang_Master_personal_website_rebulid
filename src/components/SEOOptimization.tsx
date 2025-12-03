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
  robots?: string;
}

const SEOOptimization: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  image = '/favicon.svg',
  url = window.location.href,
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
  robots
}) => {
  const { t } = useTranslation();

  // 使用翻译键获取默认值
  const defaultTitle = title || (t('seo.default.title') as string);
  const defaultDescription = description || (t('seo.default.description') as string);
  
  // 安全获取关键词，确保始终是数组
  let defaultKeywords: string[];
  try {
    const translatedKeywords = t('seo.default.keywords', { returnObjects: true });
    if (Array.isArray(translatedKeywords)) {
      defaultKeywords = keywords || translatedKeywords;
    } else if (typeof translatedKeywords === 'string') {
      defaultKeywords = keywords || translatedKeywords.split(',').map(k => k.trim());
    } else {
      defaultKeywords = keywords || ['牟昭阳', 'Zhaoyang Mu', '计算机科学', '人工智能'];
    }
  } catch (error) {
    defaultKeywords = keywords || ['牟昭阳', 'Zhaoyang Mu', '计算机科学', '人工智能'];
  }
  
  const defaultAuthor = author || (t('seo.site.author') as string);
  const siteTitle = t('seo.site.title') as string;
  const language = t('seo.site.language') as string;
  const locale = t('seo.site.locale') as string;
  const jobTitle = t('seo.default.jobTitle') as string;
  const organization = t('seo.default.organization') as string;

  const fullTitle = defaultTitle === siteTitle ? defaultTitle : `${defaultTitle} | ${siteTitle}`;

  return (
    <Helmet>
      {/* 基本元数据 */}
      <title>{fullTitle}</title>
      <meta name="description" content={defaultDescription} />
      <meta name="keywords" content={Array.isArray(defaultKeywords) ? defaultKeywords.join(', ') : String(defaultKeywords || '')} />
      <meta name="author" content={defaultAuthor} />
      <meta name="robots" content={robots || 'index, follow'} />
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
      
      {/* 结构化数据（受 CSP 限制，默认禁用；可通过环境变量开启） */}
      {import.meta.env.VITE_ALLOW_INLINE_JSONLD === 'true' && (
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
      )}
      
      {/* 关键资源预连接（保留，不引用缺失本地字体） */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* 网站图标（使用已存在的 SVG） */}
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
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
      title={t('seo.pages.home.title') as string}
      description={t('seo.pages.home.description') as string}
      // 使用默认关键词，因为页面特定关键词不存在
      type="profile"
    />
  );
};

export const ResearchSEO: React.FC = () => {
  const { t } = useTranslation();
  return (
    <SEOOptimization
      title={t('seo.pages.research.title') as string}
      description={t('seo.pages.research.description') as string}
      // 使用默认关键词，因为页面特定关键词不存在
      type="website"
    />
  );
};

export const ProjectsSEO: React.FC = () => {
  const { t } = useTranslation();
  return (
    <SEOOptimization
      title={t('seo.pages.projects.title') as string}
      description={t('seo.pages.projects.description') as string}
      // 使用默认关键词，因为页面特定关键词不存在
      type="website"
    />
  );
};

export const PublicationsSEO: React.FC = () => {
  const { t } = useTranslation();
  return (
    <SEOOptimization
      title={t('seo.pages.publications.title') as string}
      description={t('seo.pages.publications.description') as string}
      // 使用默认关键词，因为页面特定关键词不存在
      type="website"
    />
  );
};

export const SkillsSEO: React.FC = () => {
  const { t } = useTranslation();
  return (
    <SEOOptimization
      title={t('seo.pages.skills.title') as string}
      description={t('seo.pages.skills.description') as string}
      // 使用默认关键词，因为页面特定关键词不存在
      type="website"
    />
  );
};

export const ContactSEO: React.FC = () => {
  const { t } = useTranslation();
  return (
    <SEOOptimization
      title={t('seo.pages.contact.title') as string}
      description={t('seo.pages.contact.description') as string}
      // 使用默认关键词，因为页面特定关键词不存在
      type="website"
    />
  );
};
