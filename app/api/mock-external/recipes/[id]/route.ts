import { NextRequest, NextResponse } from "next/server";

// Mock external API endpoint for getting individual recipes
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Mock individual recipe data
  const mockRecipes: Record<string, any> = {
    "ext-001": {
      id: "ext-001",
      slug: "classic-margherita-pizza",
      title: "Mock External Recipe: Classic Margherita Pizza",
      image_url: "https://picsum.photos/800/600?random=1",
      description:
        "A classic Italian pizza with fresh mozzarella, basil, and marinara sauce. Simple yet absolutely delicious!",
      ingredients: [
        { text: "1 pound pizza dough" },
        { text: "1/2 cup marinara sauce" },
        { text: "8 oz fresh mozzarella, sliced" },
        { text: "Fresh basil leaves" },
        { text: "2 tbsp olive oil" },
        { text: "Salt and pepper to taste" },
      ],
      steps: [
        { text: "Preheat oven to 475°F (245°C)", timer_seconds: 300 },
        { text: "Roll out pizza dough on floured surface", timer_seconds: 180 },
        { text: "Spread marinara sauce evenly over dough", timer_seconds: 120 },
        { text: "Add mozzarella slices and basil leaves", timer_seconds: 180 },
        { text: "Drizzle with olive oil and season", timer_seconds: 60 },
        { text: "Bake for 12-15 minutes until golden", timer_seconds: 900 },
      ],
      tags: ["Italian", "Pizza", "Vegetarian", "Quick"],
      cuisine: "Italian",
      total_time: 30,
      prep_time: 15,
      cook_time: 15,
      rating: 4.8,
      nutrition: {
        calories: 285,
        protein_g: 12,
        carbs_g: 36,
        fat_g: 11,
        fiber_g: 2,
        sugar_g: 4,
      },
      created_at: "2024-01-15T10:30:00Z",
      updated_at: "2024-01-15T10:30:00Z",
    },
    "ext-002": {
      id: "ext-002",
      slug: "chocolate-chip-cookies",
      title: "Mock External Recipe: Chocolate Chip Cookies",
      image_url: "https://picsum.photos/800/600?random=2",
      description:
        "Soft, chewy chocolate chip cookies that are perfect for any occasion. A classic American treat!",
      ingredients: [
        { text: "2 1/4 cups all-purpose flour" },
        { text: "1 tsp baking soda" },
        { text: "1 tsp salt" },
        { text: "1 cup butter, softened" },
        { text: "3/4 cup brown sugar" },
        { text: "3/4 cup white sugar" },
        { text: "2 large eggs" },
        { text: "2 tsp vanilla extract" },
        { text: "2 cups chocolate chips" },
      ],
      steps: [
        { text: "Preheat oven to 375°F (190°C)", timer_seconds: 300 },
        {
          text: "Mix flour, baking soda, and salt in bowl",
          timer_seconds: 120,
        },
        { text: "Cream butter and sugars until fluffy", timer_seconds: 300 },
        { text: "Beat in eggs and vanilla", timer_seconds: 120 },
        { text: "Gradually mix in flour mixture", timer_seconds: 180 },
        { text: "Stir in chocolate chips", timer_seconds: 60 },
        { text: "Drop spoonfuls on baking sheet", timer_seconds: 240 },
        { text: "Bake 9-11 minutes until golden", timer_seconds: 600 },
      ],
      tags: ["Dessert", "Cookies", "Sweet", "Baking"],
      cuisine: "American",
      total_time: 25,
      prep_time: 15,
      cook_time: 10,
      rating: 4.9,
      nutrition: {
        calories: 195,
        protein_g: 3,
        carbs_g: 28,
        fat_g: 9,
        fiber_g: 1,
        sugar_g: 18,
      },
      created_at: "2024-01-20T14:15:00Z",
      updated_at: "2024-01-20T14:15:00Z",
    },
    "ext-003": {
      id: "ext-003",
      slug: "thai-green-curry",
      title: "Mock External Recipe: Thai Green Curry",
      image_url: "https://picsum.photos/800/600?random=3",
      description:
        "Aromatic and spicy Thai green curry with chicken and vegetables. Perfectly balanced flavors in every bite.",
      ingredients: [
        { text: "2 tbsp green curry paste" },
        { text: "1 can coconut milk (400ml)" },
        { text: "1 lb chicken breast, sliced" },
        { text: "1 eggplant, cubed" },
        { text: "1 bell pepper, sliced" },
        { text: "2 tbsp fish sauce" },
        { text: "1 tbsp brown sugar" },
        { text: "Thai basil leaves" },
        { text: "Jasmine rice for serving" },
      ],
      steps: [
        { text: "Heat coconut milk in large pan", timer_seconds: 180 },
        { text: "Add curry paste and stir", timer_seconds: 120 },
        { text: "Add chicken and cook until done", timer_seconds: 480 },
        { text: "Add vegetables and simmer", timer_seconds: 600 },
        { text: "Season with fish sauce and sugar", timer_seconds: 60 },
        { text: "Garnish with basil", timer_seconds: 30 },
        { text: "Serve over rice", timer_seconds: 60 },
      ],
      tags: ["Thai", "Curry", "Spicy", "Asian"],
      cuisine: "Thai",
      total_time: 35,
      prep_time: 15,
      cook_time: 20,
      rating: 4.7,
      nutrition: {
        calories: 425,
        protein_g: 28,
        carbs_g: 18,
        fat_g: 26,
        fiber_g: 3,
        sugar_g: 8,
      },
      created_at: "2024-01-25T09:45:00Z",
      updated_at: "2024-01-25T09:45:00Z",
    },
  };

  const recipe = mockRecipes[id];

  if (!recipe) {
    return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
  }

  return NextResponse.json(recipe);
}
