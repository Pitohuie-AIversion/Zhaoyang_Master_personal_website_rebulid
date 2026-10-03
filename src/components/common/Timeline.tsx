import React from 'react';
import { useTranslation } from './TranslationProvider';
import { UnifiedButton } from './UnifiedButton';
import {
  type TimelineItem,
  type TimelineProps,
  useTimelineFilter,
  TimelineFilters,
  TimelineList
} from './timeline-core';

export type { TimelineItem, TimelineProps };

export const Timeline: React.FC<TimelineProps> = ({
  items: providedItems,
  maxItems = 20,
  showFilters = true,
  className = ''
}) => {
  const { t, language } = useTranslation();

  const {
    selectedTypes,
    toggleType,
    clearTypes,
    sortBy,
    setSortBy,
    sortOrder,
    toggleSortOrder,
    filteredItems,
    sortedItems
  } = useTimelineFilter({ items: providedItems, maxItems });

  return (
    <div className={`relative ${className}`}>
      {/* 筛选和排序控件 */}
      {showFilters && (
        <TimelineFilters
          selectedTypes={selectedTypes}
          onToggleType={toggleType}
          onClearTypes={clearTypes}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          sortOrder={sortOrder}
          onToggleSortOrder={toggleSortOrder}
          t={t}
        />
      )}

      {/* 时间线列表 */}
      <TimelineList
        sortedItems={sortedItems}
        language={language}
        t={t}
      />

      {/* 加载更多 */}
      {filteredItems.length > maxItems && (
        <div className="text-center mt-8">
          <UnifiedButton
            variant="outline"
            onClick={() => { /* 可以添加加载更多逻辑 */ }}
          >
            {t('timeline.loadMore') || '加载更多'}
          </UnifiedButton>
        </div>
      )}
    </div>
  );
};

export default Timeline;
