import React from 'react';
import { Calendar, Clock, Eye, Heart, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BlogPost, BlogCategory } from '../../../../services/blogService';
import { SimpleMotion } from '../../../animations/SimpleMotion';
import { UnifiedButton } from '../../../common/UnifiedButton';
import LazyImage from '../../../common/LazyImage';
import { formatBlogDate, getReadingTimeText, getCategoryColor } from './blogHelpers';

export interface BlogPostCardProps {
  post: BlogPost;
  index: number;
  categories: BlogCategory[];
  showAuthor?: boolean;
  showStats?: boolean;
  showExcerpt?: boolean;
  onLike: (postId: string) => void;
  language: string;
  t: (key: string) => string;
}

export const BlogPostCard: React.FC<BlogPostCardProps> = ({
  post,
  index,
  categories,
  showAuthor = true,
  showStats = true,
  showExcerpt = true,
  onLike,
  language,
  t,
}) => {
  return (
    <SimpleMotion
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
    >
      <div className="flex flex-col md:flex-row">
        {/* 封面图片 */}
        {post.coverImage && (
          <div className="md:w-1/3">
            <LazyImage
              src={post.coverImage}
              alt={post.title}
              className="w-full h-48 md:h-full object-cover"
            />
          </div>
        )}

        {/* 文章内容 */}
        <div className={`p-6 ${post.coverImage ? 'md:w-2/3' : 'w-full'}`}>
          {/* 标题 */}
          <Link to={`/blog/${post.slug}`}>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              {post.title}
            </h3>
          </Link>

          {/* 元信息 */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
            {showAuthor && (
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formatBlogDate(post.date, language)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{getReadingTimeText(post.readingTime, t)}</span>
            </div>
            {showStats && (
              <>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{post.views}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  <span>{post.likes}</span>
                </div>
              </>
            )}
          </div>

          {/* 分类和标签 */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                post.category,
                categories
              )}`}
            >
              {post.category}
            </span>
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* 摘要 */}
          {showExcerpt && (
            <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* 操作按钮 */}
          <div className="flex items-center justify-between">
            <Link to={`/blog/${post.slug}`}>
              <UnifiedButton variant="primary" size="sm">
                {t('blog.readMore') || '阅读更多'}
              </UnifiedButton>
            </Link>
            <UnifiedButton
              variant="ghost"
              size="sm"
              icon={<Heart className="w-4 h-4" />}
              onClick={() => onLike(post.id)}
              title={t('blog.like') || '点赞'}
            >
              {post.likes}
            </UnifiedButton>
          </div>
        </div>
      </div>
    </SimpleMotion>
  );
};
