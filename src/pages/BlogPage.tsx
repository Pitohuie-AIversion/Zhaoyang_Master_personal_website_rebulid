import React from 'react';
import { BlogList } from '../components/BlogList';
import { useTranslation } from '../components/TranslationProvider';
import { SimpleMotion } from '../components/SimpleMotion';
import { StructuredDataSEO } from '../components/StructuredDataSEO';

const BlogPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">
      {/* SEO结构化数据 */}
      <StructuredDataSEO
        type="blog"
        data={{
          headline: t('blog.title') || '学术博客',
          description: t('blog.description') || '分享学术研究成果和技术思考',
          url: window.location.href,
          author: {
            name: "牟昭阳",
            url: window.location.origin
          }
        }}
      />

      {/* 页面头部 */}
      <SimpleMotion
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12 px-4"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {t('blog.title') || '学术博客'}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {t('blog.description') || '分享学术研究成果和技术思考，记录学术探索的点点滴滴'}
        </p>
      </SimpleMotion>

      {/* 博客列表 */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <BlogList 
          maxPosts={20}
          showFilters={true}
          showExcerpt={true}
          showAuthor={true}
          showStats={true}
        />
      </div>
    </div>
  );
};

export default BlogPage;