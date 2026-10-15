import { useState, useMemo } from 'react';
import { TimelineItem, TimelineSortBy, TimelineSortOrder } from './types';

export interface UseTimelineFilterOptions {
  items?: TimelineItem[];
  maxItems?: number;
}

export const useTimelineFilter = ({
  items: providedItems,
  maxItems = 20
}: UseTimelineFilterOptions) => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<TimelineSortBy>('date');
  const [sortOrder, setSortOrder] = useState<TimelineSortOrder>('desc');

  const items = useMemo(() => providedItems ?? [], [providedItems]);

  const toggleType = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const clearTypes = () => {
    setSelectedTypes([]);
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => (prev === 'desc' ? 'asc' : 'desc'));
  };

  const filteredItems = useMemo(() => {
    if (selectedTypes.length === 0) return items;
    return items.filter(item => selectedTypes.includes(item.type));
  }, [items, selectedTypes]);

  const sortedItems = useMemo(() => {
    const sorted = [...filteredItems].sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return sortOrder === 'desc'
            ? new Date(b.date).getTime() - new Date(a.date).getTime()
            : new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'type':
          return sortOrder === 'desc'
            ? b.type.localeCompare(a.type)
            : a.type.localeCompare(b.type);
        case 'title':
          return sortOrder === 'desc'
            ? b.title.localeCompare(a.title)
            : a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return sorted.slice(0, maxItems);
  }, [filteredItems, sortBy, sortOrder, maxItems]);

  return {
    selectedTypes,
    toggleType,
    clearTypes,
    sortBy,
    setSortBy,
    sortOrder,
    toggleSortOrder,
    filteredItems,
    sortedItems
  };
};
