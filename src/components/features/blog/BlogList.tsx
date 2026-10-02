import React from 'react';
import { useTranslation } from '../../common/TranslationProvider';
import {
  type BlogListProps,
  useBlogList,
  BlogFilterBar,
  BlogPostCard,
  BlogEmptyState,
  BlogLoadingState
} from './list';

export type { BlogListProps };

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
  const { t, language } = useTranslation();

  const {
    posts,
    categories,
    tags,
    loading,
    selectedCategory,
    setSelectedCategory,
    selectedTag,
    setSelectedTag,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    sortOrder,
    toggleSortOrder,
    handleLike
  } = useBlogList({ language, category, tag, maxPosts });

  if (loading) {
    return <BlogLoadingState className={className} />;
  }

  return (
    <div className={className}>
      {/* 筛选和搜索 */}
      {showFilters && (
        <BlogFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          sortOrder={sortOrder}
          onToggleSortOrder={toggleSortOrder}
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          tags={tags}
          selectedTag={selectedTag}
          onSelectTag={setSelectedTag}
          t={t}
        />
      )}

      {/* 文章列表 */}
      <div className="space-y-6">
        {posts.length === 0 ? (
          <BlogEmptyState />
        ) : (
          posts.map((post, index) => (
            <BlogPostCard
              key={post.id}
              post={post}
              index={index}
              categories={categories}
              showAuthor={showAuthor}
              showStats={showStats}
              showExcerpt={showExcerpt}
              onLike={handleLike}
              language={language}
              t={t}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default BlogList;
