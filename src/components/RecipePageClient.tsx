"use client";

import { useState } from "react";
import Link from "next/link";
import { ChefHat } from "lucide-react";
import { RecipeContent } from "@/src/components/RecipeContent";
import { ServingsControl } from "@/src/components/ServingsControl";
import { UnitToggle } from "@/src/components/UnitToggle";
import { HeartButton } from "@/src/components/HeartButton";
import Button from "@/src/components/ui/Button";
import { type UnitSystem } from "@/src/lib/ingredient-parser";

interface Ingredient {
  line_text: string;
}

interface Step {
  text: string;
  timer_seconds?: number | null;
}

interface Nutrition {
  calories?: number;
  protein_g?: number;
  fat_g?: number;
  carbs_g?: number;
}

interface RecipePageClientProps {
  recipe: {
    id: string;
    title: string;
    imageUrl?: string;
    tags: string[];
    cuisine?: string;
    total_minutes?: number;
    avg_rating?: number | null;
    ingredients: Ingredient[];
    steps: Step[];
    nutrition?: Nutrition;
    source_url?: string | null;
  };
  heartCount: number;
  defaultServings?: number;
}

export function RecipePageClient({
  recipe,
  heartCount,
  defaultServings = 4,
}: RecipePageClientProps) {
  const [servings, setServings] = useState(defaultServings);
  const [unitSystem, setUnitSystem] = useState<UnitSystem>("us");

  // Check if this recipe has useful steps for cook mode
  const hasDetailedSteps =
    recipe.steps &&
    recipe.steps.length > 1 &&
    !recipe.steps[0]?.text?.includes("Visit the source for detailed cooking instructions");

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Main Content */}
      <article className="lg:col-span-2">
        <div className="prose prose-lg max-w-none">
          {/* Interactive Recipe Content */}
          <RecipeContent
            ingredients={recipe.ingredients}
            steps={recipe.steps}
            sourceUrl={recipe.source_url}
            totalTime={recipe.total_minutes}
            defaultServings={defaultServings}
            servings={servings}
            onServingsChange={setServings}
            unitSystem={unitSystem}
            onUnitSystemChange={setUnitSystem}
          />

          {/* Nutrition */}
          {recipe.nutrition && (
            <>
              <h2>Nutrition (per serving)</h2>
              <div className="not-prose rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                  {recipe.nutrition.calories && (
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-gray-100">Calories</div>
                      <div className="text-gray-600 dark:text-gray-400">
                        {Math.round((recipe.nutrition.calories * servings) / defaultServings)}
                      </div>
                    </div>
                  )}
                  {recipe.nutrition.protein_g && (
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-gray-100">Protein</div>
                      <div className="text-gray-600 dark:text-gray-400">
                        {Math.round((recipe.nutrition.protein_g * servings) / defaultServings)}g
                      </div>
                    </div>
                  )}
                  {recipe.nutrition.carbs_g && (
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-gray-100">Carbs</div>
                      <div className="text-gray-600 dark:text-gray-400">
                        {Math.round((recipe.nutrition.carbs_g * servings) / defaultServings)}g
                      </div>
                    </div>
                  )}
                  {recipe.nutrition.fat_g && (
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-gray-100">Fat</div>
                      <div className="text-gray-600 dark:text-gray-400">
                        {Math.round((recipe.nutrition.fat_g * servings) / defaultServings)}g
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </article>

      {/* Sticky Sidebar */}
      <aside className="lg:col-span-1">
        <div className="sticky top-24 space-y-6">
          {/* Action Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="space-y-4">
              {/* Only show cook mode for recipes with detailed steps */}
              {hasDetailedSteps && (
                <Link href={`/cook/${recipe.id}`}>
                  <Button size="lg" className="w-full gap-2">
                    <ChefHat className="h-5 w-5" />
                    Start Cook Mode
                  </Button>
                </Link>
              )}

              <HeartButton
                recipeId={recipe.id}
                initialCount={heartCount}
                size="lg"
                className="w-full justify-center border border-gray-300 bg-white hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700"
              />

              {/* Servings Control */}
              <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
                <ServingsControl servings={servings} onServingsChange={setServings} />
              </div>

              {/* Unit Toggle */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Units
                </label>
                <UnitToggle defaultSystem={unitSystem} onSystemChange={setUnitSystem} />
              </div>

              {/* Disclaimer */}
              <p className="border-t border-gray-200 pt-4 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
                Nutrition values are estimates. See our{" "}
                <a href="/legal/nutrition-disclaimer" className="text-primary hover:underline">
                  Nutrition Disclaimer
                </a>
              </p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
