import { NextResponse } from "next/server";
import { createClient } from "@/src/lib/supabase/server";
import { adminClient, recipesIndexName, RecipeSearchRecord } from "@/src/lib/algolia";

export async function POST(request: Request) {
  try {
    const { recipeId } = await request.json();
    const supabase = await createClient();

    // Build query for recipes
    let query = supabase.from("recipes").select("*").eq("status", "published");

    // If specific recipe ID provided, filter to that recipe
    if (recipeId) {
      query = query.eq("id", recipeId);
    }

    const { data: recipes, error } = await query;

    if (error) throw error;
    if (!recipes || recipes.length === 0) {
      return NextResponse.json({ message: "No recipes to index" });
    }

    // Get recipe IDs for related data
    const recipeIds = recipes.map((r) => r.id);

    // Fetch ingredients for all recipes
    const { data: ingredients } = await supabase
      .from("recipe_ingredients")
      .select("recipe_id, line_text")
      .in("recipe_id", recipeIds);

    // Fetch nutrition for all recipes
    const { data: nutrition } = await supabase
      .from("recipe_nutrition")
      .select("recipe_id, calories")
      .in("recipe_id", recipeIds);

    // Create lookup maps
    const ingredientsMap =
      ingredients?.reduce((acc, ing) => {
        if (!acc[ing.recipe_id]) acc[ing.recipe_id] = [];
        acc[ing.recipe_id].push(ing.line_text);
        return acc;
      }, {} as Record<string, string[]>) || {};

    const nutritionMap =
      nutrition?.reduce((acc, nut) => {
        acc[nut.recipe_id] = nut.calories || 0;
        return acc;
      }, {} as Record<string, number>) || {};

    // Transform recipes to Algolia records
    const records: RecipeSearchRecord[] = recipes.map((recipe) => ({
      objectID: recipe.id,
      id: recipe.id,
      slug: recipe.slug,
      title: recipe.title,
      tags: recipe.tags || [],
      cuisine: recipe.cuisine || "",
      total_minutes: recipe.total_minutes || 0,
      avg_rating: recipe.avg_rating || 0,
      calories_per_serving: nutritionMap[recipe.id] || 0,
      ingredients_text: ingredientsMap[recipe.id]?.join(" ") || "",
      created_at: Math.floor(new Date(recipe.created_at).getTime() / 1000),
      hero_image_url: recipe.hero_image_url || "",
      intro: recipe.intro || "",
    }));

    // Save to Algolia
    if (adminClient) {
      await adminClient.saveObjects({ indexName: recipesIndexName, objects: records as unknown as Record<string, unknown>[] });
    }

    return NextResponse.json({
      success: true,
      indexed: records.length,
      message: `Indexed ${records.length} recipe(s)`,
    });
  } catch (error) {
    console.error("Reindex error:", error);
    return NextResponse.json(
      { error: "Failed to reindex recipes" },
      { status: 500 }
    );
  }
}
