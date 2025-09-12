"use client";

import { useState, useEffect } from "react";
import { UnitSystem } from "../units/conversions";

/**
 * Hook to manage unit system preference with localStorage persistence
 */
export function useUnitSystem(defaultSystem: UnitSystem = "us") {
  const [unitSystem, setUnitSystem] = useState<UnitSystem>(defaultSystem);

  // Load persisted unit system on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("preferredUnitSystem") as UnitSystem;
      if (stored && (stored === "us" || stored === "metric")) {
        setUnitSystem(stored);
      }
    }
  }, []);

  // Update unit system and persist to localStorage
  const updateUnitSystem = (newSystem: UnitSystem) => {
    setUnitSystem(newSystem);

    if (typeof window !== "undefined") {
      localStorage.setItem("preferredUnitSystem", newSystem);
    }
  };

  const toggleUnitSystem = () => {
    const newSystem = unitSystem === "us" ? "metric" : "us";
    updateUnitSystem(newSystem);
  };

  return {
    unitSystem,
    setUnitSystem: updateUnitSystem,
    toggleUnitSystem,
  };
}
