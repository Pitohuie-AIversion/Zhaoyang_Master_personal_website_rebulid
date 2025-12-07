import React from 'react';
import { createTranslationFunction } from '../../utils/i18n';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from '../common/TranslationProvider';
import { useLocation } from 'react-router-dom';

interface AdvancedSEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  type?: 'website' | 'article' | 'profile';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  locale?: string;
  siteName?: string;
  noindex?: boolean;
  canonicalUrl?: string;
  alternates?: { hreflang: string; href: string }[];
  breadcrumbs?: { name: string; url: string }[];
}

// 高级SEO组件
export const AdvancedSEO: React.FC<AdvancedSEOProps> = ({
  title,
  description,
  keywords,
  image = '/favicon.svg',
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
  section,
  tags = [],
  locale,
  siteName,
  noindex = false,
  canonicalUrl,
  alternates = [],
  breadcrumbs = []
}) => {
  const { t, language } = useTranslation();
  const location = useLocation();

  // 使用翻译获取默认值
  const defaultTitle = title || (t('seo.default.title') as string);
  const defaultDescription = description || (t('seo.default.description') as string);
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
  const defaultLocale = locale || (language === 'zh' ? 'zh_CN' : 'en_US');
  const defaultSiteName = siteName || (t('seo.site.title') as string);
  const currentUrl = canonicalUrl || `${window.location.origin}${location.pathname}`;

  const fullTitle = defaultTitle === defaultSiteName ? defaultTitle : `${defaultTitle} | ${defaultSiteName}`;

  // 生成结构化数据
  const generateSchemaData = (): Record<string, unknown>[] => {
    const schemas: Record<string, unknown>[] = [];

    // 基础网站结构化数据
    schemas.push({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": defaultSiteName,
      "url": window.location.origin,
      "description": defaultDescription,
      "publisher": {
        "@type": "Organization",
        "name": defaultSiteName,
        "url": window.location.origin
      },
      "inLanguage": defaultLocale
    });

    // 页面特定结构化数据
    if (type === 'article') {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": defaultTitle,
        "description": defaultDescription,
        "author": {
          "@type": "Person",
          "name": defaultAuthor
        },
        "datePublished": publishedTime,
        "dateModified": modifiedTime || publishedTime,
        "image": image,
        "url": currentUrl,
        "publisher": {
          "@type": "Organization",
          "name": defaultSiteName,
          "url": window.location.origin
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": currentUrl
        },
        "keywords": defaultKeywords.join(', '),
        "articleSection": section,
        "wordCount": 500 // 可以根据实际内容动态计算
      });
    }

    // 个人资料结构化数据
    if (type === 'profile') {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "Person",
        "name": defaultAuthor,
        "jobTitle": t('seo.default.jobTitle'),
        "url": currentUrl,
        "image": image,
        "sameAs": [
          "https://scholar.google.com/citations?user=YOUR_ID",
          "https://github.com/YOUR_USERNAME",
          "https://linkedin.com/in/YOUR_USERNAME"
        ],
        "alumniOf": {
          "@type": "Organization",
          "name": t('seo.institutions.dlmu') as string
        },
        "worksFor": {
          "@type": "Organization",
          "name": t('seo.institutions.westlake') as string
        },
        "knowsAbout": defaultKeywords
      });
    }

    // 面包屑导航结构化数据
    if (breadcrumbs.length > 0) {
      const breadcrumbItems = breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": crumb.name,
        "item": crumb.url
      }));

      schemas.push({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbItems
      });
    }

    return schemas;
  };

  return (
    <Helmet>
      {/* 基础元数据 */}
      <title>{fullTitle}</title>
      <meta name="description" content={defaultDescription} />
      <meta name="keywords" content={defaultKeywords.join(', ')} />
      <meta name="author" content={defaultAuthor} />
      <meta name="robots" content={noindex ? 'noindex,nofollow' : 'index,follow'} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content={language} />
      
      {/* 规范链接 */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* 替代语言版本 */}
      {alternates.map((alt, index) => (
        <link key={index} rel="alternate" hrefLang={alt.hreflang} href={alt.href} />
      ))}
      
      {/* Open Graph 元数据 */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={defaultDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={defaultSiteName} />
      <meta property="og:locale" content={defaultLocale} />
      
      {/* 文章特定Open Graph */}
      {type === 'article' && (
        <>
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {author && <meta property="article:author" content={author} />}
          {section && <meta property="article:section" content={section} />}
          {tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Twitter Card 元数据 */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={defaultDescription} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@zhaoyang_mou" />
      <meta name="twitter:creator" content="@zhaoyang_mou" />
      
      {/* Facebook App ID */}
      <meta property="fb:app_id" content="YOUR_FACEBOOK_APP_ID" />
      
      {/* 移动设备优化 */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="msapplication-TileColor" content="#3b82f6" />
      {/* 移除缺失的 msapplication 图标 */}
      <meta name="theme-color" content="#3b82f6" />
      
      {/* Apple设备优化 */}
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={defaultSiteName} />
      {/* 移除缺失的 Apple Touch 图标 */}
      
      {/* 网站图标 */}
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* 结构化数据 */}
      <script type="application/ld+json">
        {JSON.stringify(generateSchemaData(), null, 2)}
      </script>
      
      {/* 预加载关键资源 */}
      {/* 移除缺失的本地字体预加载 */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="preconnect" href="//fonts.googleapis.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="//scholar.google.com" />
      <link rel="preconnect" href="//scholar.google.com" crossOrigin="anonymous" />
      
      {/* 站点地图 */}
      <link rel="sitemap" type="application/xml" title={t('seo.sitemap.title') as string} href="/sitemap.xml" />
      
      {/* RSS订阅 */}
      <link rel="alternate" type="application/rss+xml" title={t('seo.rss.title') as string} href="/rss.xml" />
      
      {/* 安全相关 */}
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="referrer" content="strict-origin-when-cross-origin" />
      
      {/* 防止重复内容 */}
      <link rel="prev" href={`${currentUrl}?page=1`} />
      <link rel="next" href={`${currentUrl}?page=3`} />
    </Helmet>
  );
};

// 页面特定的SEO组件
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

// 生成站点地图的函数
export const generateSitemap = () => {
  const baseUrl = 'https://zhaoyang-mou.com';
  const pages = [
    { url: '/', lastmod: new Date().toISOString(), changefreq: 'daily', priority: 1.0 },
    { url: '/research', lastmod: new Date().toISOString(), changefreq: 'weekly', priority: 0.9 },
    { url: '/projects', lastmod: new Date().toISOString(), changefreq: 'weekly', priority: 0.9 },
    { url: '/publications', lastmod: new Date().toISOString(), changefreq: 'weekly', priority: 0.8 },
    { url: '/skills', lastmod: new Date().toISOString(), changefreq: 'monthly', priority: 0.7 },
    { url: '/contact', lastmod: new Date().toISOString(), changefreq: 'monthly', priority: 0.6 },
    { url: '/ascii-demo', lastmod: new Date().toISOString(), changefreq: 'monthly', priority: 0.5 },
    { url: '/particle-field', lastmod: new Date().toISOString(), changefreq: 'monthly', priority: 0.5 }
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages.map(page => `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('')}
</urlset>`;

  return xml;
};

// 生成RSS订阅的函数
export const generateRSSFeed = (language: string = 'en') => {
  const t = createTranslationFunction(language as 'en' | 'zh');
  const baseUrl = 'https://zhaoyang-mou.com';
  const now = new Date().toISOString();
  
  const items = [
    {
      title: 'DamFormer Paper Published in Physics of Fluids',
      description: 'Our latest research on dam break simulation using transformer architecture has been published in Physics of Fluids.',
      link: `${baseUrl}/publications`,
      pubDate: '2025-01-15T00:00:00Z',
      category: 'Publication'
    },
    {
      title: 'Rs-ModCubes Paper Accepted by IEEE RA-L',
      description: 'Our innovative approach to sparse-to-dense field reconstruction has been accepted by IEEE Robotics and Automation Letters.',
      link: `${baseUrl}/publications`,
      pubDate: '2025-01-10T00:00:00Z',
      category: 'Publication'
    },
    {
      title: 'New Patent Granted for Underwater Robotics',
      description: 'A new patent has been granted for our biomimetic underwater propulsion system.',
      link: `${baseUrl}/publications`,
      pubDate: '2024-11-20T00:00:00Z',
      category: 'Patent'
    }
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${t('seo.site.title') as string}</title>
    <link>${baseUrl}</link>
    <description>${t('seo.default.description') as string}</description>
    <language>${language === 'zh' ? 'zh-CN' : 'en-US'}</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
    ${items.map(item => `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <description><![CDATA[${item.description}]]></description>
      <link>${item.link}</link>
      <guid isPermaLink="true">${item.link}</guid>
      <pubDate>${item.pubDate}</pubDate>
      <category>${item.category}</category>
    </item>`).join('')}
  </channel>
</rss>`;

  return xml;
};
