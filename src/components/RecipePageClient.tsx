'use client'

import { useState } from 'react'
import { ChefHat } from 'lucide-react'
import { RecipeContent } from '@/src/components/RecipeContent'
import { ServingsControl } from '@/src/components/ServingsControl'
import { UnitToggle } from '@/src/components/UnitToggle'
import { HeartButton } from '@/src/components/HeartButton'
import Button from '@/src/components/ui/Button'
import { type UnitSystem } from '@/src/lib/ingredient-parser'

interface Ingredient {
  line_text: string
}

interface Step {
  text: string
  timer_seconds?: number | null
}

interface Nutrition {
  calories?: number
  protein_g?: number
  fat_g?: number
  carbs_g?: number
}

interface RecipePageClientProps {
  recipe: {
    id: string
    title: string
    imageUrl?: string
    tags: string[]
    cuisine?: string
    total_minutes?: number
    avg_rating?: number | null
    ingredients: Ingredient[]
    steps: Step[]
    nutrition?: Nutrition
    source_url?: string | null
  }
  heartCount: number
  defaultServings?: number
}

export function RecipePageClient({ 
  recipe, 
  heartCount, 
  defaultServings = 4 
}: RecipePageClientProps) {
  const [servings, setServings] = useState(defaultServings)
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('us')

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
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 not-prose">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  {recipe.nutrition.calories && (
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-gray-100">
                        Calories
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">
                        {Math.round((recipe.nutrition.calories * servings) / defaultServings)}
                      </div>
                    </div>
                  )}
                  {recipe.nutrition.protein_g && (
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-gray-100">
                        Protein
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">
                        {Math.round((recipe.nutrition.protein_g * servings) / defaultServings)}g
                      </div>
                    </div>
                  )}
                  {recipe.nutrition.carbs_g && (
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-gray-100">
                        Carbs
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">
                        {Math.round((recipe.nutrition.carbs_g * servings) / defaultServings)}g
                      </div>
                    </div>
                  )}
                  {recipe.nutrition.fat_g && (
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-gray-100">
                        Fat
                      </div>
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
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <div className="space-y-4">
              <a href={`/cook/${recipe.id}`}>
                <Button size="lg" className="w-full gap-2">
                  <ChefHat className="w-5 h-5" />
                  Start Cook Mode
                </Button>
              </a>

              <HeartButton
                recipeId={recipe.id}
                initialCount={heartCount}
                size="lg"
                className="w-full justify-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              />

              {/* Servings Control */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <ServingsControl 
                  servings={servings} 
                  onServingsChange={setServings}
                />
              </div>

              {/* Unit Toggle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Units
                </label>
                <UnitToggle 
                  defaultSystem={unitSystem}
                  onSystemChange={setUnitSystem}
                />
              </div>

              {/* Disclaimer */}
              <p className="text-xs text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
                Nutrition values are estimates. See our{" "}
                <a
                  href="/legal/nutrition-disclaimer"
                  className="text-primary hover:underline"
                >
                  Nutrition Disclaimer
                </a>
              </p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}
