import { createTranslationFunction } from '../../utils/i18n';
import { SITE_ORIGIN } from './schemaGenerator';

// 生成站点地图的函数
export const generateSitemap = () => {
  const baseUrl = SITE_ORIGIN;
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
  const baseUrl = SITE_ORIGIN;
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
