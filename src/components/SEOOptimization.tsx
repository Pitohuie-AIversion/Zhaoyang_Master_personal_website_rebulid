import React from 'react';
import { Helmet } from 'react-helmet-async';

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
  title = '牟昭阳 - 计算机科学研究者 & 软件工程师',
  description = '专注于人工智能、机器学习和软件工程领域的研究与实践。致力于通过技术创新解决实际问题，推动科技进步。',
  keywords = ['牟昭阳', 'Zhaoyang Mu', '计算机科学', '人工智能', '机器学习', '软件工程', '研究者'],
  image = '/og-image.jpg',
  url = window.location.href,
  type = 'website',
  author = '牟昭阳',
  publishedTime,
  modifiedTime
}) => {
  const siteTitle = '牟昭阳 - 个人网站';
  const fullTitle = title === siteTitle ? title : `${title} | ${siteTitle}`;

  return (
    <Helmet>
      {/* 基本元数据 */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content="zh-CN" />
      
      {/* Open Graph 元数据 */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:locale" content="zh_CN" />
      
      {/* Twitter Card 元数据 */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* 文章特定元数据 */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}
      
      {/* 结构化数据 */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": type === 'profile' ? 'Person' : 'WebSite',
          "name": author,
          "url": url,
          "description": description,
          "image": image,
          ...(type === 'profile' && {
            "jobTitle": "计算机科学研究者 & 软件工程师",
            "worksFor": {
              "@type": "Organization",
              "name": "研究机构"
            },
            "knowsAbout": keywords
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
export const HomeSEO: React.FC = () => (
  <SEOOptimization
    title="牟昭阳 - 计算机科学研究者 & 软件工程师"
    description="欢迎来到牟昭阳的个人网站。专注于人工智能、机器学习和软件工程领域的研究与实践，致力于通过技术创新解决实际问题。"
    keywords={['牟昭阳', 'Zhaoyang Mu', '个人网站', '计算机科学', '人工智能', '机器学习', '软件工程']}
    type="profile"
  />
);

export const ResearchSEO: React.FC = () => (
  <SEOOptimization
    title="研究方向 - 牟昭阳"
    description="了解牟昭阳在人工智能、机器学习、深度学习等领域的研究方向和学术成果。"
    keywords={['研究方向', '人工智能研究', '机器学习', '深度学习', '学术研究']}
    type="website"
  />
);

export const ProjectsSEO: React.FC = () => (
  <SEOOptimization
    title="项目展示 - 牟昭阳"
    description="查看牟昭阳的技术项目作品集，包括人工智能应用、软件开发项目和开源贡献。"
    keywords={['项目展示', '技术项目', '软件开发', '开源项目', '作品集']}
    type="website"
  />
);

export const PublicationsSEO: React.FC = () => (
  <SEOOptimization
    title="学术发表 - 牟昭阳"
    description="浏览牟昭阳的学术论文发表、会议演讲和研究成果。"
    keywords={['学术论文', '研究发表', '会议论文', '学术成果']}
    type="website"
  />
);

export const SkillsSEO: React.FC = () => (
  <SEOOptimization
    title="技能专长 - 牟昭阳"
    description="了解牟昭阳的技术技能、编程语言能力和专业工具使用经验。"
    keywords={['技术技能', '编程语言', '专业技能', '工具使用']}
    type="website"
  />
);

export const ContactSEO: React.FC = () => (
  <SEOOptimization
    title="联系方式 - 牟昭阳"
    description="与牟昭阳取得联系，探讨合作机会或学术交流。"
    keywords={['联系方式', '合作机会', '学术交流', '联系我']}
    type="website"
  />
);