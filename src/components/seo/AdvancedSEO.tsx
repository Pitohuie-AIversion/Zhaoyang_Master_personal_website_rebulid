/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from '../common/TranslationProvider';
import { useLocation } from 'react-router-dom';
import { SITE_ORIGIN, generateSchemaData } from './schemaGenerator';

export { SITE_ORIGIN, generateSchemaData } from './schemaGenerator';
export * from './pageSeoComponents';
export * from './feedGenerators';

export interface AdvancedSEOProps {
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
  } catch (_error) {
    defaultKeywords = keywords || ['牟昭阳', 'Zhaoyang Mu', '计算机科学', '人工智能'];
  }
  const defaultAuthor = author || (t('seo.site.author') as string);
  const defaultLocale = locale || (language === 'zh' ? 'zh_CN' : 'en_US');
  const defaultSiteName = siteName || (t('seo.site.title') as string);
  const currentUrl = canonicalUrl || `${SITE_ORIGIN}${location.pathname}`;

  const fullTitle = defaultTitle === defaultSiteName ? defaultTitle : `${defaultTitle} | ${defaultSiteName}`;

  const schemas = generateSchemaData({
    defaultSiteName,
    defaultDescription,
    defaultLocale,
    type,
    defaultTitle,
    defaultAuthor,
    publishedTime,
    modifiedTime,
    image,
    currentUrl,
    defaultKeywords,
    section,
    breadcrumbs,
    jobTitle: t('seo.default.jobTitle') as string,
    dlmuName: t('seo.institutions.dlmu') as string,
    westlakeName: t('seo.institutions.westlake') as string
  });

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

      {/* 移动设备优化 */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="msapplication-TileColor" content="#3b82f6" />
      <meta name="theme-color" content="#3b82f6" />

      {/* Apple设备优化 */}
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={defaultSiteName} />

      {/* 网站图标 */}
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="manifest" href="/site.webmanifest" />

      {/* 结构化数据 */}
      <script type="application/ld+json">
        {JSON.stringify(schemas, null, 2)}
      </script>

      {/* 预加载关键资源 */}
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
    </Helmet>
  );
};
