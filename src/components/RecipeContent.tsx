"use client";

import { IngredientList } from "@/src/components/IngredientList";
import { StepList } from "@/src/components/StepList";
import { type UnitSystem } from "@/src/lib/ingredient-parser";

interface Ingredient {
  line_text: string;
}

interface Step {
  text: string;
  timer_seconds?: number | null;
}

interface RecipeContentProps {
  ingredients: Ingredient[];
  steps: Step[];
  sourceUrl?: string | null;
  totalTime?: number | null;
  defaultServings?: number;
  servings?: number;
  onServingsChange?: (servings: number) => void;
  unitSystem?: UnitSystem;
  onUnitSystemChange?: (system: UnitSystem) => void;
}

export function RecipeContent({
  ingredients,
  steps,
  sourceUrl,
  totalTime,
  defaultServings = 4,
  servings = defaultServings,
  onServingsChange,
  unitSystem = "us",
  onUnitSystemChange,
}: RecipeContentProps) {
  return (
    <div className="space-y-8">
      {/* Ingredients */}
      <div>
        <h2 className="mb-4 font-serif text-2xl font-bold">Ingredients</h2>
        <IngredientList
          ingredients={ingredients}
          servings={servings}
          baseServings={defaultServings}
          unitSystem={unitSystem}
        />
      </div>

      {/* Instructions */}
      <div>
        <h2 className="mb-4 font-serif text-2xl font-bold">Instructions</h2>
        <StepList steps={steps} sourceUrl={sourceUrl} totalTime={totalTime || undefined} />
      </div>
    </div>
  );
}
