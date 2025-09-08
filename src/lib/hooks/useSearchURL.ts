'use client'

import { useCallback, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface SearchURLParams {
  q?: string;
  tags?: string[];
  cuisine?: string[];
  page?: number;
  sortBy?: string;
  time?: { min?: number; max?: number };
  calories?: { min?: number; max?: number };
}

/**
 * Hook for managing search URL state with debouncing to prevent loops
 */
export function useSearchURL(debounceMs: number = 250) {
  const router = useRouter();
  const pathname = usePathname();
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateRef = useRef<string>('');

  const updateURL = useCallback((newParams: SearchURLParams) => {
    // Clear any existing timeout
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    // Create URL params
    const params = new URLSearchParams();
    
    if (newParams.q?.trim()) {
      params.set("q", newParams.q.trim());
    }
    
    newParams.tags?.forEach((tag) => {
      if (tag.trim()) params.append("tags", tag.trim());
    });
    
    newParams.cuisine?.forEach((c) => {
      if (c.trim()) params.append("cuisine", c.trim());
    });
    
    if (newParams.time?.max) {
      params.set("time", newParams.time.max.toString());
    }
    
    if (newParams.sortBy && newParams.sortBy !== "relevance") {
      params.set("sortBy", newParams.sortBy);
    }
    
    if (newParams.page && newParams.page > 1) {
      params.set("page", newParams.page.toString());
    }

    const newURL = `${pathname}?${params.toString()}`;
    
    // Prevent unnecessary updates
    if (newURL === lastUpdateRef.current) {
      return;
    }

    // Debounce the URL update
    updateTimeoutRef.current = setTimeout(() => {
      if (newURL !== lastUpdateRef.current) {
        lastUpdateRef.current = newURL;
        router.push(newURL, { scroll: false }); // Prevent scroll to top
      }
    }, debounceMs);
  }, [router, pathname, debounceMs]);

  // Immediate update for page changes (no debounce needed)
  const updatePageImmediately = useCallback((page: number) => {
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    const currentParams = new URLSearchParams(window.location.search);
    
    if (page > 1) {
      currentParams.set('page', page.toString());
    } else {
      currentParams.delete('page');
    }

    const newURL = `${pathname}?${currentParams.toString()}`;
    lastUpdateRef.current = newURL;
    router.push(newURL, { scroll: false });
  }, [router, pathname]);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
  }, []);

  return {
    updateURL,
    updatePageImmediately,
    cleanup,
  };
}