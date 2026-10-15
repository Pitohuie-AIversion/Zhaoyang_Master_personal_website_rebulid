import React from 'react';

// 骨架屏组件
export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="bg-gray-200 rounded-lg p-6">
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-3" />
        <div className="h-3 bg-gray-300 rounded w-full mb-2" />
        <div className="h-3 bg-gray-300 rounded w-5/6 mb-4" />
        <div className="h-2 bg-gray-300 rounded w-1/2" />
      </div>
    </div>
  );
};

// 项目卡片骨架屏
export const ProjectCardSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {/* 头部 */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="flex items-center space-x-2">
              <div className="h-4 bg-gray-200 rounded w-16" />
              <div className="h-4 bg-gray-200 rounded w-12" />
            </div>
          </div>
          <div className="h-6 w-16 bg-gray-200 rounded-full" />
        </div>

        {/* 描述 */}
        <div className="space-y-2 mb-4">
          <div className="h-3 bg-gray-200 rounded w-full" />
          <div className="h-3 bg-gray-200 rounded w-4/5" />
        </div>

        {/* 技术栈 */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="h-6 bg-gray-200 rounded w-16" />
          <div className="h-6 bg-gray-200 rounded w-20" />
          <div className="h-6 bg-gray-200 rounded w-14" />
        </div>

        {/* 按钮 */}
        <div className="flex space-x-2">
          <div className="h-8 bg-gray-200 rounded w-20" />
          <div className="h-8 bg-gray-200 rounded w-16" />
        </div>
      </div>
    </div>
  );
};

// 研究亮点骨架屏
export const ResearchHighlightSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse">
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
              <div className="h-4 bg-gray-200 rounded w-4/5" />
            </div>
            <div className="h-6 bg-gray-200 rounded w-20" />
          </div>
          <div className="h-48 bg-gray-200 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

// 新闻动态骨架屏
export const NewsItemSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse">
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="h-4 bg-gray-200 rounded w-20 mb-3" />
        <div className="h-5 bg-gray-200 rounded w-4/5 mb-2" />
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-full" />
          <div className="h-3 bg-gray-200 rounded w-3/4" />
        </div>
      </div>
    </div>
  );
};

// 统计数据骨架屏
export const StatSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse text-center">
      <div className="w-12 h-12 bg-gray-300 rounded-full mx-auto mb-2" />
      <div className="h-8 bg-gray-300 rounded w-16 mx-auto mb-2" />
      <div className="h-4 bg-gray-300 rounded w-20 mx-auto" />
    </div>
  );
};
