import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { useDebounce } from '../../../hooks/useDebounce';
import { UnifiedButton } from '../../common/UnifiedButton';
import { useTranslation } from '../../common/TranslationProvider';
import { HoverCard } from '../../animations/InteractiveEffects';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: 'project' | 'publication' | 'skill' | 'research';
  url: string;
  relevance: number;
  highlights: string[];
}

interface SearchHistory {
  query: string;
  timestamp: number;
  results: number;
}

interface EnhancedSearchProps {
  placeholder?: string;
  onSearch?: (results: SearchResult[]) => void;
  className?: string;
  showFilters?: boolean;
  showHistory?: boolean;
  maxResults?: number;
}

// 模拟搜索数据
const mockSearchData = [
  {
    id: '1',
    title: 'DamFormer: Dam Break Simulation Transformer',
    description: 'A transformer-based model for dam break simulation with cross geometry generalization',
    category: 'project' as const,
    url: '/projects',
    relevance: 0.95,
    highlights: ['transformer', 'simulation', 'dam break']
  },
  {
    id: '2',
    title: 'Sparse-to-Dense Field Reconstruction',
    description: 'Environmental flow sensor data processing using transformer architecture',
    category: 'research' as const,
    url: '/research',
    relevance: 0.92,
    highlights: ['sparse-to-dense', 'transformer', 'sensor data']
  },
  {
    id: '3',
    title: 'Physics of Fluids Publication',
    description: 'DamFormer paper published in Physics of Fluids journal 2025',
    category: 'publication' as const,
    url: '/publications',
    relevance: 0.89,
    highlights: ['Physics of Fluids', 'publication', '2025']
  },
  {
    id: '4',
    title: 'Python & PyTorch',
    description: 'Deep learning framework expertise with PyTorch and scientific computing',
    category: 'skill' as const,
    url: '/skills',
    relevance: 0.85,
    highlights: ['Python', 'PyTorch', 'deep learning']
  },
  {
    id: '5',
    title: 'Biomimetic Undulating Fin Propulsion',
    description: 'CFD simulation of bio-inspired underwater propulsion systems',
    category: 'project' as const,
    url: '/projects',
    relevance: 0.83,
    highlights: ['biomimetic', 'CFD', 'underwater']
  }
];

