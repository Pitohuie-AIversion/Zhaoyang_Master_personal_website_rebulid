import {
  localizeBlogCategory,
  localizeBlogPost,
  localizeBlogTag,
  type BlogLanguage
} from './blogLocalization';

import {
  initialBlogCategories,
  initialBlogTags,
  initialBlogPosts
} from '../data/mockBlogData';

import type {
  BlogPost,
  BlogCategory,
  BlogTag,
  BlogComment,
  BlogSearchOptions,
  BlogFilter
} from '../types';

export type {
  BlogPost,
  BlogCategory,
  BlogTag,
  BlogComment,
  BlogSearchOptions,
  BlogFilter
};

class BlogService {
  private posts: BlogPost[] = [];
  private categories: BlogCategory[] = [];
  private tags: BlogTag[] = [];
  private comments: BlogComment[] = [];
  private isInitialized = false;

  // 初始化博客数据
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      this.categories = [...initialBlogCategories];
      this.tags = [...initialBlogTags];
      this.posts = [...initialBlogPosts];

      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize blog service:', error);
      throw error;
    }
  }

  // 获取博客文章列表
  async getPosts(options: BlogSearchOptions = {}): Promise<BlogPost[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const language = options.language || 'zh';
    let filteredPosts = this.posts.map((post) => localizeBlogPost(post, language));

    // 筛选已发布的文章
    if (!options.includeUnpublished) {
      filteredPosts = filteredPosts.filter(post => post.isPublished);
    }

    // 按分类筛选
    if (options.category) {
      filteredPosts = filteredPosts.filter(post => post.category === options.category);
    }

    // 按标签筛选
    if (options.tag) {
      filteredPosts = filteredPosts.filter(post => post.tags.includes(options.tag));
    }

    // 按搜索词筛选
    if (options.search) {
      const searchLower = options.search.toLowerCase();
      filteredPosts = filteredPosts.filter(post =>
        post.title.toLowerCase().includes(searchLower) ||
        post.excerpt.toLowerCase().includes(searchLower) ||
        post.content.toLowerCase().includes(searchLower) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // 排序
    const sortBy = options.sortBy || 'date';
    const sortOrder = options.sortOrder || 'desc';

    filteredPosts.sort((a, b) => {
      let aValue, bValue;

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
  }

  // 获取单篇文章
  async getPostBySlug(slug: string, language: BlogLanguage = 'zh'): Promise<BlogPost | null> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const post = this.posts.find(post => post.slug === slug && post.isPublished);

    if (post) {
      // 增加浏览量
      post.views += 1;
    }

    return post ? localizeBlogPost(post, language) : null;
  }

  // 获取分类列表
  async getCategories(language: BlogLanguage = 'zh'): Promise<BlogCategory[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    return this.categories.map((category) => {
      const postCount = this.posts.filter(
        (post) => post.isPublished && post.category === category.name
      ).length;
      return localizeBlogCategory({ ...category, postCount }, language);
    });
  }

  // 获取标签列表
  async getTags(language: BlogLanguage = 'zh'): Promise<BlogTag[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const tagNames = [...new Set(
      this.posts
        .filter((post) => post.isPublished)
        .flatMap((post) => post.tags)
    )];

    return tagNames.map((name, index) => {
      const configuredTag = this.tags.find((tag) => tag.name === name);
      const tag: BlogTag = {
        id: configuredTag?.id || `dynamic-${index + 1}`,
        name,
        slug: configuredTag?.slug || `tag-${index + 1}`,
        postCount: this.posts.filter((post) => post.isPublished && post.tags.includes(name)).length
      };
      return localizeBlogTag(tag, language);
    });
  }

  // 获取特色文章
  async getFeaturedPosts(limit: number = 3, language: BlogLanguage = 'zh'): Promise<BlogPost[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    return this.posts
      .filter(post => post.isPublished && post.isFeatured)
      .slice(0, limit)
      .map((post) => localizeBlogPost(post, language));
  }

  // 获取相关文章
  async getRelatedPosts(
    postId: string,
    limit: number = 3,
    language: BlogLanguage = 'zh'
  ): Promise<BlogPost[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const currentPost = this.posts.find(post => post.id === postId);
    if (!currentPost) return [];

    const relatedPosts = this.posts
      .filter(post =>
        post.id !== postId &&
        post.isPublished &&
        (post.category === currentPost.category ||
          post.tags.some(tag => currentPost.tags.includes(tag)))
      )
      .slice(0, limit);

    return relatedPosts.map((post) => localizeBlogPost(post, language));
  }

  // 点赞文章
  async likePost(postId: string): Promise<boolean> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const post = this.posts.find(post => post.id === postId);
    if (post) {
      post.likes += 1;
      return true;
    }

    return false;
  }

  // 添加评论
  async addComment(comment: Omit<BlogComment, 'id' | 'date' | 'isApproved'>): Promise<BlogComment | null> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const newComment: BlogComment = {
      ...comment,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      isApproved: false // 默认需要审核
    };

    this.comments.push(newComment);
    return newComment;
  }

  // 获取文章评论
  async getPostComments(postId: string): Promise<BlogComment[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    return this.comments
      .filter(comment => comment.postId === postId && comment.isApproved)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  // 按归档日期获取文章
  async getPostsByArchive(
    year: number,
    month?: number,
    language: BlogLanguage = 'zh'
  ): Promise<BlogPost[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    return this.posts.filter(post => {
      const postDate = new Date(post.date);
      const postYear = postDate.getFullYear();
      const postMonth = postDate.getMonth() + 1;

      if (month) {
        return postYear === year && postMonth === month && post.isPublished;
      } else {
        return postYear === year && post.isPublished;
      }
    }).map((post) => localizeBlogPost(post, language));
  }

  // 获取归档信息
  async getArchives(): Promise<{ year: number; month: number; count: number }[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const archiveMap = new Map<string, number>();

    this.posts
      .filter(post => post.isPublished)
      .forEach(post => {
        const date = new Date(post.date);
        const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
        archiveMap.set(key, (archiveMap.get(key) || 0) + 1);
      });

    return Array.from(archiveMap.entries())
      .map(([key, count]) => {
        const [yearStr, monthStr] = key.split('-');
        return {
          year: parseInt(yearStr),
          month: parseInt(monthStr),
          count
        };
      })
      .sort((a, b) => b.year - a.year || b.month - a.month);
  }
}

export const blogService = new BlogService();
