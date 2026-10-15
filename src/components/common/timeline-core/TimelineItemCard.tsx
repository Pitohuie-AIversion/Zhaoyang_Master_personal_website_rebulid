import React from 'react';
import { Calendar, MapPin, Award, BookOpen, FileText, ExternalLink } from 'lucide-react';
import { SimpleMotion } from '../../animations/SimpleMotion';
import { TimelineItem } from './types';
import {
  getTypeIcon,
  getTypeColor,
  getTypeBadgeColor,
  getTypeLabel,
  formatTimelineDate
} from './timelineHelpers';

export interface TimelineItemCardProps {
  item: TimelineItem;
  index: number;
  language: string;
  t: (key: string) => string;
}

export const TimelineItemCard: React.FC<TimelineItemCardProps> = ({
  item,
  index,
  language,
  t
}) => {
  return (
    <SimpleMotion
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`relative mb-8 ${
        item.isHighlighted
          ? 'bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border-l-4 border-yellow-400'
          : ''
      }`}
    >
      {/* 时间线节点 */}
      <div
        className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center text-white ${getTypeColor(
          item.type
        )}`}
      >
        {getTypeIcon(item.type)}
      </div>

      {/* 内容 */}
      <div className="ml-12 sm:ml-16">
        {/* 标题和基本信息 */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
              {item.title}
            </h3>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
              {item.date && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatTimelineDate(item.date, language)}
                </div>
              )}
              {item.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {item.location}
                </div>
              )}
              {item.organization && (
                <span className="font-medium">{item.organization}</span>
              )}
            </div>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeBadgeColor(item.type)}`}>
            {getTypeLabel(item.type, t)}
          </span>
        </div>

        {/* 描述 */}
        {item.description && (
          <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
            {item.description}
          </p>
        )}

        {/* 元数据 */}
        {item.metadata && (
          <div className="flex flex-wrap items-center gap-4 mb-3 text-sm">
            {item.metadata.doi && (
              <a
                href={`https://doi.org/${item.metadata.doi}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <FileText className="w-4 h-4" />
                DOI: {item.metadata.doi}
              </a>
            )}
            {item.metadata.patentNumber && (
              <span className="text-orange-600 dark:text-orange-400 flex items-center gap-1">
                <FileText className="w-4 h-4" />
                Patent: {item.metadata.patentNumber}
              </span>
            )}
            {item.metadata.citations && (
              <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                {item.metadata.citations} citations
              </span>
            )}
            {item.metadata.impact && (
              <span className="text-purple-600 dark:text-purple-400 flex items-center gap-1">
                Impact Factor: {item.metadata.impact}
              </span>
            )}
            {item.metadata.certificateNumber && (
              <span className="text-yellow-600 dark:text-yellow-400 flex items-center gap-1">
                <Award className="w-4 h-4" />
                Certificate: {item.metadata.certificateNumber}
              </span>
            )}
          </div>
        )}

        {/* 标签 */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {item.tags.map((tag, tagIndex) => (
              <span
                key={tagIndex}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* 详情链接 */}
        {item.metadata?.url && (
          <div className="flex items-center justify-between">
            <a
              href={item.metadata.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center gap-1"
            >
              {(t('research.viewDetails') as string) || '查看详情'}
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>
    </SimpleMotion>
  );
};
