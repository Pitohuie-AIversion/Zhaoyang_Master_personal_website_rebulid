import React from 'react';
import { Share2 } from 'lucide-react';
import { UnifiedButton } from '../../common/UnifiedButton';
import { useTranslation } from '../../common/TranslationProvider';

interface BlogShareMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  onShare: (platform: string) => void;
}

export const BlogShareMenu: React.FC<BlogShareMenuProps> = ({
  isOpen,
  onToggle,
  onShare
}) => {
  const { t } = useTranslation();

  return (
    <div className="relative">
      <UnifiedButton
        variant="outline"
        size="sm"
        icon={<Share2 className="w-4 h-4" />}
        onClick={onToggle}
      >
        {t('blog.share') || '分享'}
      </UnifiedButton>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-10 min-w-[120px]">
          <button
            onClick={() => onShare('twitter')}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {t('common.social.twitter') as string}
          </button>
          <button
            onClick={() => onShare('linkedin')}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {t('common.social.linkedin') as string}
          </button>
          <button
            onClick={() => onShare('weibo')}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {t('common.social.weibo') as string}
          </button>
          <button
            onClick={() => onShare('copy')}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {t('blog.copyLink') || '复制链接'}
          </button>
        </div>
      )}
    </div>
  );
};
