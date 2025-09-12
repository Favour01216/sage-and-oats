import { NextRequest, NextResponse } from "next/server";

// Mock external API endpoint for testing LIVE mode
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const per_page = parseInt(searchParams.get("per_page") || "12");

  // Mock recipe data that looks like an external API response
  const mockRecipes = [
    {
      id: "ext-001",
      title: "Mock External Recipe: Classic Margherita Pizza",
      image_url: "https://picsum.photos/800/600?random=1",
      ingredients: [
        { text: "1 pound pizza dough" },
        { text: "1/2 cup marinara sauce" },
        { text: "8 oz fresh mozzarella, sliced" },
        { text: "Fresh basil leaves" },
        { text: "2 tbsp olive oil" },
        { text: "Salt and pepper to taste" },
      ],
      steps: [
        { text: "Preheat oven to 475°F (245°C)" },
        { text: "Roll out pizza dough on floured surface" },
        { text: "Spread marinara sauce evenly over dough" },
        { text: "Add mozzarella slices and basil leaves" },
        { text: "Drizzle with olive oil and season" },
        { text: "Bake for 12-15 minutes until golden" },
      ],
      tags: ["Italian", "Pizza", "Vegetarian", "Quick"],
      cuisine: "Italian",
      total_time: 30,
      rating: 4.8,
      nutrition: {
        calories: 285,
        protein: 12,
        carbs: 36,
        fat: 11,
      },
    },
    {
      id: "ext-002",
      title: "Mock External Recipe: Chocolate Chip Cookies",
      image_url: "https://picsum.photos/800/600?random=2",
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
        { text: "Preheat oven to 375°F (190°C)" },
        { text: "Mix flour, baking soda, and salt in bowl" },
        { text: "Cream butter and sugars until fluffy" },
        { text: "Beat in eggs and vanilla" },
        { text: "Gradually mix in flour mixture" },
        { text: "Stir in chocolate chips" },
        { text: "Drop spoonfuls on baking sheet" },
        { text: "Bake 9-11 minutes until golden" },
      ],
      tags: ["Dessert", "Cookies", "Sweet", "Baking"],
      cuisine: "American",
      total_time: 25,
      rating: 4.9,
      nutrition: {
        calories: 195,
        protein: 3,
        carbs: 28,
        fat: 9,
      },
    },
    {
      id: "ext-003",
      title: "Mock External Recipe: Thai Green Curry",
      image_url: "https://picsum.photos/800/600?random=3",
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
        { text: "Heat coconut milk in large pan" },
        { text: "Add curry paste and stir" },
        { text: "Add chicken and cook until done" },
        { text: "Add vegetables and simmer" },
        { text: "Season with fish sauce and sugar" },
        { text: "Garnish with basil" },
        { text: "Serve over rice" },
      ],
      tags: ["Thai", "Curry", "Spicy", "Asian"],
      cuisine: "Thai",
      total_time: 35,
      rating: 4.7,
      nutrition: {
        calories: 425,
        protein: 28,
        carbs: 18,
        fat: 26,
      },
    },
  ];

  // Filter by search query if provided
  let filteredRecipes = mockRecipes;
  if (q) {
    const searchTerm = q.toLowerCase();
    filteredRecipes = mockRecipes.filter(
      recipe =>
        recipe.title.toLowerCase().includes(searchTerm) ||
        recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        recipe.cuisine.toLowerCase().includes(searchTerm),
    );
  }

  // Simulate pagination
  const total = filteredRecipes.length;
  const startIndex = (page - 1) * per_page;
  const endIndex = startIndex + per_page;
  const paginatedRecipes = filteredRecipes.slice(startIndex, endIndex);

  // Return mock API response format
  return NextResponse.json({
    data: paginatedRecipes,
    total,
    page,
    per_page,
    total_pages: Math.ceil(total / per_page),
  });
}
