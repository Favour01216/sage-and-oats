'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RecipeForm } from '@/src/components/admin/RecipeForm'
import { createClient } from '@/src/lib/supabase/client'

export default function NewRecipePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (data: any) => {
    setLoading(true)
    setError(null)
    
    try {
      const supabase = createClient()
      
      // Create recipe
      const { data: recipe, error: recipeError } = await supabase
        .from('recipes')
        .insert({
          title: data.title,
          slug: data.slug,
          intro: data.intro,
          yield: data.yield,
          total_minutes: data.total_minutes,
          difficulty: data.difficulty,
          tags: data.tags,
          cuisine: data.cuisine,
          hero_image_url: data.hero_image_url,
          status: data.status
        })
        .select()
        .single()

      if (recipeError) throw recipeError

      // Add ingredients
      if (data.ingredients?.length > 0) {
        const { error: ingredientsError } = await supabase
          .from('recipe_ingredients')
          .insert(
            data.ingredients.map((ing: any, idx: number) => ({
              recipe_id: recipe.id,
              ingredient_group: ing.group || null,
              ingredient_line: ing.line,
              display_order: idx
            }))
          )
        if (ingredientsError) throw ingredientsError
      }

      // Add steps
      if (data.steps?.length > 0) {
        const { error: stepsError } = await supabase
          .from('recipe_steps')
          .insert(
            data.steps.map((step: any, idx: number) => ({
              recipe_id: recipe.id,
              step_number: idx + 1,
              instruction: step.instruction,
              timer_seconds: step.timer_seconds || null
            }))
          )
        if (stepsError) throw stepsError
      }

      // If publishing, calculate nutrition and index to Algolia
      if (data.status === 'published') {
        // Calculate nutrition
        await fetch('/api/nutrition', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recipeId: recipe.id,
            ingredientLines: data.ingredients.map((i: any) => i.line),
            servings: parseInt(data.yield.match(/\d+/)?.[0] || '4')
          })
        })

        // Reindex to Algolia
        await fetch('/api/search/reindex', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ recipeId: recipe.id })
        })
      }

      router.push('/admin/recipes')
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-serif font-bold mb-8">Create New Recipe</h1>
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}
      <RecipeForm
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  )
}
