import { createClient } from '@supabase/supabase-js';
import { algoliasearch } from 'algoliasearch';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Initialize Algolia only if credentials are available
let algoliaClient: any = null

if (process.env.NEXT_PUBLIC_ALGOLIA_APP_ID && process.env.ALGOLIA_ADMIN_API_KEY) {
  algoliaClient = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    process.env.ALGOLIA_ADMIN_API_KEY
  )
  console.log('✅ Algolia client initialized')
} else {
  console.log('⚠️ Algolia credentials not found - skipping search indexing')
}

const recipes = [
  {
    slug: 'lemon-herb-roasted-chicken',
    title: 'Lemon Herb Roasted Chicken',
    intro: 'A simple yet elegant roasted chicken with bright lemon and fresh herbs.',
    hero_image_url: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800',
    tags: ['dinner', 'gluten-free', 'high-protein'],
    yield: '4 servings',
    total_minutes: 75,
    difficulty: 'easy',
    avg_rating: 4.8,
    review_count: 24,
    ingredients: [
      { group_label: null, line_text: '1 whole chicken (4 lbs)', quantity_num: 1, unit: 'whole', item: 'chicken' },
      { group_label: null, line_text: '2 lemons, halved', quantity_num: 2, unit: null, item: 'lemons' },
      { group_label: null, line_text: '4 garlic cloves, minced', quantity_num: 4, unit: null, item: 'garlic cloves' },
      { group_label: null, line_text: '2 tbsp olive oil', quantity_num: 2, unit: 'tbsp', item: 'olive oil' },
      { group_label: null, line_text: 'Fresh rosemary and thyme', quantity_num: null, unit: null, item: 'herbs' },
      { group_label: null, line_text: 'Salt and pepper to taste', quantity_num: null, unit: null, item: 'seasonings' }
    ],
    steps: [
      { step_number: 1, text: 'Preheat oven to 425°F (220°C). Pat chicken dry with paper towels.', timer_seconds: null },
      { step_number: 2, text: 'Mix olive oil, minced garlic, and chopped herbs in a bowl.', timer_seconds: null },
      { step_number: 3, text: 'Rub the herb mixture all over the chicken, including under the skin.', timer_seconds: null },
      { step_number: 4, text: 'Stuff the cavity with lemon halves and extra herbs.', timer_seconds: null },
      { step_number: 5, text: 'Roast for 1 hour 15 minutes until golden and internal temp reaches 165°F.', timer_seconds: 4500 },
      { step_number: 6, text: 'Let rest for 10 minutes before carving.', timer_seconds: 600 }
    ],
    nutrition: {
      calories: 320,
      protein_g: 42,
      fat_g: 15,
      carbs_g: 3,
      fiber_g: 1,
      sugar_g: 1,
      sodium_mg: 180
    }
  },
  {
    slug: 'creamy-mushroom-risotto',
    title: 'Creamy Mushroom Risotto',
    intro: 'A rich and comforting Italian classic with earthy mushrooms and parmesan.',
    hero_image_url: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800',
    tags: ['dinner', 'vegetarian', 'comfort-food'],
    yield: '4 servings',
    total_minutes: 35,
    difficulty: 'medium',
    avg_rating: 4.6,
    review_count: 18,
    ingredients: [
      { group_label: null, line_text: '1½ cups arborio rice', quantity_num: 1.5, unit: 'cups', item: 'arborio rice' },
      { group_label: null, line_text: '8 oz mixed mushrooms, sliced', quantity_num: 8, unit: 'oz', item: 'mushrooms' },
      { group_label: null, line_text: '4 cups vegetable broth, warm', quantity_num: 4, unit: 'cups', item: 'vegetable broth' },
      { group_label: null, line_text: '½ cup white wine', quantity_num: 0.5, unit: 'cup', item: 'white wine' },
      { group_label: null, line_text: '1 onion, finely diced', quantity_num: 1, unit: null, item: 'onion' },
      { group_label: null, line_text: '½ cup parmesan, grated', quantity_num: 0.5, unit: 'cup', item: 'parmesan' },
      { group_label: null, line_text: '3 tbsp butter', quantity_num: 3, unit: 'tbsp', item: 'butter' }
    ],
    steps: [
      { step_number: 1, text: 'Sauté mushrooms in 1 tbsp butter until golden. Set aside.', timer_seconds: null },
      { step_number: 2, text: 'In the same pan, sauté onion until translucent.', timer_seconds: null },
      { step_number: 3, text: 'Add rice and toast for 2 minutes, stirring constantly.', timer_seconds: 120 },
      { step_number: 4, text: 'Add wine and stir until absorbed.', timer_seconds: null },
      { step_number: 5, text: 'Add broth one ladle at a time, stirring until absorbed before adding more.', timer_seconds: 1200 },
      { step_number: 6, text: 'Stir in mushrooms, remaining butter, and parmesan. Season to taste.', timer_seconds: null }
    ],
    nutrition: {
      calories: 380,
      protein_g: 12,
      fat_g: 14,
      carbs_g: 52,
      fiber_g: 3,
      sugar_g: 4,
      sodium_mg: 420
    }
  },
  {
    slug: 'thai-green-curry',
    title: 'Thai Green Curry',
    intro: 'A vibrant and aromatic curry with vegetables and coconut milk.',
    hero_image_url: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800',
    tags: ['dinner', 'vegan', 'gluten-free', 'spicy'],
    yield: '4 servings',
    total_minutes: 30,
    difficulty: 'easy',
    avg_rating: 4.7,
    review_count: 31,
    ingredients: [
      { group_label: null, line_text: '2 tbsp green curry paste', quantity_num: 2, unit: 'tbsp', item: 'green curry paste' },
      { group_label: null, line_text: '1 can (14 oz) coconut milk', quantity_num: 14, unit: 'oz', item: 'coconut milk' },
      { group_label: null, line_text: '2 cups mixed vegetables', quantity_num: 2, unit: 'cups', item: 'vegetables' },
      { group_label: null, line_text: '1 block firm tofu, cubed', quantity_num: 1, unit: 'block', item: 'tofu' },
      { group_label: null, line_text: 'Thai basil leaves', quantity_num: null, unit: null, item: 'thai basil' },
      { group_label: null, line_text: '1 tbsp soy sauce', quantity_num: 1, unit: 'tbsp', item: 'soy sauce' },
      { group_label: null, line_text: '1 tsp brown sugar', quantity_num: 1, unit: 'tsp', item: 'brown sugar' }
    ],
    steps: [
      { step_number: 1, text: 'Heat oil in a large pan and fry curry paste for 1 minute.', timer_seconds: 60 },
      { step_number: 2, text: 'Add coconut milk and bring to a simmer.', timer_seconds: null },
      { step_number: 3, text: 'Add tofu and harder vegetables, simmer for 10 minutes.', timer_seconds: 600 },
      { step_number: 4, text: 'Add remaining vegetables and cook for 5 more minutes.', timer_seconds: 300 },
      { step_number: 5, text: 'Stir in soy sauce, sugar, and basil leaves. Serve with rice.', timer_seconds: null }
    ],
    nutrition: {
      calories: 290,
      protein_g: 14,
      fat_g: 20,
      carbs_g: 18,
      fiber_g: 4,
      sugar_g: 8,
      sodium_mg: 380
    }
  }
]

