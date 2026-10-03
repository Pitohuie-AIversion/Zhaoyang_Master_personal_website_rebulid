import React from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ExternalLink } from 'lucide-react';
import { SimpleMotion } from '../../animations/SimpleMotion';
import { UnifiedButton } from '../../common/UnifiedButton';
import { StructuredDataSEO } from '../../seo/StructuredDataSEO';
import SEOOptimization from '../../seo/SEOOptimization';
import { BlogArticleHeader } from './BlogArticleHeader';
import { BlogCommentsSection } from './BlogCommentsSection';
import { BlogRelatedPosts } from './BlogRelatedPosts';
import { useBlogPost, renderMarkdown, formatBlogDate } from './post-view';

interface BlogPostProps {
  className?: string;
}

const BlogPost: React.FC<BlogPostProps> = ({ className = '' }) => {
  const { slug } = useParams<{ slug: string }>();
  const {
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
  } = useBlogPost(slug);

  const formatDate = (dateString: string) => formatBlogDate(dateString, language);

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
            url: window.location.origin,
          },
          datePublished: post.date,
          dateModified: post.updatedDate || post.date,
          image: post.coverImage,
          articleSection: post.category,
          keywords: post.tags.join(', '),
          wordCount: post.content.split(/\s+/).length,
          url: window.location.href,
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
              __html: `<div class="mb-4">${renderMarkdown(post.content)}</div>`,
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
