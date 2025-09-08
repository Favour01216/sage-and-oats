'use client'

import { cn } from '@/src/lib/utils'

interface NutritionData {
  calories?: number | null
  protein_g?: number | null
  fat_g?: number | null
  carbs_g?: number | null
  fiber_g?: number | null
  sugar_g?: number | null
  sodium_mg?: number | null
}

interface NutritionTableProps {
  nutrition: NutritionData
  servings: number
  baseServings: number
  className?: string
}

export function NutritionTable({ 
  nutrition, 
  servings, 
  baseServings,
  className 
}: NutritionTableProps) {
  const scaleFactor = servings / baseServings

  function scaleValue(value?: number | null): string {
    if (value === null || value === undefined) return '-'
    const scaled = value * scaleFactor
    return scaled % 1 === 0 ? scaled.toString() : scaled.toFixed(1)
  }

  const nutritionItems = [
    { label: 'Calories', value: nutrition.calories, unit: '' },
    { label: 'Protein', value: nutrition.protein_g, unit: 'g' },
    { label: 'Fat', value: nutrition.fat_g, unit: 'g' },
    { label: 'Carbohydrates', value: nutrition.carbs_g, unit: 'g' },
    { label: 'Fiber', value: nutrition.fiber_g, unit: 'g' },
    { label: 'Sugar', value: nutrition.sugar_g, unit: 'g' },
    { label: 'Sodium', value: nutrition.sodium_mg, unit: 'mg' },
  ]

  return (
    <div className={cn("bg-surface dark:bg-surface-dark rounded-lg p-6", className)}>
      <h3 className="text-xl font-semibold text-text dark:text-text-dark mb-4">
        Nutrition Information
      </h3>
      <p className="text-sm text-muted dark:text-muted-dark mb-4">
        Per serving ({servings === baseServings ? 'as written' : `adjusted for ${servings} servings`})
      </p>
      
      <div className="space-y-3">
        {nutritionItems.map((item) => (
          <div 
            key={item.label}
            className="flex items-center justify-between py-2 border-b border-border dark:border-border-dark last:border-0"
          >
            <span className="text-text dark:text-text-dark font-medium">
              {item.label}
            </span>
            <span className="text-text dark:text-text-dark">
              {scaleValue(item.value)}{item.unit && ` ${item.unit}`}
            </span>
          </div>
        ))}
      </div>
      
      <p className="text-xs text-muted dark:text-muted-dark mt-4 italic">
        Nutritional information is an estimate and may vary based on exact ingredients used.
      </p>
    </div>
  )
}
