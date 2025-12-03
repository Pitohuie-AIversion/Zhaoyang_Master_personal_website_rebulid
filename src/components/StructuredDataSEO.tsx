import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * 结构化数据SEO组件
 * 为搜索引擎提供学术文章、专利、奖项等结构化数据
 */

interface StructuredDataSEOProps {
  type: 'person' | 'article' | 'patent' | 'award' | 'organization' | 'blog';
  data: any;
  className?: string;
}

export const StructuredDataSEO: React.FC<StructuredDataSEOProps> = ({ 
  type, 
  data, 
  className = '' 
}) => {
  const generateStructuredData = () => {
    switch (type) {
      case 'person':
        return generatePersonSchema(data);
      case 'article':
        return generateArticleSchema(data);
      case 'patent':
        return generatePatentSchema(data);
      case 'award':
        return generateAwardSchema(data);
      case 'organization':
        return generateOrganizationSchema(data);
      case 'blog':
        return generateBlogSchema(data);
      default:
        return null;
    }
  };

  const structuredData = generateStructuredData();

  if (!structuredData) return null;
  if (import.meta.env.VITE_ALLOW_INLINE_JSONLD !== 'true') return null;

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData, null, 2)}
      </script>
    </Helmet>
  );
};

// 个人资料结构化数据
const generatePersonSchema = (data: any) => ({
  "@context": "https://schema.org",
  "@type": "Person",
  "name": data.name,
  "jobTitle": data.jobTitle,
  "affiliation": data.affiliation,
  "url": data.url,
  "email": data.email,
  "telephone": data.telephone,
  "address": data.address,
  "alumniOf": data.alumniOf,
  "worksFor": data.worksFor,
  "sameAs": data.sameAs,
  "description": data.description,
  "image": data.image,
  "knowsAbout": data.knowsAbout
});

// 学术文章结构化数据
const generateArticleSchema = (data: any) => ({
  "@context": "https://schema.org",
  "@type": "ScholarlyArticle",
  "headline": data.title,
  "author": data.authors?.map((author: string) => ({
    "@type": "Person",
    "name": author
  })),
  "datePublished": data.datePublished,
  "dateModified": data.dateModified,
  "publisher": {
    "@type": "Organization",
    "name": data.journal
  },
  "journal": {
    "@type": "Periodical",
    "name": data.journal
  },
  "volumeNumber": data.volume,
  "issueNumber": data.issue,
  "pageStart": data.pageStart,
  "pageEnd": data.pageEnd,
  "doi": data.doi,
  "url": data.url,
  "abstract": data.abstract,
  "keywords": data.keywords,
  "citationCount": data.citationCount,
  "isAccessibleForFree": data.isAccessibleForFree
});

// 专利结构化数据
const generatePatentSchema = (data: any) => ({
  "@context": "https://schema.org",
  "@type": "Patent",
  "name": data.title,
  "patentNumber": data.number,
  "inventor": data.inventors?.map((inventor: string) => ({
    "@type": "Person",
    "name": inventor
  })),
  "patentOffice": data.office,
  "applicationDate": data.applicationDate,
  "publicationDate": data.publicationDate,
  "patentStatus": data.status,
  "description": data.description,
  "url": data.url,
  "keywords": data.keywords
});

// 奖项结构化数据
const generateAwardSchema = (data: any) => ({
  "@context": "https://schema.org",
  "@type": "Award",
  "name": data.title,
  "description": data.description,
  "datePublished": data.date,
  "organizer": {
    "@type": "Organization",
    "name": data.organization
  },
  "winner": {
    "@type": "Person",
    "name": data.winner
  },
  "url": data.url,
  "image": data.image
});

// 组织结构化数据
const generateOrganizationSchema = (data: any) => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": data.name,
  "description": data.description,
  "url": data.url,
  "logo": data.logo,
  "address": data.address,
  "telephone": data.telephone,
  "email": data.email
});

// 博客结构化数据
const generateBlogSchema = (data: any) => ({
  "@context": "https://schema.org",
  "@type": "Blog",
  "headline": data.headline,
  "description": data.description,
  "url": data.url,
  "author": data.author,
  "publisher": data.author
});

// 默认的牟昭阳个人资料结构化数据
export const ZhaoyangMuStructuredData = () => (
  <StructuredDataSEO
    type="person"
    data={{
      name: "牟昭阳 (Zhaoyang Mu)",
      jobTitle: "人工智能硕士研究生 & 访问学生",
      affiliation: "大连海事大学 & 西湖大学",
      url: "https://zhaoyang-mu.vercel.app",
      email: "mzymuzhaoyang@gmail.com",
      telephone: "+86 153 8213 0266",
      address: {
        "@type": "PostalAddress",
        "addressLocality": "杭州",
        "addressRegion": "浙江省",
        "addressCountry": "CN"
      },
      alumniOf: [
        {
          "@type": "Organization",
          "name": "大连海事大学",
          "url": "https://www.dlmu.edu.cn"
        },
        {
          "@type": "Organization", 
          "name": "西湖大学",
          "url": "https://www.westlake.edu.cn"
        }
      ],
      worksFor: {
        "@type": "Organization",
        "name": "大连海事大学人工智能学院"
      },
      description: "专注于科学计算、机器人技术和人工智能交叉领域研究，在Transformer神经算子、CFD仿真、水下机器人等方面有深入研究",
      image: "https://zhaoyang-mu.vercel.app/me_Nero_AI_Image_Upscaler_Photo_Face.jpeg",
      knowsAbout: ["人工智能", "机器学习", "计算流体力学", "水下机器人", "神经算子", "仿生学"],
      socialLinks: [
        "https://scholar.google.com/citations?user=zhaoyang_mu",
        "https://github.com/zhaoyang-mu",
        "https://linkedin.com/in/zhaoyang-mu"
      ]
    }}
  />
);

export default StructuredDataSEO;
