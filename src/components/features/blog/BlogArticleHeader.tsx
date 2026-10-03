import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Eye,
  Heart,
  Tag,
  User,
  MessageCircle,
  Bookmark
} from 'lucide-react';
import type { BlogPost as BlogPostType } from '../../../types';
import { useTranslation } from '../../common/TranslationProvider';
import { SimpleMotion } from '../../animations/SimpleMotion';
import { UnifiedButton } from '../../common/UnifiedButton';
import LazyImage from '../../common/LazyImage';
import { BlogShareMenu } from './BlogShareMenu';

interface BlogArticleHeaderProps {
  post: BlogPostType;
  commentsCount: number;
  isLiked: boolean;
  showShareMenu: boolean;
  onLike: () => void;
  onToggleShareMenu: () => void;
  onShare: (platform: string) => void;
  formatDate: (dateStr: string) => string;
}

const getCategoryColor = (categoryName: string) => {
  const colorMap: Record<string, string> = {
    '学术研究': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'Academic Research': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    '项目开发': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'Project Development': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    '技术思考': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'Technical Perspectives': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    '学习笔记': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    'Learning Notes': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
  };

  return colorMap[categoryName] || colorMap['学术研究'];
};

export const BlogArticleHeader: React.FC<BlogArticleHeaderProps> = ({
  post,
  commentsCount,
  isLiked,
  showShareMenu,
  onLike,
  onToggleShareMenu,
  onShare,
  formatDate
}) => {
  const { t } = useTranslation();

  return (
    <SimpleMotion
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      {/* 封面图片 */}
      {post.coverImage && (
        <div className="mb-6 rounded-lg overflow-hidden">
          <LazyImage
            src={post.coverImage}
            alt={post.title}
            className="w-full h-64 md:h-96 object-cover"
          />
        </div>
      )}

      {/* 分类与特色徽标 */}
      <div className="flex items-center gap-2 mb-4">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(post.category)}`}>
          {post.category}
        </span>
        {post.isFeatured && (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-full text-sm font-medium">
            {t('blog.featured') || '精选'}
          </span>
        )}
      </div>

      {/* 标题 */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 leading-tight">
        {post.title}
      </h1>

      {/* 元信息 */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
        <div className="flex items-center gap-1">
          <User className="w-4 h-4" />
          <span>{post.author}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(post.date)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{post.readingTime} {t('blog.minutesRead') || '分钟阅读'}</span>
        </div>
        <div className="flex items-center gap-1">
          <Eye className="w-4 h-4" />
          <span>{post.views}</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageCircle className="w-4 h-4" />
          <span>{commentsCount}</span>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex items-center gap-2 mb-6">
        <UnifiedButton
          variant={isLiked ? "primary" : "outline"}
          size="sm"
          icon={<Heart className="w-4 h-4" />}
          onClick={onLike}
          disabled={isLiked}
        >
          {post.likes} {t('blog.like') || '点赞'}
        </UnifiedButton>

        <BlogShareMenu
          isOpen={showShareMenu}
          onToggle={onToggleShareMenu}
          onShare={onShare}
        />

        <UnifiedButton
          variant="outline"
          size="sm"
          icon={<Bookmark className="w-4 h-4" />}
        >
          {t('blog.bookmark') || '收藏'}
        </UnifiedButton>
      </div>

      {/* 标签 */}
      <div className="flex flex-wrap items-center gap-2">
        <Tag className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        {post.tags.map(tag => (
          <Link
            key={tag}
            to={`/blog?tag=${encodeURIComponent(tag)}`}
            className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            {tag}
          </Link>
        ))}
      </div>
    </SimpleMotion>
  );
};
