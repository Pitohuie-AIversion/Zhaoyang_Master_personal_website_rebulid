import { useState, useEffect, useCallback, useRef } from 'react';
import { searchService, SearchResult, SearchOptions } from '../../../../services/searchService';
import type { SearchFilters } from '../components';

export interface UseSmartSearchOptions {
  initialQuery?: string;
  debounceMs?: number;
}

export const useSmartSearch = ({
  initialQuery = '',
  debounceMs = 300
}: UseSmartSearchOptions = {}) => {
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

  // 清除搜索历史
  const clearSearchHistory = useCallback(() => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  }, []);

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
    }, debounceMs);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query, performSearch, updateSuggestions, debounceMs]);

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    performSearch(suggestion);
  };

  const handleHistoryClick = (historyItem: string) => {
    setQuery(historyItem);
    setShowHistory(false);
    performSearch(historyItem);
  };

  return {
    query,
    setQuery,
    results,
    suggestions,
    isLoading,
    showFilters,
    setShowFilters,
    filters,
    setFilters,
    searchHistory,
    showHistory,
    setShowHistory,
    performSearch,
    handleSuggestionClick,
    handleHistoryClick,
    clearSearchHistory
  };
};
