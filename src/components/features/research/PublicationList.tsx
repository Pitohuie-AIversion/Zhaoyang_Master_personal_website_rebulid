import React from 'react';
import type { PaperListProps } from '../../../types/academic';
import { ResponsiveCard } from '../../common/ResponsiveEnhancements';
import { PageLoader } from '../../common/LoadingComponents';
import {
  usePublicationData,
  PaperCard,
  PublicationListControls,
  PublicationStats,
} from './publication-list';

export const PublicationList: React.FC<PaperListProps> = ({
  papers: externalPapers = [],
  maxItems = 10,
  showCitations = true,
  showVelocity = true,
  className = '',
}) => {
  const {
    papers,
    processedPapers,
    loading,
    error,
    sortBy,
    setSortBy,
    filterYear,
    setFilterYear,
    yearOptions,
  } = usePublicationData(externalPapers, maxItems);

  if (loading) {
    return (
      <ResponsiveCard className={`p-6 ${className}`}>
        <div className="flex items-center justify-center h-32">
          <PageLoader />
        </div>
      </ResponsiveCard>
    );
  }

  if (error) {
    return (
      <ResponsiveCard className={`p-6 ${className}`}>
        <div className="text-center text-red-500">
          <p>{error}</p>
        </div>
      </ResponsiveCard>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 筛选和排序控件 */}
      <PublicationListControls
        sortBy={sortBy}
        onSortByChange={setSortBy}
        filterYear={filterYear}
        onFilterYearChange={setFilterYear}
        yearOptions={yearOptions}
      />

      {/* 论文列表 */}
      <div className="space-y-4">
        {processedPapers.map((paper, index) => (
          <PaperCard
            key={index}
            paper={paper}
            showCitations={showCitations}
            showVelocity={showVelocity}
          />
        ))}
      </div>

      {/* 统计信息 */}
      <PublicationStats papers={papers} />
    </div>
  );
};

export default PublicationList;
