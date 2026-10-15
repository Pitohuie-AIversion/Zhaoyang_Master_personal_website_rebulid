import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { blogService, type BlogPost as BlogPostType, type BlogComment } from '../../../../services/blogService';
import { useTranslation } from '../../../common/TranslationProvider';

export const useBlogPost = (slug: string | undefined) => {
  const navigate = useNavigate();
  const { t, language } = useTranslation();

  const [post, setPost] = useState<BlogPostType | null>(null);
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const loadPost = useCallback(async (postSlug: string) => {
    try {
      setLoading(true);

      const blogPost = await blogService.getPostBySlug(postSlug, language);
      if (!blogPost) {
        navigate('/blog');
        return;
      }

      setPost(blogPost);

      const postComments = await blogService.getPostComments(blogPost.id);
      setComments(postComments);

      const related = await blogService.getRelatedPosts(blogPost.id, 3, language);
      setRelatedPosts(related);
    } catch (error) {
      console.error('Failed to load blog post:', error);
      navigate('/blog');
    } finally {
      setLoading(false);
    }
  }, [language, navigate]);

  useEffect(() => {
    if (slug) {
      loadPost(slug);
    }
  }, [slug, loadPost]);

  const handleLike = async () => {
    if (!post || isLiked) return;

    try {
      await blogService.likePost(post.id);
      setPost({ ...post, likes: post.likes + 1 });
      setIsLiked(true);
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleShare = (platform: string) => {
    if (!post) return;

    const url = window.location.href;
    const title = post.title;

    switch (platform) {
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
          '_blank',
          'noopener,noreferrer'
        );
        break;
      case 'linkedin':
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
          '_blank',
          'noopener,noreferrer'
        );
        break;
      case 'weibo':
        window.open(
          `https://service.weibo.com/share/share.php?title=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
          '_blank',
          'noopener,noreferrer'
        );
        break;
      default:
        navigator.clipboard.writeText(url);
        alert(t('blog.linkCopied') || '链接已复制到剪贴板');
    }
    setShowShareMenu(false);
  };

  return {
    post,
    comments,
    setComments,
    relatedPosts,
    loading,
    isLiked,
    showShareMenu,
    setShowShareMenu,
    handleLike,
    handleShare,
    language,
    t,
    navigate,
  };
};
