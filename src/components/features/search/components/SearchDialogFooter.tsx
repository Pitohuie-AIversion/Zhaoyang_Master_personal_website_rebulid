import React from 'react';

export interface SearchDialogFooterProps {
  resultCount: number;
}

export const SearchDialogFooter: React.FC<SearchDialogFooterProps> = ({ resultCount }) => {
  return (
    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center text-xs text-gray-500">
      <div className="flex gap-4">
        <span>ESC 关闭</span>
        <span>TAB 导航</span>
      </div>
      {resultCount > 0 && (
        <span>共找到 {resultCount} 条结果</span>
      )}
    </div>
  );
};
