import React from 'react';
import { Calendar } from 'lucide-react';

export interface TimelineEmptyStateProps {
  message?: string;
}

export const TimelineEmptyState: React.FC<TimelineEmptyStateProps> = ({ message }) => {
  return (
    <div className="text-center py-12">
      <div className="text-gray-400 dark:text-gray-600 mb-4">
        <Calendar className="w-12 h-12 mx-auto" />
      </div>
      <p className="text-gray-500 dark:text-gray-400">
        {message || '暂无时间线项目'}
      </p>
    </div>
  );
};
