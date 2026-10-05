import React from 'react';
import { ExternalLink } from 'lucide-react';
import type { SearchResult } from '../../../../services/searchService';

interface SearchResultItemProps {
  result: SearchResult;
  onClick: () => void;
  getTypeLabel: (type: SearchResult['type']) => string;
  getResultIcon: (type: SearchResult['type']) => string;
}

export const SearchResultItem: React.FC<SearchResultItemProps> = ({
  result,
  onClick,
  getTypeLabel,
  getResultIcon
}) => {
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
    >
      <div className="flex items-start">
        <div className="text-2xl mr-3 mt-1">
          {getResultIcon(result.type)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {result.title}
            </h4>
            <div className="flex items-center gap-2 ml-2">
              <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded">
                {getTypeLabel(result.type)}
              </span>
              <span className="text-xs text-gray-500">
                {Math.round(result.relevance * 100)}%
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
            {result.description}
          </p>
          {result.metadata && (
            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              {result.metadata.year && (
                <span>{result.metadata.year}</span>
              )}
              {result.metadata.authors && result.metadata.authors.length > 0 && (
                <span className="truncate">
                  {result.metadata.authors.join(', ')}
                </span>
              )}
              {result.metadata.journal && (
                <span className="truncate">{result.metadata.journal}</span>
              )}
              {result.metadata.patentNumber && (
                <span>{result.metadata.patentNumber}</span>
              )}
              {result.metadata.level && (
                <span>{result.metadata.level}</span>
              )}
            </div>
          )}
          {result.url && (
            <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 mt-2">
              <span>{result.url}</span>
              <ExternalLink className="w-3 h-3" />
            </div>
          )}
        </div>
      </div>
    </button>
  );
};
