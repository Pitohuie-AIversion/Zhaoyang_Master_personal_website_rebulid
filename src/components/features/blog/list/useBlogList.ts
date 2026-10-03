import { useState, useEffect, useCallback } from 'react';
import { blogService, BlogPost, BlogCategory, BlogTag } from '../../../../services/blogService';

export interface UseBlogListOptions {
  language: string;
  category?: string;
  tag?: string;
  maxPosts?: number;
}

export const useBlogList = ({
  language,
  category,
  tag,
  maxPosts = 10
}: UseBlogListOptions) => {
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
      const blogLanguage: 'zh' | 'en' = language === 'zh' ? 'zh' : 'en';
      const options = {
        language: blogLanguage,
        category: selectedCategory || undefined,
        tag: selectedTag || undefined,
        search: searchQuery || undefined,
        sortBy,
        sortOrder,
        limit: maxPosts
      };

      const blogPosts = await blogService.getPosts(options);
      setPosts(blogPosts);

      const [blogCategories, blogTags] = await Promise.all([
        blogService.getCategories(blogLanguage),
        blogService.getTags(blogLanguage)
      ]);

      setCategories(blogCategories);
      setTags(blogTags);
    } catch (error) {
      console.error('Failed to load blog data:', error);
    } finally {
      setLoading(false);
    }
  }, [language, selectedCategory, selectedTag, searchQuery, sortBy, sortOrder, maxPosts]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    setSelectedCategory('');
    setSelectedTag('');
    setSearchQuery('');
  }, [language]);

  const handleLike = useCallback(async (postId: string) => {
    try {
      await blogService.likePost(postId);
      loadData();
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  }, [loadData]);

  const toggleSortOrder = useCallback(() => {
    setSortOrder(prev => (prev === 'desc' ? 'asc' : 'desc'));
  }, []);

  return {
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
  };
};
