import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { 
  Calendar, 
  Clock, 
  Eye, 
  Heart, 
  Tag, 
  User, 
  ArrowLeft, 
  Share2, 
  MessageCircle,
  ChevronLeft,
  Bookmark,
  ExternalLink
} from 'lucide-react';
import { blogService, BlogPost as BlogPostType, BlogComment } from '../services/blogService';
import { useTranslation } from '../components/TranslationProvider';
import { useResponsive } from '../hooks/useResponsive';
import { SimpleMotion } from '../components/SimpleMotion';
import { UnifiedButton } from '../components/UnifiedButton';
import { ResponsiveCard } from '../components/ResponsiveEnhancements';
import LazyImage from '../components/LazyImage';
import { StructuredDataSEO } from '../components/StructuredDataSEO';

interface BlogPostProps {
  className?: string;
}

interface CommentFormData {
  author: string;
  email: string;
  content: string;
}

const BlogPost: React.FC<BlogPostProps> = ({ className = '' }) => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isMobile } = useResponsive();
  
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentForm, setCommentForm] = useState<CommentFormData>({
    author: '',
    email: '',
    content: ''
  });
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const loadPost = useCallback(async (postSlug: string) => {
    try {
      setLoading(true);
      
      // 加载文章
      const blogPost = await blogService.getPostBySlug(postSlug);
      if (!blogPost) {
        navigate('/blog');
        return;
      }
      
      setPost(blogPost);
      
      // 加载评论
      const postComments = await blogService.getPostComments(blogPost.id);
      setComments(postComments);
      
      // 加载相关文章
      const related = await blogService.getRelatedPosts(blogPost.id, 3);
      setRelatedPosts(related);
      
    } catch (error) {
      console.error('Failed to load blog post:', error);
      navigate('/blog');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

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

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post) return;
    
    if (!commentForm.author.trim() || !commentForm.email.trim() || !commentForm.content.trim()) {
      alert(t('blog.pleaseFillAllFields') || '请填写所有必填字段');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(commentForm.email)) {
      alert(t('blog.pleaseEnterValidEmail') || '请输入有效的邮箱地址');
      return;
    }
    
    try {
      setIsSubmittingComment(true);
      
      const newComment = await blogService.addComment({
        postId: post.id,
        author: commentForm.author,
        email: commentForm.email,
        content: commentForm.content
      });
      
      if (newComment) {
        setComments([newComment, ...comments]);
        setCommentForm({ author: '', email: '', content: '' });
        alert(t('blog.commentSubmitted') || '评论已提交，等待审核');
      }
    } catch (error) {
      console.error('Failed to submit comment:', error);
      alert(t('blog.commentSubmitFailed') || '评论提交失败，请重试');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleShare = (platform: string) => {
    if (!post) return;
    
    const url = window.location.href;
    const title = post.title;
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'weibo':
        window.open(`https://service.weibo.com/share/share.php?title=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      default:
        navigator.clipboard.writeText(url);
        alert(t('blog.linkCopied') || '链接已复制到剪贴板');
    }
    setShowShareMenu(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryColor = (categoryName: string) => {
    const colorMap: Record<string, string> = {
      '学术研究': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      '项目开发': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      '技术思考': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      '学习笔记': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    };
    
    return colorMap[categoryName] || colorMap.blue;
  };

  const renderMarkdown = (content: string) => {
    // 安全的Markdown渲染，使用DOMPurify防止XSS攻击
    const rawHtml = content
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/\n/g, '<br>')
      .replace(/\$\$(.+?)\$\$/g, '<div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg my-4 overflow-x-auto"><code class="text-sm">$1</code></div>')
      .replace(/\$(.+?)\$/g, '<code class="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm">$1</code>')
      .replace(/\|(.+?)\|/g, '<span class="border border-gray-300 dark:border-gray-600 px-2 py-1 rounded text-sm">$1</span>');
    
    // 使用DOMPurify清理HTML，防止XSS攻击
    return DOMPurify.sanitize(rawHtml, {
      ALLOWED_TAGS: ['h1', 'h2', 'h3', 'p', 'strong', 'em', 'br', 'div', 'code', 'span', 'a', 'ul', 'ol', 'li', 'blockquote'],
      ALLOWED_ATTR: ['class', 'href', 'target', 'rel']
    });
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

  if (!post) {
    return (
      <div className={`text-center py-12 ${className}`}>
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
    <div className={`max-w-4xl mx-auto px-4 py-8 ${className}`}>
      {/* SEO结构化数据 */}
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

      {/* 文章头部 */}
      <SimpleMotion
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        {/* 封面图片 */}
        {post.coverImage && (
          <div className="mb-6 rounded-lg overflow-hidden">
            <LazyImage
              src={post.coverImage}
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover"
            />
          </div>
        )}

        {/* 分类 */}
        <div className="flex items-center gap-2 mb-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(post.category)}`}>
            {post.category}
          </span>
          {post.isFeatured && (
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-full text-sm font-medium">
              {t('blog.featured') || '精选'}
            </span>
          )}
        </div>

        {/* 标题 */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 leading-tight">
          {post.title}
        </h1>

        {/* 元信息 */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span>{post.author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(post.date)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{post.readingTime} {t('blog.minutesRead') || '分钟阅读'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{post.views}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4" />
            <span>{comments.length}</span>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex items-center gap-2 mb-6">
          <UnifiedButton
            variant={isLiked ? "primary" : "outline"}
            size="sm"
            icon={<Heart className="w-4 h-4" />}
            onClick={handleLike}
            disabled={isLiked}
          >
            {post.likes} {t('blog.like') || '点赞'}
          </UnifiedButton>
          
          <div className="relative">
            <UnifiedButton
              variant="outline"
              size="sm"
              icon={<Share2 className="w-4 h-4" />}
              onClick={() => setShowShareMenu(!showShareMenu)}
            >
              {t('blog.share') || '分享'}
            </UnifiedButton>
            
            {showShareMenu && (
              <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-10">
                <button
                  onClick={() => handleShare('twitter')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Twitter
                </button>
                <button
                  onClick={() => handleShare('linkedin')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  LinkedIn
                </button>
                <button
                  onClick={() => handleShare('weibo')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  微博
                </button>
                <button
                  onClick={() => handleShare('copy')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {t('blog.copyLink') || '复制链接'}
                </button>
              </div>
            )}
          </div>
          
          <UnifiedButton
            variant="outline"
            size="sm"
            icon={<Bookmark className="w-4 h-4" />}
          >
            {t('blog.bookmark') || '收藏'}
          </UnifiedButton>
        </div>

        {/* 标签 */}
        <div className="flex flex-wrap items-center gap-2">
          <Tag className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          {post.tags.map(tag => (
            <Link
              key={tag}
              to={`/blog?tag=${encodeURIComponent(tag)}`}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {tag}
            </Link>
          ))}
        </div>
      </SimpleMotion>

      {/* 文章内容 */}
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

      {/* 相关文章 */}
      {relatedPosts.length > 0 && (
        <SimpleMotion
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            {t('blog.relatedPosts') || '相关文章'}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedPosts.map(relatedPost => (
              <ResponsiveCard
                key={relatedPost.id}
                className="p-4 hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/blog/${relatedPost.slug}`)}
              >
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
                  {relatedPost.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-3">
                  {relatedPost.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
                  <span>{formatDate(relatedPost.date)}</span>
                  <span>{relatedPost.readingTime} {t('blog.minutesRead') || '分钟'}</span>
                </div>
              </ResponsiveCard>
            ))}
          </div>
        </SimpleMotion>
      )}

      {/* 评论区域 */}
      <SimpleMotion
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          {t('blog.comments') || '评论'} ({comments.length})
        </h2>

        {/* 评论表单 */}
        <ResponsiveCard className="p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {t('blog.leaveComment') || '发表评论'}
          </h3>
          <form onSubmit={handleCommentSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('blog.name') || '姓名'} *
                </label>
                <input
                  type="text"
                  value={commentForm.author}
                  onChange={(e) => setCommentForm({ ...commentForm, author: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('blog.email') || '邮箱'} *
                </label>
                <input
                  type="email"
                  value={commentForm.email}
                  onChange={(e) => setCommentForm({ ...commentForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('blog.comment') || '评论内容'} *
              </label>
              <textarea
                value={commentForm.content}
                onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder={t('blog.commentPlaceholder') || '请输入您的评论...'}
                required
              />
            </div>
            <UnifiedButton
              type="submit"
              variant="primary"
              disabled={isSubmittingComment}
              icon={<MessageCircle className="w-4 h-4" />}
            >
              {isSubmittingComment ? (t('blog.submitting') || '提交中...') : (t('blog.submitComment') || '提交评论')}
            </UnifiedButton>
          </form>
        </ResponsiveCard>

        {/* 评论列表 */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              {t('blog.noComments') || '暂无评论，快来发表第一条评论吧！'}
            </div>
          ) : (
            comments.map(comment => (
              <ResponsiveCard key={comment.id} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {comment.author.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {comment.author}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(comment.date)}
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {comment.content}
                </p>
              </ResponsiveCard>
            ))
          )}
        </div>
      </SimpleMotion>

      {/* 导航 */}
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
          onClick={() => window.open('https://scholar.google.com/citations?user=zhaoyang_mu', '_blank')}
        >
          {t('blog.viewOnScholar') || '在学术主页查看'}
        </UnifiedButton>
      </div>
    </div>
  );
};

export default BlogPost;