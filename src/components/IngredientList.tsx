"use client";

import { useState, useMemo } from "react";
import { cn } from "@/src/lib/utils";
import { processRecipeIngredients, type UnitSystem } from "@/src/lib/ingredient-parser";

interface Ingredient {
  line_text: string;
}

interface IngredientListProps {
  ingredients: Ingredient[];
  servings: number;
  baseServings: number;
  unitSystem?: UnitSystem;
  className?: string;
}

export function IngredientList({
  ingredients,
  servings,
  baseServings = 4,
  unitSystem = "us",
  className,
}: IngredientListProps) {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const processedIngredients = useMemo(() => {
    const ingredientLines = ingredients.map(ing => ing.line_text);
    return processRecipeIngredients(ingredientLines, baseServings, servings, unitSystem);
  }, [ingredients, baseServings, servings, unitSystem]);

  const toggleItem = (index: number) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(index.toString())) {
      newChecked.delete(index.toString());
    } else {
      newChecked.add(index.toString());
    }
    setCheckedItems(newChecked);
  };

  if (processedIngredients.length === 0) {
    return (
      <div className={cn("p-4 text-center text-muted", className)}>
        <p>No ingredients available</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="space-y-2">
        {processedIngredients.map((ingredient, index) => {
          const isChecked = checkedItems.has(index.toString());

          return (
            <div key={index} className="group flex items-start gap-3">
              <button
                onClick={() => toggleItem(index)}
                className={cn(
                  "mt-0.5 flex h-5 w-5 items-center justify-center rounded-md border-2 transition-colors",
                  isChecked ? "border-primary bg-primary" : "border-border hover:border-primary/50",
                )}
                aria-label={`${isChecked ? "Uncheck" : "Check"} ingredient`}
              >
                {isChecked && (
                  <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>

              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "text-sm leading-relaxed transition-colors",
                    isChecked ? "text-muted line-through" : "text-foreground",
                  )}
                >
                  {ingredient.formattedText}
                </p>
                {ingredient.originalText !== ingredient.formattedText && (
                  <p className="mt-1 text-xs text-muted">Original: {ingredient.originalText}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {checkedItems.size > 0 && (
        <div className="border-t border-border pt-4">
          <button
            onClick={() => setCheckedItems(new Set())}
            className="text-sm font-medium text-primary hover:text-primary/80"
          >
            Clear all ({checkedItems.size} checked)
          </button>
        </div>
      )}
    </div>
  );
}
