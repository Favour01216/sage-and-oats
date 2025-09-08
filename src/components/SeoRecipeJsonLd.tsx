import { Recipe, HowTo, HowToStep, NutritionInformation, AggregateRating } from 'schema-dts'

interface SeoRecipeJsonLdProps {
  recipe: {
    id: string
    slug: string
    title: string
    intro: string | null
    hero_image_url: string | null
    yield: string | null
    total_minutes: number | null
    tags: string[] | null
    cuisine: string | null
    author_id: string | null
    avg_rating: number | null
    created_at: string
  }
  ingredients: Array<{
    line_text: string
    quantity_num: number | null
    unit: string | null
    item: string | null
  }>
  steps: Array<{
    step_number: number
    text: string
    timer_seconds: number | null
  }>
  nutrition?: {
    calories: number | null
    protein_g: number | null
    fat_g: number | null
    carbs_g: number | null
  }
  heartCount: number
}

export default function SeoRecipeJsonLd({
  recipe,
  ingredients,
  steps,
  nutrition,
  heartCount
}: SeoRecipeJsonLdProps) {
  // Transform ingredients to schema format
  const recipeIngredients = ingredients.map(ing => {
    let text = ing.line_text
    if (ing.quantity_num && ing.unit && ing.item) {
      text = `${ing.quantity_num} ${ing.unit} ${ing.item}`
    } else if (ing.quantity_num && ing.item) {
      text = `${ing.quantity_num} ${ing.item}`
    }
    return text
  })

  // Transform steps to HowTo format
  const howToSteps: HowToStep[] = steps.map(step => ({
    '@type': 'HowToStep',
    position: step.step_number,
    text: step.text,
    ...(step.timer_seconds && {
      totalTime: `PT${Math.floor(step.timer_seconds / 60)}M${step.timer_seconds % 60}S`
    })
  }))

  // Create nutrition schema if available
  let nutritionSchema: NutritionInformation | undefined
  if (nutrition) {
    nutritionSchema = {
      '@type': 'NutritionInformation',
      calories: nutrition.calories ? `${nutrition.calories} calories` : undefined,
      proteinContent: nutrition.protein_g ? `${nutrition.protein_g}g` : undefined,
      fatContent: nutrition.fat_g ? `${nutrition.fat_g}g` : undefined,
      carbohydrateContent: nutrition.carbs_g ? `${nutrition.carbs_g}g` : undefined,
    }
  }

  // Create aggregate rating if available
  let aggregateRating: AggregateRating | undefined
  if (recipe.avg_rating && recipe.avg_rating > 0) {
    aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: recipe.avg_rating,
      reviewCount: heartCount, // Using heart count as a proxy for reviews
      bestRating: 5,
      worstRating: 1
    }
  }

  // Create the main recipe schema
  const recipeSchema: Recipe = {
    '@type': 'Recipe',
    name: recipe.title,
    description: recipe.intro || `A delicious ${recipe.cuisine || 'recipe'} that takes ${recipe.total_minutes} minutes to prepare.`,
    image: recipe.hero_image_url ? [recipe.hero_image_url] : [],
    author: recipe.author_id ? { '@type': 'Person', '@id': `https://example.com/users/${recipe.author_id}` } : undefined,
    totalTime: recipe.total_minutes ? `PT${recipe.total_minutes}M` : undefined,
    recipeYield: recipe.yield || '4 servings',
    recipeIngredient: recipeIngredients,
    recipeInstructions: howToSteps,
    ...(aggregateRating && { aggregateRating }),
    ...(nutritionSchema && { nutrition: nutritionSchema }),
    ...(recipe.cuisine && { recipeCategory: recipe.cuisine }),
    ...(recipe.tags && recipe.tags.length > 0 && { keywords: recipe.tags.join(', ') }),
    datePublished: recipe.created_at,
    dateModified: recipe.created_at,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://example.com/recipe/${recipe.slug}`
    }
  }

  // Create HowTo schema for the cooking process
  const howToSchema: HowTo = {
    '@type': 'HowTo',
    name: `How to make ${recipe.title}`,
    description: `Step-by-step instructions for making ${recipe.title}`,
    image: recipe.hero_image_url ? [recipe.hero_image_url] : [],
    totalTime: recipe.total_minutes ? `PT${recipe.total_minutes}M` : undefined,
    step: howToSteps,
    ...(recipe.yield && {
      tool: [{
        '@type': 'HowToTool',
        name: 'Serving size'
      }]
    })
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(recipeSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(howToSchema)
        }}
      />
    </>
  )
}
