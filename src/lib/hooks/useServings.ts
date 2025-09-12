"use client";

import { useState, useEffect } from "react";

/**
 * Hook to manage servings with localStorage persistence per recipe
 */
export function useServings(recipeId: string, defaultServings: number = 4) {
  const [servings, setServings] = useState(defaultServings);

  // Load persisted servings on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storageKey = `recipe-servings-${recipeId}`;
      const stored = localStorage.getItem(storageKey);

      if (stored) {
        const parsedServings = parseInt(stored, 10);
        if (!isNaN(parsedServings) && parsedServings > 0 && parsedServings <= 20) {
          setServings(parsedServings);
        }
      }
    }
  }, [recipeId]);

  // Update servings and persist to localStorage
  const updateServings = (newServings: number) => {
    if (newServings < 1 || newServings > 20) return;

    setServings(newServings);

    if (typeof window !== "undefined") {
      const storageKey = `recipe-servings-${recipeId}`;
      localStorage.setItem(storageKey, newServings.toString());
    }
  };

  return [servings, updateServings] as const;
}
