import React from 'react';
import { Search, Filter, Tag } from 'lucide-react';
import { BlogCategory, BlogTag } from '../../../../services/blogService';

export interface BlogFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: 'date' | 'views' | 'likes';
  onSortByChange: (sortBy: 'date' | 'views' | 'likes') => void;
  sortOrder: 'asc' | 'desc';
  onToggleSortOrder: () => void;
  categories: BlogCategory[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  tags: BlogTag[];
  selectedTag: string;
  onSelectTag: (tag: string) => void;
  t: (key: string) => string;
}

export const BlogFilterBar: React.FC<BlogFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onToggleSortOrder,
  categories,
  selectedCategory,
  onSelectCategory,
  tags,
  selectedTag,
  onSelectTag,
  t
}) => {
  return (
    <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div className="flex flex-col lg:flex-row gap-4 mb-4">
        {/* 搜索框 */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder={t('blog.searchPlaceholder') || '搜索博客文章...'}
            aria-label={t('blog.searchPlaceholder') || '搜索博客文章'}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>

        {/* 排序 */}
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as 'date' | 'views' | 'likes')}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="date">{t('blog.sortByDate') || '按日期'}</option>
            <option value="views">{t('blog.sortByViews') || '按浏览量'}</option>
            <option value="likes">{t('blog.sortByLikes') || '按点赞数'}</option>
          </select>
          <button
            onClick={onToggleSortOrder}
            className="px-3 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg text-gray-700 dark:text-gray-300 transition-colors"
            aria-label={sortOrder === 'desc' ? '降序' : '升序'}
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
          onClick={() => onSelectCategory('')}
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
            onClick={() => onSelectCategory(category.name)}
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
          onClick={() => onSelectTag('')}
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
            onClick={() => onSelectTag(tag.name)}
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
  );
};
