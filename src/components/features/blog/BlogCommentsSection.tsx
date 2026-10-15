import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import type { BlogComment } from '../../../types';
import { blogService } from '../../../services/blogService';
import { useTranslation } from '../../common/TranslationProvider';
import { SimpleMotion } from '../../animations/SimpleMotion';
import { UnifiedButton } from '../../common/UnifiedButton';
import { ResponsiveCard } from '../../common/ResponsiveEnhancements';

interface BlogCommentsSectionProps {
  postId: string;
  comments: BlogComment[];
  onCommentAdded: (newComment: BlogComment) => void;
  formatDate: (dateStr: string) => string;
}

interface CommentFormData {
  author: string;
  email: string;
  content: string;
}

export const BlogCommentsSection: React.FC<BlogCommentsSectionProps> = ({
  postId,
  comments,
  onCommentAdded,
  formatDate
}) => {
  const { t } = useTranslation();
  const [commentForm, setCommentForm] = useState<CommentFormData>({
    author: '',
    email: '',
    content: ''
  });
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
        postId,
        author: commentForm.author,
        email: commentForm.email,
        content: commentForm.content
      });

      if (newComment) {
        onCommentAdded(newComment);
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

  return (
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
  );
};
