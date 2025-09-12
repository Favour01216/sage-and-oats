/**
 * Hook for managing unit system preference (US vs Metric)
 */

import { useState, useEffect, useCallback } from "react";

export type UnitSystem = "us" | "metric";

interface UseUnitSystemResult {
  unitSystem: UnitSystem;
  toggleUnitSystem: () => void;
  setUnitSystem: (system: UnitSystem) => void;
}

/**
 * Custom hook for managing unit system preference
 * @param defaultSystem - Default unit system
 * @returns Unit system state and controls
 */
export function useUnitSystem(defaultSystem: UnitSystem = "us"): UseUnitSystemResult {
  const [unitSystem, setUnitSystemState] = useState<UnitSystem>(defaultSystem);

  // Load preference from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("unitSystem");
      if (stored === "us" || stored === "metric") {
        setUnitSystemState(stored);
      } else {
        // Try to detect based on user locale
        const locale = navigator.language || "en-US";
        // Use metric for most countries except US, Liberia, Myanmar
        const usCountries = ["US", "LR", "MM"];
        const countryCode = locale.split("-")[1];
        const detectedSystem = countryCode && usCountries.includes(countryCode) ? "us" : "metric";
        setUnitSystemState(detectedSystem);
      }
    } catch (error) {
      console.warn("Failed to load unit system preference:", error);
    }
  }, []);

  // Set unit system and persist to localStorage
  const setUnitSystem = useCallback((system: UnitSystem) => {
    setUnitSystemState(system);
    try {
      localStorage.setItem("unitSystem", system);
    } catch (error) {
      console.warn("Failed to save unit system preference:", error);
    }
  }, []);

  // Toggle between US and Metric
  const toggleUnitSystem = useCallback(() => {
    const newSystem = unitSystem === "us" ? "metric" : "us";
    setUnitSystem(newSystem);
  }, [unitSystem, setUnitSystem]);

  return {
    unitSystem,
    toggleUnitSystem,
    setUnitSystem,
  };
}
