import {
  localizeBlogPost,
  type BlogLanguage,
} from '../blogLocalization';

import {
  initialBlogCategories,
  initialBlogTags,
  initialBlogPosts,
} from '../../data/mockBlogData';

import type {
  BlogPost,
  BlogCategory,
  BlogTag,
  BlogComment,
  BlogSearchOptions,
} from '../../types';

import { filterAndSortPosts } from './blogQuery';
import { deriveCategories, deriveTags, deriveArchives } from './blogTaxonomy';

export class BlogService {
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

    return filterAndSortPosts(this.posts, options, 'zh');
  }

  // 获取单篇文章
  async getPostBySlug(slug: string, language: BlogLanguage = 'zh'): Promise<BlogPost | null> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const post = this.posts.find((p) => p.slug === slug && p.isPublished);

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

    return deriveCategories(this.posts, this.categories, language);
  }

  // 获取标签列表
  async getTags(language: BlogLanguage = 'zh'): Promise<BlogTag[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    return deriveTags(this.posts, this.tags, language);
  }

  // 获取特色文章
  async getFeaturedPosts(limit: number = 3, language: BlogLanguage = 'zh'): Promise<BlogPost[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    return this.posts
      .filter((post) => post.isPublished && post.isFeatured)
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

    const currentPost = this.posts.find((post) => post.id === postId);
    if (!currentPost) return [];

    const relatedPosts = this.posts
      .filter(
        (post) =>
          post.id !== postId &&
          post.isPublished &&
          (post.category === currentPost.category ||
            post.tags.some((tag) => currentPost.tags.includes(tag)))
      )
      .slice(0, limit);

    return relatedPosts.map((post) => localizeBlogPost(post, language));
  }

  // 点赞文章
  async likePost(postId: string): Promise<boolean> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const post = this.posts.find((p) => p.id === postId);
    if (post) {
      post.likes += 1;
      return true;
    }

    return false;
  }

  // 添加评论
  async addComment(
    comment: Omit<BlogComment, 'id' | 'date' | 'isApproved'>
  ): Promise<BlogComment | null> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const newComment: BlogComment = {
      ...comment,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      isApproved: false, // 默认需要审核
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
      .filter((comment) => comment.postId === postId && comment.isApproved)
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

    return this.posts
      .filter((post) => {
        const postDate = new Date(post.date);
        const postYear = postDate.getFullYear();
        const postMonth = postDate.getMonth() + 1;

        if (month) {
          return postYear === year && postMonth === month && post.isPublished;
        } else {
          return postYear === year && post.isPublished;
        }
      })
      .map((post) => localizeBlogPost(post, language));
  }

  // 获取归档信息
  async getArchives(): Promise<{ year: number; month: number; count: number }[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    return deriveArchives(this.posts);
  }
}