export const EnhancedSearch: React.FC<EnhancedSearchProps> = ({
  placeholder,
  onSearch,
  className = '',
  showFilters = true,
  showHistory = true,
  maxResults = 10
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [showResults, setShowResults] = useState(false);
  
  const { t } = useTranslation();
  const debouncedQuery = useDebounce(query, 300);

  // 从localStorage加载搜索历史
  useEffect(() => {
    const saved = localStorage.getItem('search-history');
    if (saved) {
      setSearchHistory(JSON.parse(saved));
    }
  }, []);

  // 保存搜索历史
  const saveToHistory = useCallback((searchQuery: string, resultCount: number) => {
    if (!searchQuery.trim()) return;
    
    const newHistory: SearchHistory = {
      query: searchQuery,
      timestamp: Date.now(),
      results: resultCount
    };
    
    setSearchHistory(prev => {
      const filtered = prev.filter(item => item.query !== searchQuery);
      const updated = [newHistory, ...filtered].slice(0, 5);
      localStorage.setItem('search-history', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // 搜索算法
  const searchResults = useMemo(() => {
    if (!debouncedQuery.trim()) return [];

    const queryLower = debouncedQuery.toLowerCase();
    const results: SearchResult[] = [];

    mockSearchData.forEach(item => {
      const titleMatch = item.title.toLowerCase().includes(queryLower);
      const descMatch = item.description.toLowerCase().includes(queryLower);
      const categoryMatch = selectedCategory === 'all' || item.category === selectedCategory;
      
      if ((titleMatch || descMatch) && categoryMatch) {
        const relevance = item.relevance * (titleMatch ? 1.2 : 1.0) * (descMatch ? 1.1 : 1.0);
        
        // 高亮匹配文本
        const highlights: string[] = [];
        if (titleMatch) highlights.push(item.title);
        if (descMatch) highlights.push(item.description);
        
        results.push({
          ...item,
          relevance,
          highlights
        });
      }
    });

    return results
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, maxResults);
  }, [debouncedQuery, selectedCategory, maxResults]);

  // 触发搜索回调
  useEffect(() => {
    if (onSearch) {
      onSearch(searchResults);
    }
    
    if (debouncedQuery.trim() && searchResults.length > 0) {
      saveToHistory(debouncedQuery, searchResults.length);
    }
  }, [searchResults, onSearch, debouncedQuery, saveToHistory]);

  // 清除搜索
  const clearSearch = useCallback(() => {
    setQuery('');
    setShowResults(false);
  }, []);

  // 清除历史记录
  const clearHistory = useCallback(() => {
    setSearchHistory([]);
    localStorage.removeItem('search-history');
  }, []);

  // 获取类别图标
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'project': return '🚀';
      case 'publication': return '📄';
      case 'skill': return '💡';
      case 'research': return '🔬';
      default: return '📝';
    }
  };

  // 获取类别颜色
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'project': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'publication': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'skill': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'research': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* 搜索输入框 */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder={placeholder || (t('common.searchPlaceholder') as string)}
          className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 dark:focus:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
        />
        {query && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <UnifiedButton
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="p-1"
                aria-label={t('common.aria.clearSearch', { fallback: '清除搜索' })}
              >
                <X className="h-4 w-4" />
              </UnifiedButton>
          </div>
        )}
      </div>

      {/* 筛选器 */}
      {showFilters && (
        <div className="mt-2 flex flex-wrap gap-2">
          {['all', 'project', 'publication', 'skill', 'research'].map((category) => (
            <UnifiedButton
              key={category}
              variant={selectedCategory === category ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="text-xs"
            >
              {category === 'all' ? 'All' : (t(`common.categories.${category}`) as string)}
            </UnifiedButton>
          ))}
        </div>
      )}

      {/* 搜索结果下拉框 */}
      {isFocused && (query || (showHistory && searchHistory.length > 0)) && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {/* 搜索历史 */}
          {showHistory && query === '' && searchHistory.length > 0 && (
            <div className="p-3 border-b border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="h-4 w-4 mr-1" />
                  {t('common.searchHistoryTitle') as string}
                </div>
                <UnifiedButton
                  variant="ghost"
                  size="sm"
                  onClick={clearHistory}
                  className="text-xs"
                >
                  {t('common.clear') as string}
                </UnifiedButton>
              </div>
              {searchHistory.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer"
                  onClick={() => {
                    setQuery(item.query);
                    setShowResults(true);
                  }}
                >
                  <span className="text-sm">{item.query}</span>
                  <span className="text-xs text-gray-500">{item.results}{t('common.searchResults.items') as string}</span>
                </div>
              ))}
            </div>
          )}

          {/* 搜索结果 */}
          {query && searchResults.length > 0 && (
            <div className="p-2">
              {searchResults.map((result) => (
                <HoverCard key={result.id}>
                  <div
                    className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer transition-colors"
                    onClick={() => {
                      window.location.href = result.url;
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{getCategoryIcon(result.category)}</span>
                          <h4 className="font-medium text-sm text-gray-900 dark:text-white">
                            {result.title}
                          </h4>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                          {result.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(result.category)}`}>
                            {t(`common.categories.${result.category}`) as string}
                          </span>
                          <div className="flex items-center text-xs text-gray-500">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            {Math.round(result.relevance * 100)}% {t('common.match') as string}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </HoverCard>
              ))}
            </div>
          )}

          {/* 无结果 */}
          {query && searchResults.length === 0 && (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>{t('common.noResults') as string}</p>
              <p className="text-sm mt-1">{t('common.tryDifferentKeywords') as string}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// 搜索建议组件
export const SearchSuggestions: React.FC<{ 
  suggestions: string[];
  onSelect: (suggestion: string) => void;
  className?: string;
}> = ({ suggestions, onSelect, className = '' }) => {
  const { t } = useTranslation();
  
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 p-3 ${className}`}>
      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
        {t('common.searchSuggestions') as string}
      </div>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <UnifiedButton
            key={index}
            variant="outline"
            size="sm"
            onClick={() => onSelect(suggestion)}
            className="text-xs"
          >
            {suggestion}
          </UnifiedButton>
        ))}
      </div>
    </div>
  );
};

export default EnhancedSearch;
