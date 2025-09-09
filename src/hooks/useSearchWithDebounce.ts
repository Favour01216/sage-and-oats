/**
 * Search hook with debouncing for improved performance
 */

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseSearchWithDebounceOptions {
  delay?: number;
  minLength?: number;
  onSearch?: (query: string) => void;
}

interface UseSearchWithDebounceResult {
  query: string;
  debouncedQuery: string;
  setQuery: (query: string) => void;
  isDebouncing: boolean;
  clear: () => void;
}

/**
 * Custom hook for search with debouncing
 * @param initialQuery - Initial search query
 * @param options - Configuration options
 * @returns Search state and controls
 */
export function useSearchWithDebounce(
  initialQuery: string = '',
  options: UseSearchWithDebounceOptions = {}
): UseSearchWithDebounceResult {
  const {
    delay = 300, // 300ms default debounce delay
    minLength = 0,
    onSearch,
  } = options;
  
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [isDebouncing, setIsDebouncing] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  
  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);
  
  // Debounce query changes
  useEffect(() => {
    // Clear existing timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    // Skip debouncing for clearing the query
    if (query === '') {
      setDebouncedQuery('');
      setIsDebouncing(false);
      if (onSearch) {
        onSearch('');
      }
      return;
    }
    
    // Skip if query is too short
    if (query.length < minLength) {
      setIsDebouncing(false);
      return;
    }
    
    // Set debouncing state
    setIsDebouncing(true);
    
    // Set new timer
    debounceTimer.current = setTimeout(() => {
      setDebouncedQuery(query);
      setIsDebouncing(false);
      if (onSearch) {
        onSearch(query);
      }
    }, delay);
    
    // Cleanup
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [query, delay, minLength, onSearch]);
  
  // Clear search
  const clear = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
    setIsDebouncing(false);
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
  }, []);
  
  return {
    query,
    debouncedQuery,
    setQuery,
    isDebouncing,
    clear,
  };
}

/**
 * Hook for search filters with debouncing
 */
export interface SearchFilters {
  cuisine?: string[];
  tags?: string[];
  time?: { min?: number; max?: number };
  calories?: { min?: number; max?: number };
  diet?: string[];
}

interface UseSearchFiltersResult {
  filters: SearchFilters;
  debouncedFilters: SearchFilters;
  updateFilter: <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => void;
  clearFilters: () => void;
  isDebouncing: boolean;
}

export function useSearchFilters(
  initialFilters: SearchFilters = {},
  delay: number = 250
): UseSearchFiltersResult {
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [debouncedFilters, setDebouncedFilters] = useState<SearchFilters>(initialFilters);
  const [isDebouncing, setIsDebouncing] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  
  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);
  
  // Debounce filter changes
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    setIsDebouncing(true);
    
    debounceTimer.current = setTimeout(() => {
      setDebouncedFilters(filters);
      setIsDebouncing(false);
    }, delay);
    
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [filters, delay]);
  
  // Update a specific filter
  const updateFilter = useCallback(<K extends keyof SearchFilters>(
    key: K,
    value: SearchFilters[K]
  ) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);
  
  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({});
    setDebouncedFilters({});
    setIsDebouncing(false);
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
  }, []);
  
  return {
    filters,
    debouncedFilters,
    updateFilter,
    clearFilters,
    isDebouncing,
  };
}