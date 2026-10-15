import { localizeBlogPost, type BlogLanguage } from '../blogLocalization';
import type { BlogPost, BlogSearchOptions } from '../../types';

export const filterAndSortPosts = (
  posts: BlogPost[],
  options: BlogSearchOptions = {},
  defaultLanguage: BlogLanguage = 'zh'
): BlogPost[] => {
  const language = options.language || defaultLanguage;
  let filteredPosts = posts.map((post) => localizeBlogPost(post, language));

  // 筛选已发布的文章
  if (!options.includeUnpublished) {
    filteredPosts = filteredPosts.filter((post) => post.isPublished);
  }

  // 按分类筛选
  if (options.category) {
    filteredPosts = filteredPosts.filter((post) => post.category === options.category);
  }

  // 按标签筛选
  if (options.tag) {
    filteredPosts = filteredPosts.filter((post) => post.tags.includes(options.tag));
  }

  // 按搜索词筛选
  if (options.search) {
    const searchLower = options.search.toLowerCase();
    filteredPosts = filteredPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchLower) ||
        post.excerpt.toLowerCase().includes(searchLower) ||
        post.content.toLowerCase().includes(searchLower) ||
        post.tags.some((tag) => tag.toLowerCase().includes(searchLower))
    );
  }

  // 排序
  const sortBy = options.sortBy || 'date';
  const sortOrder = options.sortOrder || 'desc';

  filteredPosts.sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    switch (sortBy) {
      case 'date':
        aValue = new Date(a.date).getTime();
        bValue = new Date(b.date).getTime();
        break;
      case 'views':
        aValue = a.views;
        bValue = b.views;
        break;
      case 'likes':
        aValue = a.likes;
        bValue = b.likes;
        break;
      case 'title':
        aValue = a.title;
        bValue = b.title;
        break;
      default:
        return 0;
    }

    if (sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  // 分页
  const limit = options.limit || 10;
  const offset = options.offset || 0;

  return filteredPosts.slice(offset, offset + limit);
};
