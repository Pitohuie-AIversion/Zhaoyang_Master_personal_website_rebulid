import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { BlogPost as BlogPostType } from '../../../types';
import { useTranslation } from '../../common/TranslationProvider';
import { SimpleMotion } from '../../animations/SimpleMotion';
import { ResponsiveCard } from '../../common/ResponsiveEnhancements';

interface BlogRelatedPostsProps {
  relatedPosts: BlogPostType[];
  formatDate: (dateStr: string) => string;
}

export const BlogRelatedPosts: React.FC<BlogRelatedPostsProps> = ({
  relatedPosts,
  formatDate
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (relatedPosts.length === 0) return null;

  return (
    <SimpleMotion
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mb-12"
    >
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        {t('blog.relatedPosts') || '相关文章'}
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedPosts.map(relatedPost => (
          <ResponsiveCard
            key={relatedPost.id}
            className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate(`/blog/${relatedPost.slug}`)}
          >
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
              {relatedPost.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-3">
              {relatedPost.excerpt}
            </p>
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
              <span>{formatDate(relatedPost.date)}</span>
              <span>{relatedPost.readingTime} {t('blog.minutesRead') || '分钟'}</span>
            </div>
          </ResponsiveCard>
        ))}
      </div>
    </SimpleMotion>
  );
};
