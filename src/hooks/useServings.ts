/**
 * Hook for managing recipe servings with localStorage persistence
 */

import { useState, useEffect, useCallback } from "react";

interface UseServingsResult {
  currentServings: number;
  baseServings: number;
  scaleFactor: number;
  updateServings: (newServings: number) => void;
  resetServings: () => void;
}

/**
 * Custom hook for managing recipe servings
 * @param slug - Recipe slug for localStorage key
 * @param defaultServings - Default number of servings
 * @returns Servings state and controls
 */
export function useServings(slug: string, defaultServings: number = 4): UseServingsResult {
  const [currentServings, setCurrentServings] = useState<number>(defaultServings);
  const [baseServings] = useState<number>(defaultServings);

  // Load persisted servings from localStorage
  useEffect(() => {
    if (!slug) return;

    try {
      const storageKey = `servings_${slug}`;
      const stored = localStorage.getItem(storageKey);

      if (stored) {
        const parsed = parseInt(stored, 10);
        if (!isNaN(parsed) && parsed >= 1) {
          setCurrentServings(parsed);
        }
      }
    } catch (error) {
      console.warn("Failed to load servings from localStorage:", error);
    }
  }, [slug]);

  // Update servings and persist to localStorage
  const updateServings = useCallback(
    (newServings: number) => {
      // Ensure minimum of 1 serving
      const validServings = Math.max(1, Math.round(newServings));
      setCurrentServings(validServings);

      // Persist to localStorage
      if (slug) {
        try {
          const storageKey = `servings_${slug}`;
          localStorage.setItem(storageKey, validServings.toString());
        } catch (error) {
          console.warn("Failed to save servings to localStorage:", error);
        }
      }
    },
    [slug],
  );

  // Reset to base servings
  const resetServings = useCallback(() => {
    updateServings(baseServings);
  }, [baseServings, updateServings]);

  // Calculate scale factor
  const scaleFactor = currentServings / baseServings;

  return {
    currentServings,
    baseServings,
    scaleFactor,
    updateServings,
    resetServings,
  };
}
