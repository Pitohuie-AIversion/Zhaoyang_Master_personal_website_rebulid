import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { ArrowLeft, ChevronLeft, ExternalLink } from 'lucide-react';
import { blogService, BlogPost as BlogPostType, BlogComment } from '../../../services/blogService';
import { useTranslation } from '../../common/TranslationProvider';
import { SimpleMotion } from '../../animations/SimpleMotion';
import { UnifiedButton } from '../../common/UnifiedButton';
import { StructuredDataSEO } from '../../seo/StructuredDataSEO';
import SEOOptimization from '../../seo/SEOOptimization';
import { BlogArticleHeader } from './BlogArticleHeader';
import { BlogCommentsSection } from './BlogCommentsSection';
import { BlogRelatedPosts } from './BlogRelatedPosts';

interface BlogPostProps {
  className?: string;
}

const BlogPost: React.FC<BlogPostProps> = ({ className = '' }) => {
  const { slug } = useParams<{ slug: string }>();
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
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank', 'noopener,noreferrer');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank', 'noopener,noreferrer');
        break;
      case 'weibo':
        window.open(`https://service.weibo.com/share/share.php?title=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank', 'noopener,noreferrer');
        break;
      default:
        navigator.clipboard.writeText(url);
        alert(t('blog.linkCopied') || '链接已复制到剪贴板');
    }
    setShowShareMenu(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderMarkdown = (content: string) => {
    const rawHtml = content
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h2 class="text-2xl font-bold mt-8 mb-4">$1</h2>')
      .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/\n/g, '<br>')
      .replace(/\$\$(.+?)\$\$/g, '<div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg my-4 overflow-x-auto"><code class="text-sm">$1</code></div>')
      .replace(/\$(.+?)\$/g, '<code class="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm">$1</code>')
      .replace(/\|(.+?)\|/g, '<span class="border border-gray-300 dark:border-gray-600 px-2 py-1 rounded text-sm">$1</span>');

    return DOMPurify.sanitize(rawHtml, {
      ALLOWED_TAGS: ['h1', 'h2', 'h3', 'p', 'strong', 'em', 'br', 'div', 'code', 'span', 'a', 'ul', 'ol', 'li', 'blockquote'],
      ALLOWED_ATTR: ['class', 'href', 'target', 'rel']
    });
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center py-12 pt-24 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-400">
          {t('blog.loading') || '加载中...'}
        </span>
      </div>
    );
  }

  if (!post) {
    return (
      <div className={`text-center py-12 pt-24 ${className}`}>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {t('blog.postNotFound') || '文章未找到'}
        </h2>
        <UnifiedButton
          variant="primary"
          onClick={() => navigate('/blog')}
        >
          {t('blog.backToBlog') || '返回博客'}
        </UnifiedButton>
      </div>
    );
  }

  return (
    <div className={`max-w-4xl mx-auto px-4 py-8 pt-24 ${className}`}>
      <SEOOptimization
        title={post.title}
        description={post.excerpt}
        keywords={post.tags}
        image={post.coverImage}
        type="article"
        author={post.author}
        publishedTime={post.date}
        modifiedTime={post.updatedDate || post.date}
      />
      <StructuredDataSEO
        type="article"
        data={{
          headline: post.title,
          description: post.excerpt,
          author: {
            name: post.author,
            url: window.location.origin
          },
          datePublished: post.date,
          dateModified: post.updatedDate || post.date,
          image: post.coverImage,
          articleSection: post.category,
          keywords: post.tags.join(', '),
          wordCount: post.content.split(/\s+/).length,
          url: window.location.href
        }}
      />

      {/* 返回按钮 */}
      <div className="mb-6">
        <UnifiedButton
          variant="ghost"
          size="sm"
          icon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate('/blog')}
        >
          {t('blog.backToBlog') || '返回博客'}
        </UnifiedButton>
      </div>

      {/* 文章头部解耦组件 */}
      <BlogArticleHeader
        post={post}
        commentsCount={comments.length}
        isLiked={isLiked}
        showShareMenu={showShareMenu}
        onLike={handleLike}
        onToggleShareMenu={() => setShowShareMenu(!showShareMenu)}
        onShare={handleShare}
        formatDate={formatDate}
      />

      {/* 文章正文 */}
      <SimpleMotion
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-12"
      >
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <div
            dangerouslySetInnerHTML={{
              __html: `<div class="mb-4">${renderMarkdown(post.content)}</div>`
            }}
            className="text-gray-800 dark:text-gray-200 leading-relaxed"
          />
        </div>
      </SimpleMotion>

      {/* 相关文章推荐 */}
      <BlogRelatedPosts
        relatedPosts={relatedPosts}
        formatDate={formatDate}
      />

      {/* 评论交互区 */}
      <BlogCommentsSection
        postId={post.id}
        comments={comments}
        onCommentAdded={(newComment) => setComments([newComment, ...comments])}
        formatDate={formatDate}
      />

      {/* 底部导航 */}
      <div className="flex items-center justify-between">
        <UnifiedButton
          variant="ghost"
          size="sm"
          icon={<ChevronLeft className="w-4 h-4" />}
          onClick={() => navigate('/blog')}
        >
          {t('blog.backToBlog') || '返回博客'}
        </UnifiedButton>

        <UnifiedButton
          variant="outline"
          size="sm"
          icon={<ExternalLink className="w-4 h-4" />}
          onClick={() => window.open('https://scholar.google.com/citations?user=T3AV5RgAAAAJ', '_blank', 'noopener,noreferrer')}
        >
          {t('blog.viewOnScholar') || '在学术主页查看'}
        </UnifiedButton>
      </div>
    </div>
  );
};

export default BlogPost;
