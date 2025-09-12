"use client";

import { useState } from "react";
import { cn } from "@/src/lib/utils";

interface NutritionData {
  calories?: number | null;
  protein_g?: number | null;
  fat_g?: number | null;
  carbs_g?: number | null;
  fiber_g?: number | null;
  sugar_g?: number | null;
  sodium_mg?: number | null;
}

interface NutritionTableProps {
  nutrition: NutritionData;
  servings: number;
  baseServings: number;
  className?: string;
  showToggle?: boolean; // Option to show per-serving vs total toggle
}

export function NutritionTable({
  nutrition,
  servings,
  baseServings,
  className,
  showToggle = false,
}: NutritionTableProps) {
  const [showPerServing, setShowPerServing] = useState(true);

  // Calculate per-serving values (nutrition data is assumed to be totals for the recipe)
  const perServingFactor = 1 / baseServings;
  const totalFactor = servings / baseServings;

  function formatNutritionValue(value?: number | null, isPerServing: boolean = true): string {
    if (value === null || value === undefined) return "-";

    // Apply appropriate scaling
    const scaledValue = isPerServing
      ? value * perServingFactor // Convert total to per-serving
      : value * totalFactor; // Scale total for current servings

    // Format with appropriate precision
    if (scaledValue < 1) {
      return scaledValue.toFixed(1);
    } else if (scaledValue < 10) {
      return scaledValue.toFixed(1);
    } else {
      return Math.round(scaledValue).toString();
    }
  }

  const nutritionItems = [
    { label: "Calories", value: nutrition.calories, unit: "" },
    { label: "Protein", value: nutrition.protein_g, unit: "g" },
    { label: "Fat", value: nutrition.fat_g, unit: "g" },
    { label: "Carbohydrates", value: nutrition.carbs_g, unit: "g" },
    { label: "Fiber", value: nutrition.fiber_g, unit: "g" },
    { label: "Sugar", value: nutrition.sugar_g, unit: "g" },
    { label: "Sodium", value: nutrition.sodium_mg, unit: "mg" },
  ];

  // Check if we have any nutrition data
  const hasNutritionData = nutritionItems.some(
    item => item.value !== null && item.value !== undefined && item.value > 0,
  );

  if (!hasNutritionData) {
    return (
      <div className={cn("rounded-lg bg-surface p-6 dark:bg-surface-dark", className)}>
        <h3 className="mb-4 text-xl font-semibold text-text dark:text-text-dark">
          Nutrition Information
        </h3>
        <p className="text-sm italic text-muted dark:text-muted-dark">
          Nutrition estimate coming soon.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("rounded-lg bg-surface p-6 dark:bg-surface-dark", className)}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-text dark:text-text-dark">
          Nutrition Information
        </h3>
        {showToggle && (
          <button
            onClick={() => setShowPerServing(!showPerServing)}
            className="text-sm font-medium text-primary hover:text-primary/80"
          >
            {showPerServing ? "Show Total" : "Show Per Serving"}
          </button>
        )}
      </div>

      <p className="mb-4 text-sm text-muted dark:text-muted-dark">
        {showPerServing
          ? "Per serving"
          : `Total for ${servings} serving${servings !== 1 ? "s" : ""}`}
        {servings !== baseServings && (
          <span className="ml-1">
            (adjusted from {baseServings} serving{baseServings !== 1 ? "s" : ""})
          </span>
        )}
      </p>

      <div className="space-y-3">
        {nutritionItems.map(item => (
          <div
            key={item.label}
            className="flex items-center justify-between border-b border-border py-2 last:border-0 dark:border-border-dark"
          >
            <span className="font-medium text-text dark:text-text-dark">{item.label}</span>
            <span className="text-text dark:text-text-dark">
              {formatNutritionValue(item.value, showPerServing)}
              {item.unit && ` ${item.unit}`}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs italic text-muted dark:text-muted-dark">
        Nutritional information is an estimate and may vary based on exact ingredients used.
      </p>
    </div>
  );
}
