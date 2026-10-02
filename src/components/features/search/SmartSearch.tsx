import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Search, X, Filter, TrendingUp } from 'lucide-react';
import { searchService, SearchResult, SearchOptions } from '../../../services/searchService';
import { useTranslation } from '../../common/TranslationProvider';
import { SimpleMotion } from '../../animations/SimpleMotion';
import { useNavigate } from 'react-router-dom';
import {
  SearchResultItem,
  SearchFilterPanel,
  SearchHistoryList,
  type SearchFilters
} from './components';

interface SmartSearchProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  placeholder?: string;
}

export const SmartSearch: React.FC<SmartSearchProps> = ({
  isOpen,
  onClose,
  initialQuery = '',
  placeholder
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    types: ['publication', 'patent', 'award', 'project', 'skill', 'page'],
    minRelevance: 0.1
  });
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // 加载搜索历史
  useEffect(() => {
    const history = localStorage.getItem('searchHistory');
    if (history) {
      try {
        setSearchHistory(JSON.parse(history));
      } catch (error) {
        console.error('Failed to load search history:', error);
      }
    }
  }, []);

  // 保存搜索历史
  const saveSearchHistory = useCallback((newQuery: string) => {
    if (!newQuery.trim()) return;

    const updatedHistory = [newQuery, ...searchHistory.filter(item => item !== newQuery)]
      .slice(0, 10);

    setSearchHistory(updatedHistory);
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
  }, [searchHistory]);

  // 搜索功能
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);

    try {
      const options: SearchOptions = {
        types: filters.types,
        minRelevance: filters.minRelevance,
        fuzzy: true,
        limit: 20
      };

      const searchResults = await searchService.search(searchQuery, options);
      setResults(searchResults);
      saveSearchHistory(searchQuery);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters, saveSearchHistory]);

  // 获取搜索建议
  const updateSuggestions = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const fetchedSuggestions = await searchService.getSuggestions(searchQuery);
      setSuggestions(fetchedSuggestions);
    } catch (error) {
      console.error('Failed to get suggestions:', error);
      setSuggestions([]);
    }
  }, []);

  // 延迟搜索
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      if (query.trim()) {
        performSearch(query);
        updateSuggestions(query);
      } else {
        setResults([]);
        setSuggestions([]);
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query, performSearch, updateSuggestions]);

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    performSearch(suggestion);
  };

  const handleResultClick = (result: SearchResult) => {
    navigate(result.url);
    onClose();
  };

  const handleHistoryClick = (historyItem: string) => {
    setQuery(historyItem);
    setShowHistory(false);
    performSearch(historyItem);
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocusedRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    searchInputRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
          )
        ).filter(element => !element.hasAttribute('hidden'));

        if (focusable.length === 0) {
          e.preventDefault();
          return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocusedRef.current?.focus();
    };
  }, [isOpen, onClose]);

  const getTypeLabel = (type: SearchResult['type']) => {
    switch (type) {
      case 'publication': return t('search.publication') || '出版物';
      case 'patent': return t('search.patent') || '专利';
      case 'award': return t('search.award') || '奖项';
      case 'project': return t('search.project') || '项目';
      case 'skill': return t('search.skill') || '技能';
      case 'page': return t('search.page') || '页面';
      default: return type;
    }
  };

  const getResultIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'publication': return '📄';
      case 'patent': return '💡';
      case 'award': return '🏆';
      case 'project': return '🚀';
      case 'skill': return '⚡';
      case 'page': return '🔗';
      default: return '🔍';
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-start justify-center p-4 pt-16">
        <SimpleMotion
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden"
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={placeholder || (t('search.placeholder') as string) || '全局搜索'}
          >
            {/* 搜索输入框 */}
            <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <Search className="w-5 h-5 text-gray-400 mr-3" />
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setShowHistory(true)}
                placeholder={placeholder || (t('search.placeholder') as string) || '全局搜索...'}
                className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 text-lg"
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    showFilters ? 'text-blue-500' : 'text-gray-400'
                  }`}
                  aria-label={t('common.filter') || '筛选'}
                >
                  <Filter className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400"
                  aria-label={t('common.close') || '关闭'}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 筛选面板 */}
            {showFilters && (
              <SearchFilterPanel
                filters={filters}
                onChange={setFilters}
                getTypeLabel={getTypeLabel}
              />
            )}

            {/* 搜索建议 */}
            {suggestions.length > 0 && query.length > 0 && (
              <div className="border-b border-gray-200 dark:border-gray-700">
                <div className="p-2">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm text-gray-700 dark:text-gray-300"
                    >
                      <div className="flex items-center">
                        <Search className="w-4 h-4 text-gray-400 mr-2" />
                        {suggestion}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 搜索历史 */}
            {showHistory && query.length === 0 && (
              <SearchHistoryList
                history={searchHistory}
                onSelect={handleHistoryClick}
                onClear={clearSearchHistory}
              />
            )}

            {/* 搜索结果 */}
            <div className="max-h-96 overflow-y-auto">
              {isLoading && (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-500 dark:text-gray-400">
                    {t('search.searching') || '搜索中...'}
                  </p>
                </div>
              )}

              {!isLoading && results.length > 0 && (
                <div className="p-2">
                  {results.map((result) => (
                    <SearchResultItem
                      key={result.id}
                      result={result}
                      onClick={() => handleResultClick(result)}
                      getTypeLabel={getTypeLabel}
                      getResultIcon={getResultIcon}
                    />
                  ))}
                </div>
              )}

              {!isLoading && query.trim() && results.length === 0 && (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  <p className="text-lg mb-2">{t('search.noResults') || '未找到相关结果'}</p>
                  <p className="text-sm">
                    {t('search.tryDifferentKeywords') || '请尝试使用不同的关键词搜索'}
                  </p>
                </div>
              )}

              {!isLoading && !query.trim() && searchHistory.length === 0 && (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  <TrendingUp className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">
                    {t('search.startTyping') || '输入关键词开始全局搜索'}
                  </p>
                </div>
              )}
            </div>

            {/* 底部帮助信息 */}
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center text-xs text-gray-500">
              <div className="flex gap-4">
                <span>ESC 关闭</span>
                <span>TAB 导航</span>
              </div>
              {results.length > 0 && (
                <span>共找到 {results.length} 条结果</span>
              )}
            </div>
          </div>
        </SimpleMotion>
      </div>
    </div>,
    document.body
  );
};
