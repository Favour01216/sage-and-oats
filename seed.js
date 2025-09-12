const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const recipes = [
  {
    slug: "lemon-herb-roasted-chicken",
    title: "Lemon Herb Roasted Chicken",
    intro: "A simple yet elegant roasted chicken with bright lemon and fresh herbs.",
    hero_image_url: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800",
    tags: ["dinner", "gluten-free", "high-protein"],
    yield: "4 servings",
    total_minutes: 75,
    difficulty: "easy",
    rating_avg: 4.8,
    rating_count: 24,
  },
  {
    slug: "creamy-mushroom-risotto",
    title: "Creamy Mushroom Risotto",
    intro: "A rich and comforting Italian classic with earthy mushrooms and parmesan.",
    hero_image_url: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800",
    tags: ["dinner", "vegetarian", "comfort-food"],
    yield: "4 servings",
    total_minutes: 35,
    difficulty: "medium",
    rating_avg: 4.6,
    rating_count: 18,
  },
  {
    slug: "thai-green-curry",
    title: "Thai Green Curry",
    intro: "A vibrant and aromatic curry with vegetables and coconut milk.",
    hero_image_url: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800",
    tags: ["dinner", "vegan", "gluten-free", "spicy"],
    yield: "4 servings",
    total_minutes: 30,
    difficulty: "easy",
    rating_avg: 4.7,
    rating_count: 31,
  },
];

async function seedDatabase() {
  console.log("Starting database seed...");

  for (const recipe of recipes) {
    const { data, error } = await supabase.from("recipes").insert(recipe).select().single();

    if (error) {
      console.error("Error inserting recipe:", error);
    } else {
      console.log(`Inserted recipe: ${data.title}`);

      // Add some sample ingredients
      const ingredients = [
        {
          recipe_id: data.id,
          line_text: "2 cups main ingredient",
          quantity_num: 2,
          unit: "cups",
          item: "main ingredient",
        },
        {
          recipe_id: data.id,
          line_text: "1 tbsp olive oil",
          quantity_num: 1,
          unit: "tbsp",
          item: "olive oil",
        },
        { recipe_id: data.id, line_text: "Salt and pepper to taste", item: "seasonings" },
      ];

      await supabase.from("recipe_ingredients").insert(ingredients);

      // Add some sample steps
      const steps = [
        { recipe_id: data.id, step_number: 1, text: "Prepare all ingredients" },
        {
          recipe_id: data.id,
          step_number: 2,
          text: "Cook according to recipe",
          timer_seconds: 600,
        },
        { recipe_id: data.id, step_number: 3, text: "Serve and enjoy!" },
      ];

      await supabase.from("recipe_steps").insert(steps);
    }
  }

  console.log("Database seed completed!");
  process.exit(0);
}

seedDatabase().catch(console.error);
