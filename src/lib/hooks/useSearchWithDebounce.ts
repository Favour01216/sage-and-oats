"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { RecipeNormalized } from "../catalog";

interface SearchParams {
  q?: string;
  tags?: string[];
  cuisine?: string[];
  page?: number;
  perPage?: number;
  time?: { min?: number; max?: number };
  calories?: { min?: number; max?: number };
}

interface UseSearchWithDebounceResult {
  data: RecipeNormalized[] | null;
  total: number | null;
  isLoading: boolean;
  error: string | null;
  isStale: boolean; // Indicates if current data doesn't match current params
  refetch: () => void;
}

/**
 * Enhanced search hook with debouncing and better flicker prevention
 */
export function useSearchWithDebounce(
  params: SearchParams,
  debounceMs: number = 300,
): UseSearchWithDebounceResult {
  const [data, setData] = useState<RecipeNormalized[] | null>(null);
  const [total, setTotal] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isStale, setIsStale] = useState(false);

  // Keep track of the last successful search params to detect staleness
  const lastSuccessfulParamsRef = useRef<string>("");
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Serialize params for comparison (more stable than JSON.stringify)
  const serializeParams = useCallback((p: SearchParams): string => {
    const parts = [
      p.q || "",
      (p.tags || []).sort().join(","),
      (p.cuisine || []).sort().join(","),
      p.page?.toString() || "1",
      p.perPage?.toString() || "24",
      p.time?.min?.toString() || "",
      p.time?.max?.toString() || "",
      p.calories?.min?.toString() || "",
      p.calories?.max?.toString() || "",
    ];
    return parts.join("|");
  }, []);

  const fetchData = useCallback(
    async (searchParams: SearchParams, signal: AbortSignal) => {
      try {
        const urlParams = new URLSearchParams();

        if (searchParams.q) urlParams.append("q", searchParams.q);
        if (searchParams.page) urlParams.append("page", searchParams.page.toString());
        if (searchParams.perPage) urlParams.append("perPage", searchParams.perPage.toString());

        if (searchParams.cuisine && searchParams.cuisine.length > 0) {
          searchParams.cuisine.forEach(c => urlParams.append("cuisine", c));
        }
        if (searchParams.tags && searchParams.tags.length > 0) {
          searchParams.tags.forEach(tag => urlParams.append("tags[]", tag));
        }
        if (searchParams.time?.min) {
          urlParams.append("timeMin", searchParams.time.min.toString());
        }
        if (searchParams.time?.max) {
          urlParams.append("time", searchParams.time.max.toString());
        }
        if (searchParams.calories?.min) {
          urlParams.append("calorieMin", searchParams.calories.min.toString());
        }
        if (searchParams.calories?.max) {
          urlParams.append("calorieMax", searchParams.calories.max.toString());
        }

        const response = await fetch(`/api/catalog/search?${urlParams.toString()}`, { signal });

        if (!response.ok) {
          throw new Error(`Search failed: ${response.status}`);
        }

        const result = await response.json();

        if (!signal.aborted) {
          setData(result.items || []);
          setTotal(result.total || 0);
          setError(null);
          setIsStale(false);
          lastSuccessfulParamsRef.current = serializeParams(searchParams);
        }
      } catch (err) {
        if (!signal.aborted) {
          const errorMessage = err instanceof Error ? err.message : "Unknown error";
          setError(errorMessage);
          // Don't clear data on error, keep showing previous results
          setIsStale(true);
        }
      }
    },
    [serializeParams],
  );

  const debouncedSearch = useCallback(
    (searchParams: SearchParams) => {
      // Clear any existing timeout
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      // Abort any ongoing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Check if data is stale
      const currentParamString = serializeParams(searchParams);
      const isCurrentlyStale = currentParamString !== lastSuccessfulParamsRef.current;
      setIsStale(isCurrentlyStale);

      // Set loading state immediately for user feedback
      setIsLoading(true);
      setError(null);

      // Debounce the actual search
      debounceTimeoutRef.current = setTimeout(async () => {
        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        await fetchData(searchParams, abortController.signal);

        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      }, debounceMs);
    },
    [debounceMs, fetchData, serializeParams],
  );

  // Manual refetch function
  const refetch = useCallback(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setIsLoading(true);
    setError(null);

    fetchData(params, abortController.signal).then(() => {
      if (!abortController.signal.aborted) {
        setIsLoading(false);
      }
    });
  }, [params, fetchData]);

  // Effect to trigger search when params change
  useEffect(() => {
    debouncedSearch(params);

    // Cleanup function
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [
    params.q,
    params.page,
    params.perPage,
    ...(params.tags || []),
    ...(params.cuisine || []),
    params.time?.min,
    params.time?.max,
    params.calories?.min,
    params.calories?.max,
    debouncedSearch,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    data,
    total,
    isLoading,
    error,
    isStale,
    refetch,
  };
}
