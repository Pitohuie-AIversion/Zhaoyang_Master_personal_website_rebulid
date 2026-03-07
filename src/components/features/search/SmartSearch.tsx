import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, X, Filter, TrendingUp, Clock, ExternalLink } from 'lucide-react';
import { searchService, SearchResult, SearchOptions } from '../../../services/searchService';
import { useTranslation } from '../../common/TranslationProvider';
import { SimpleMotion } from '../../animations/SimpleMotion';
import { UnifiedButton } from '../../common/UnifiedButton';
import { useNavigate } from 'react-router-dom';

interface SmartSearchProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  placeholder?: string;
}

interface SearchFilters {
  types: SearchResult['type'][];
  yearRange?: { start: number; end: number };
  minRelevance: number;
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
      .slice(0, 10); // 只保留最近10条

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

      // 保存搜索历史
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
      const suggestions = await searchService.getSuggestions(searchQuery);
      setSuggestions(suggestions);
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

  // 处理搜索建议点击
  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    performSearch(suggestion);
  };

  // 处理搜索结果点击
  const handleResultClick = (result: SearchResult) => {
    navigate(result.url);
    onClose();
  };

  // 处理历史记录点击
  const handleHistoryClick = (historyItem: string) => {
    setQuery(historyItem);
    setShowHistory(false);
    performSearch(historyItem);
  };

  // 清除搜索历史
  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  // 聚焦搜索输入框
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // 这里可以添加全局搜索快捷键
      }

      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const getResultIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'publication': return '📄';
      case 'patent': return '🔬';
      case 'award': return '🏆';
      case 'project': return '💻';
      case 'skill': return '🛠️';
      case 'page': return '📍';
      default: return '🔍';
    }
  };

  const getTypeLabel = (type: SearchResult['type']) => {
    const labels: Record<string, string> = {
      publication: t('search.types.publication') || '论文',
      patent: t('search.types.patent') || '专利',
      award: t('search.types.award') || '奖项',
      project: t('search.types.project') || '项目',
      skill: t('search.types.skill') || '技能',
      page: t('search.types.page') || '页面'
    };
    return labels[type] || type;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* 背景遮罩 */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* 搜索容器 */}
      <div className="flex items-start justify-center min-h-screen pt-20 px-4">
        <SimpleMotion
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl relative"
        >
          {/* 搜索输入框 */}
          <div className="relative">
            <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <Search className="w-5 h-5 text-gray-400 mr-3" />
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setShowHistory(query.length === 0)}
                placeholder={placeholder || t('search.placeholder') || '搜索论文、专利、项目...'}
                className="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500"
              />
              <div className="flex items-center gap-2">
                <UnifiedButton
                  variant="ghost"
                  size="sm"
                  icon={<Filter className="w-4 h-4" />}
                  onClick={() => setShowFilters(!showFilters)}
                  title={t('search.filters') || '筛选'}
                />
                {query && (
                  <UnifiedButton
                    variant="ghost"
                    size="sm"
                    icon={<X className="w-4 h-4" />}
                    onClick={() => {
                      setQuery('');
                      setResults([]);
                      setSuggestions([]);
                    }}
                    title={t('common.clear') || '清除'}
                  />
                )}
                <UnifiedButton
                  variant="ghost"
                  size="sm"
                  icon={<X className="w-4 h-4" />}
                  onClick={onClose}
                  title={t('common.close') || '关闭'}
                />
              </div>
            </div>

            {/* 快捷键提示 */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 hidden sm:flex items-center gap-2 text-xs text-gray-500">
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">Ctrl</kbd>
              <span>+</span>
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">K</kbd>
            </div>
          </div>

          {/* 筛选面板 */}
          {showFilters && (
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('search.filterByType') || '按类型筛选'}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(['publication', 'patent', 'award', 'project', 'skill', 'page'] as const).map(type => (
                      <label key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.types.includes(type)}
                          onChange={(e) => {
                            const newTypes = e.target.checked
                              ? [...filters.types, type]
                              : filters.types.filter(t => t !== type);
                            setFilters({ ...filters, types: newTypes });
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {getTypeLabel(type)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('search.minRelevance') || '最小相关度'}
                  </h4>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={filters.minRelevance}
                    onChange={(e) => setFilters({ ...filters, minRelevance: parseFloat(e.target.value) })}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {Math.round(filters.minRelevance * 100)}%
                  </div>
                </div>
              </div>
            </div>
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
          {showHistory && searchHistory.length > 0 && query.length === 0 && (
            <div className="border-b border-gray-200 dark:border-gray-700">
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    <Clock className="w-4 h-4 inline mr-1" />
                    {t('search.recentSearches') || '最近搜索'}
                  </h4>
                  <button
                    onClick={clearSearchHistory}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    {t('common.clear') || '清除'}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {searchHistory.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleHistoryClick(item)}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-sm text-gray-700 dark:text-gray-300"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
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
                {results.map((result, _index) => (
                  <button
                    key={result.id}
                    onClick={() => handleResultClick(result)}
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
                            {result.metadata.organization && (
                              <span className="truncate">{result.metadata.organization}</span>
                            )}
                          </div>
                        )}
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400 ml-2 flex-shrink-0" />
                    </div>
                  </button>
                ))}
              </div>
            )}

            {!isLoading && query && results.length === 0 && (
              <div className="p-8 text-center">
                <div className="text-gray-400 dark:text-gray-600 mb-4">
                  <Search className="w-12 h-12 mx-auto" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 mb-2">
                  {t('search.noResults') || '未找到相关结果'}
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  {t('search.tryDifferentKeywords') || '尝试使用不同的关键词搜索'}
                </p>
              </div>
            )}

            {!isLoading && !query && results.length === 0 && suggestions.length === 0 && !showHistory && (
              <div className="p-8 text-center">
                <div className="text-gray-400 dark:text-gray-600 mb-4">
                  <TrendingUp className="w-12 h-12 mx-auto" />
                </div>
                <p className="text-gray-500 dark:text-gray-400">
                  {t('search.startTyping') || '开始输入以搜索内容'}
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                  {t('search.searchTips') || '支持中英文搜索，支持模糊匹配'}
                </p>
              </div>
            )}
          </div>

          {/* 搜索结果统计 */}
          {results.length > 0 && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 text-center">
              {t('search.foundResults')?.replace('{{count}}', results.length.toString()) || `找到 ${results.length} 个结果`}
            </div>
          )}
        </SimpleMotion>
      </div>
    </div>
  );
};