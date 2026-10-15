import React from 'react';
import { BookOpen } from 'lucide-react';
import { useTranslation } from '../../../common/TranslationProvider';

export const BlogLoadingState: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { t } = useTranslation();

  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      <span className="ml-3 text-gray-600 dark:text-gray-400">
        {t('blog.loading') || '加载中...'}
      </span>
    </div>
  );
};

export const BlogEmptyState: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="text-center py-12">
      <BookOpen className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
      <p className="text-gray-500 dark:text-gray-400">
        {t('blog.noPosts') || '暂无博客文章'}
      </p>
    </div>
  );
};
