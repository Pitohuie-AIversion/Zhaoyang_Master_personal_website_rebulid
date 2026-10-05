import React from 'react';
import { Search } from 'lucide-react';

export interface SearchSuggestionsListProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
}

export const SearchSuggestionsList: React.FC<SearchSuggestionsListProps> = ({
  suggestions,
  onSelect
}) => {
  if (suggestions.length === 0) return null;

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <div className="p-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSelect(suggestion)}
            className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm text-gray-700 dark:text-gray-300 transition-colors"
          >
            <div className="flex items-center">
              <Search className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
              <span>{suggestion}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
