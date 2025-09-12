import { useState, useEffect } from "react";
import { RecipeNormalized } from "./catalog";

interface SearchParams {
  q?: string;
  tags?: string[];
  cuisine?: string[];
  page?: number;
  perPage?: number;
  time?: { min?: number; max?: number };
  calories?: { min?: number; max?: number };
}

interface SearchResult {
  items: RecipeNormalized[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

interface UseExternalSearchResult {
  data: RecipeNormalized[] | null;
  total: number | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useExternalSearch(params: SearchParams): UseExternalSearchResult {
  const [data, setData] = useState<RecipeNormalized[] | null>(null);
  const [total, setTotal] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const searchParams = new URLSearchParams();

      if (params.q) searchParams.append("q", params.q);
      if (params.page) searchParams.append("page", params.page.toString());
      if (params.perPage) searchParams.append("perPage", params.perPage.toString());
      if (params.cuisine && params.cuisine.length > 0) {
        params.cuisine.forEach(c => searchParams.append("cuisine", c));
      }
      if (params.tags && params.tags.length > 0) {
        params.tags.forEach(tag => searchParams.append("tags[]", tag));
      }
      if (params.time?.min) {
        searchParams.append("timeMin", params.time.min.toString());
      }
      if (params.time?.max) {
        searchParams.append("time", params.time.max.toString());
      }
      if (params.calories?.min) {
        searchParams.append("calorieMin", params.calories.min.toString());
      }
      if (params.calories?.max) {
        searchParams.append("calorieMax", params.calories.max.toString());
      }

      const response = await fetch(`/api/catalog/search?${searchParams.toString()}`);

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`);
      }

      const result = await response.json();
      setData(result.items || []);
      setTotal(result.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setData(null);
      setTotal(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [
    params.q,
    params.page,
    params.perPage,
    JSON.stringify(params.cuisine),
    JSON.stringify(params.tags),
    JSON.stringify(params.time),
    JSON.stringify(params.calories),
  ]);

  return {
    data,
    total,
    isLoading,
    error,
    refetch: fetchData,
  };
}

export function useExternalRecipe({ idOrSlug }: { idOrSlug: string }) {
  const [data, setData] = useState<RecipeNormalized | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!idOrSlug) return;

    const fetchRecipe = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Try to fetch by ID first, then by slug if that fails
        const response = await fetch(`/api/catalog/recipe/${idOrSlug}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Recipe not found");
          }
          throw new Error(`Failed to fetch recipe: ${response.status}`);
        }

        const recipe = await response.json();
        setData(recipe);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipe();
  }, [idOrSlug]);

  return {
    data,
    isLoading,
    error,
  };
}
