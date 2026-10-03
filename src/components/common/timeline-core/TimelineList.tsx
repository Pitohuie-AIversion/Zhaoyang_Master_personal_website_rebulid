import React from 'react';
import { TimelineItem } from './types';
import { TimelineItemCard } from './TimelineItemCard';
import { TimelineEmptyState } from './TimelineEmptyState';

export interface TimelineListProps {
  sortedItems: TimelineItem[];
  language: string;
  t: (key: string) => string;
}

export const TimelineList: React.FC<TimelineListProps> = ({
  sortedItems,
  language,
  t
}) => {
  return (
    <div className="relative">
      {/* 时间线主轴 */}
      <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-600" />

      {sortedItems.map((item, index) => (
        <TimelineItemCard
          key={item.id}
          item={item}
          index={index}
          language={language}
          t={t}
        />
      ))}

      {sortedItems.length === 0 && (
        <TimelineEmptyState message={t('timeline.noItems')} />
      )}
    </div>
  );
};
