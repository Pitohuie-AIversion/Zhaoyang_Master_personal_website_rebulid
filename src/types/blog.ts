/**
 * 博客模块领域类型定义
 */

export type BlogLanguage = 'zh' | 'en';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  updatedDate?: string;
  tags: string[];
  category: string;
  coverImage?: string;
  readingTime: number;
  views: number;
  likes: number;
  isPublished: boolean;
  isFeatured: boolean;
  metadata?: {
    seoTitle?: string;
    seoDescription?: string;
    keywords?: string[];
  };
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  postCount: number;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  postCount: number;
}

export interface BlogComment {
  id: string;
  postId: string;
  author: string;
  email: string;
  content: string;
  date: string;
  isApproved: boolean;
  parentId?: string;
}

export interface BlogSearchOptions {
  language?: BlogLanguage;
  category?: string;
  tag?: string;
  author?: string;
  search?: string;
  query?: string;
  sortBy?: 'date' | 'views' | 'likes' | 'title';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
  includeUnpublished?: boolean;
}

export interface BlogFilter {
  category?: string;
  tag?: string;
  search?: string;
  language?: BlogLanguage;
}
