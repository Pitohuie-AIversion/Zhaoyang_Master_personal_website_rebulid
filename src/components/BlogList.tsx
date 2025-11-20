import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Clock, Eye, Heart, Tag, User, BookOpen, Search, Filter } from 'lucide-react';
import { blogService, BlogPost, BlogCategory, BlogTag } from '../services/blogService';
import { useTranslation } from '../components/TranslationProvider';
import { useResponsive } from '../hooks/useResponsive';
import { SimpleMotion } from '../components/SimpleMotion';
import { UnifiedButton } from '../components/UnifiedButton';
import { Link } from 'react-router-dom';
import LazyImage from '../components/LazyImage';

interface BlogListProps {
  maxPosts?: number;
  showFilters?: boolean;
  showExcerpt?: boolean;
  showAuthor?: boolean;
  showStats?: boolean;
  category?: string;
  tag?: string;
  className?: string;
}

export const BlogList: React.FC<BlogListProps> = ({
  maxPosts = 10,
  showFilters = true,
  showExcerpt = true,
  showAuthor = true,
  showStats = true,
  category,
  tag,
  className = ''
}) => {
  const { t } = useTranslation();
  const { isMobile: _isMobile } = useResponsive();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>(category || '');
  const [selectedTag, setSelectedTag] = useState<string>(tag || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'views' | 'likes'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // 加载博客文章
      const options = {
        category: selectedCategory || undefined,
        tag: selectedTag || undefined,
        search: searchQuery || undefined,
        sortBy,
        sortOrder,
        limit: maxPosts
      };
      
      const blogPosts = await blogService.getPosts(options);
      setPosts(blogPosts);

      // 加载分类和标签
      const [blogCategories, blogTags] = await Promise.all([
        blogService.getCategories(),
        blogService.getTags()
      ]);
      
      setCategories(blogCategories);
      setTags(blogTags);
    } catch (error) {
      console.error('Failed to load blog data:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedTag, searchQuery, sortBy, sortOrder, maxPosts]);

  useEffect(() => {
    loadData();
  }, [selectedCategory, selectedTag, searchQuery, sortBy, sortOrder, loadData]);

  const handleLike = async (postId: string) => {
    try {
      await blogService.likePost(postId);
      // 重新加载数据以更新点赞数
      loadData();
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getReadingTimeText = (readingTime: number) => {
    return `${readingTime} ${t('blog.minutesRead') || '分钟阅读'}`;
  };

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      orange: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      indigo: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
    };
    
    return category?.color ? colorMap[category.color] : colorMap.blue;
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-400">
          {t('blog.loading') || '加载中...'}
        </span>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* 筛选和搜索 */}
      {showFilters && (
        <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            {/* 搜索框 */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={t('blog.searchPlaceholder') || '搜索博客文章...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* 排序 */}
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'views' | 'likes')}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="date">{t('blog.sortByDate') || '按日期'}</option>
                <option value="views">{t('blog.sortByViews') || '按浏览量'}</option>
                <option value="likes">{t('blog.sortByLikes') || '按点赞数'}</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                className="px-3 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg text-gray-700 dark:text-gray-300"
              >
                {sortOrder === 'desc' ? '↓' : '↑'}
              </button>
            </div>
          </div>

          {/* 分类筛选 */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('blog.categories') || '分类'}:
            </span>
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                selectedCategory === ''
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {t('blog.allCategories') || '全部分类'}
            </button>
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  selectedCategory === category.name
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {category.name} ({category.postCount})
              </button>
            ))}
          </div>

          {/* 标签筛选 */}
          <div className="flex flex-wrap items-center gap-2">
            <Tag className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('blog.tags') || '标签'}:
            </span>
            <button
              onClick={() => setSelectedTag('')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                selectedTag === ''
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {t('blog.allTags') || '全部标签'}
            </button>
            {tags.slice(0, 8).map(tag => (
              <button
                key={tag.id}
                onClick={() => setSelectedTag(tag.name)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  selectedTag === tag.name
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {tag.name} ({tag.postCount})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 文章列表 */}
      <div className="space-y-6">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              {t('blog.noPosts') || '暂无博客文章'}
            </p>
          </div>
        ) : (
          posts.map((post, index) => (
            <SimpleMotion
              key={post.id}
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
                      <span>{formatDate(post.date)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{getReadingTimeText(post.readingTime)}</span>
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
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                      {post.category}
                    </span>
                    {post.tags.slice(0, 3).map(tag => (
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
                      <UnifiedButton
                        variant="primary"
                        size="sm"
                      >
                        {t('blog.readMore') || '阅读更多'}
                      </UnifiedButton>
                    </Link>
                    <UnifiedButton
                      variant="ghost"
                      size="sm"
                      icon={<Heart className="w-4 h-4" />}
                      onClick={() => handleLike(post.id)}
                      title={t('blog.like') || '点赞'}
                    >
                      {post.likes}
                    </UnifiedButton>
                  </div>
                </div>
              </div>
            </SimpleMotion>
          ))
        )}
      </div>
    </div>
  );
};