async function seedDatabase() {
  console.log('Starting database seed...')

  const algoliaRecords = []

  for (const recipeData of recipes) {
    const { ingredients, steps, nutrition, ...recipe } = recipeData

    // Insert recipe
    const { data: insertedRecipe, error: recipeError } = await supabase
      .from('recipes')
      .insert(recipe)
      .select()
      .single()

    if (recipeError) {
      console.error('Error inserting recipe:', recipeError)
      continue
    }

    console.log(`Inserted recipe: ${insertedRecipe.title}`)

    // Insert ingredients
    const ingredientsWithRecipeId = ingredients.map(ing => ({
      ...ing,
      recipe_id: insertedRecipe.id
    }))

    const { error: ingredientsError } = await supabase
      .from('recipe_ingredients')
      .insert(ingredientsWithRecipeId)

    if (ingredientsError) {
      console.error('Error inserting ingredients:', ingredientsError)
    }

    // Insert steps
    const stepsWithRecipeId = steps.map(step => ({
      ...step,
      recipe_id: insertedRecipe.id
    }))

    const { error: stepsError } = await supabase
      .from('recipe_steps')
      .insert(stepsWithRecipeId)

    if (stepsError) {
      console.error('Error inserting steps:', stepsError)
    }

    // Insert nutrition
    const { error: nutritionError } = await supabase
      .from('recipe_nutrition')
      .insert({
        ...nutrition,
        recipe_id: insertedRecipe.id
      })

    if (nutritionError) {
      console.error('Error inserting nutrition:', nutritionError)
    }

    // Prepare Algolia record
    algoliaRecords.push({
      objectID: insertedRecipe.id,
      id: insertedRecipe.id,
      slug: insertedRecipe.slug,
      title: insertedRecipe.title,
      tags: insertedRecipe.tags || [],
      cuisine: insertedRecipe.cuisine || '',
      total_minutes: insertedRecipe.total_minutes || 0,
      avg_rating: insertedRecipe.avg_rating || 0,
      calories_per_serving: nutrition.calories || 0,
      ingredients_text: ingredients.map(i => i.line_text).join(' '),
      created_at: Math.floor(new Date(insertedRecipe.created_at).getTime() / 1000),
      hero_image_url: insertedRecipe.hero_image_url,
      intro: insertedRecipe.intro
    })
  }

  // Index to Algolia if client is available
  if (algoliaClient && algoliaRecords.length > 0) {
    console.log('Indexing recipes to Algolia...')
    try {
      await algoliaClient.saveObjects({ indexName: 'recipes', objects: algoliaRecords })
      console.log('Successfully indexed recipes to Algolia')
    } catch (error) {
      console.error('Error indexing to Algolia:', error)
    }
  }

  console.log('Database seed completed!')
}

seedDatabase().catch(console.error)
