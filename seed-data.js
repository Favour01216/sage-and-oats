const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing environment variables. Please check your .env.local file.");
  process.exit(1);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

async function seedDatabase() {
  console.log("Starting database seed...");

  // Clear existing data
  await supabase.from("recipe_steps").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase
    .from("recipe_ingredients")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("recipes").delete().neq("id", "00000000-0000-0000-0000-000000000000");

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
      avg_rating: 4.8,
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
      avg_rating: 4.6,
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
      avg_rating: 4.7,
    },
  ];

  for (const recipe of recipes) {
    console.log(`Inserting recipe: ${recipe.title}`);

    const { data, error } = await supabase.from("recipes").insert(recipe).select().single();

    if (error) {
      console.error("Error inserting recipe:", error);
      continue;
    }

    console.log(`✓ Inserted recipe: ${data.title}`);

    // Add ingredients for each recipe
    const ingredientSets = {
      "lemon-herb-roasted-chicken": [
        { line_text: "1 whole chicken (4-5 lbs)", quantity_num: 1, unit: "whole", item: "chicken" },
        { line_text: "2 lemons, halved", quantity_num: 2, unit: "whole", item: "lemons" },
        { line_text: "4 sprigs fresh rosemary", quantity_num: 4, unit: "sprigs", item: "rosemary" },
        { line_text: "6 cloves garlic, minced", quantity_num: 6, unit: "cloves", item: "garlic" },
        { line_text: "3 tbsp olive oil", quantity_num: 3, unit: "tbsp", item: "olive oil" },
        { line_text: "Salt and pepper to taste", item: "salt and pepper" },
      ],
      "creamy-mushroom-risotto": [
        {
          line_text: "1½ cups arborio rice",
          quantity_num: 1.5,
          unit: "cups",
          item: "arborio rice",
        },
        {
          line_text: "1 lb mixed mushrooms, sliced",
          quantity_num: 1,
          unit: "lb",
          item: "mushrooms",
        },
        {
          line_text: "4 cups vegetable broth",
          quantity_num: 4,
          unit: "cups",
          item: "vegetable broth",
        },
        { line_text: "1 cup white wine", quantity_num: 1, unit: "cup", item: "white wine" },
        {
          line_text: "1 cup parmesan cheese, grated",
          quantity_num: 1,
          unit: "cup",
          item: "parmesan",
        },
        { line_text: "2 tbsp butter", quantity_num: 2, unit: "tbsp", item: "butter" },
      ],
      "thai-green-curry": [
        {
          line_text: "2 tbsp green curry paste",
          quantity_num: 2,
          unit: "tbsp",
          item: "curry paste",
        },
        {
          line_text: "1 can (14 oz) coconut milk",
          quantity_num: 14,
          unit: "oz",
          item: "coconut milk",
        },
        { line_text: "1 lb mixed vegetables", quantity_num: 1, unit: "lb", item: "vegetables" },
        { line_text: "1 cup Thai basil leaves", quantity_num: 1, unit: "cup", item: "Thai basil" },
        {
          line_text: "2 tbsp fish sauce (or soy sauce)",
          quantity_num: 2,
          unit: "tbsp",
          item: "fish sauce",
        },
        { line_text: "1 tbsp palm sugar", quantity_num: 1, unit: "tbsp", item: "palm sugar" },
      ],
    };

    const ingredients = ingredientSets[recipe.slug] || [];
    for (const ing of ingredients) {
      await supabase.from("recipe_ingredients").insert({
        recipe_id: data.id,
        ...ing,
      });
    }

    // Add steps for each recipe
    const stepSets = {
      "lemon-herb-roasted-chicken": [
        { step_number: 1, text: "Preheat oven to 425°F (220°C)." },
        { step_number: 2, text: "Pat chicken dry and season inside and out with salt and pepper." },
        { step_number: 3, text: "Stuff cavity with lemon halves and rosemary." },
        { step_number: 4, text: "Rub skin with olive oil and minced garlic." },
        { step_number: 5, text: "Roast for 1 hour 15 minutes until golden.", timer_seconds: 4500 },
        { step_number: 6, text: "Let rest for 10 minutes before carving.", timer_seconds: 600 },
      ],
      "creamy-mushroom-risotto": [
        { step_number: 1, text: "Heat broth in a separate pot and keep warm." },
        { step_number: 2, text: "Sauté mushrooms until golden, set aside." },
        { step_number: 3, text: "Toast rice in butter for 2 minutes.", timer_seconds: 120 },
        { step_number: 4, text: "Add wine and stir until absorbed." },
        {
          step_number: 5,
          text: "Add broth one ladle at a time, stirring constantly.",
          timer_seconds: 1200,
        },
        { step_number: 6, text: "Stir in mushrooms and parmesan, serve immediately." },
      ],
      "thai-green-curry": [
        { step_number: 1, text: "Heat oil in a wok or large pan." },
        { step_number: 2, text: "Fry curry paste for 1 minute until fragrant.", timer_seconds: 60 },
        { step_number: 3, text: "Add coconut milk and bring to a simmer." },
        { step_number: 4, text: "Add vegetables and cook for 10 minutes.", timer_seconds: 600 },
        { step_number: 5, text: "Season with fish sauce and palm sugar." },
        { step_number: 6, text: "Garnish with Thai basil and serve with rice." },
      ],
    };

    const steps = stepSets[recipe.slug] || [];
    for (const step of steps) {
      await supabase.from("recipe_steps").insert({
        recipe_id: data.id,
        ...step,
      });
    }
  }

  console.log("\n✅ Database seed completed!");
  console.log("Refresh your browser to see the recipes.");
  process.exit(0);
}

seedDatabase().catch(err => {
  console.error("Seed error:", err);
  process.exit(1);
});
