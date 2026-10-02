import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useTranslation } from '../../../common/TranslationProvider';

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  onFocus?: () => void;
  onBlur?: () => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder,
  className = '',
  onFocus,
  onBlur,
}) => {
  const { t } = useTranslation();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          value={value}
          aria-label={placeholder || (t('common.searchPlaceholder') as string)}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => {
            setIsFocused(true);
            onFocus?.();
          }}
          onBlur={() => {
            setIsFocused(false);
            onBlur?.();
          }}
          placeholder={placeholder || (t('common.searchPlaceholder') as string)}
          className={`
            w-full pl-10 pr-4 py-2 rounded-lg border transition-all duration-200
            ${
              isFocused
                ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-lg'
                : 'border-gray-300 dark:border-gray-600'
            }
            bg-white dark:bg-gray-800 text-gray-900 dark:text-white
            placeholder-gray-500 dark:placeholder-gray-400
            focus:outline-none
          `}
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            aria-label={t('common.aria.clearSearch') as string}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
