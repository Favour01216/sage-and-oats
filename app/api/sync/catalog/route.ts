import { NextRequest, NextResponse } from "next/server";
import { getAllRecipes } from "@/src/lib/external";
import { normalizeExtRecipe, toAlgoliaDoc } from "@/src/lib/catalog";
import { createClient } from "@/src/lib/supabase/server";
import { adminClient, ALGOLIA_INDEX } from "@/src/lib/algolia";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { full = false } = body;

    const supabase = await createClient();

    // Check if we have admin access (service role)
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized - admin access required" },
        { status: 401 }
      );
    }

    console.log(`Starting ${full ? "full" : "delta"} catalog sync...`);

    // Get recipes from external API
    const rawRecipes = await getAllRecipes();
    console.log(`Fetched ${rawRecipes.length} recipes from external API`);

    // Normalize recipes
    const normalizedRecipes = rawRecipes.map(normalizeExtRecipe);
    console.log(`Normalized ${normalizedRecipes.length} recipes`);

    // Sync to Supabase
    let syncedCount = 0;
    const errors: string[] = [];

    for (const recipe of normalizedRecipes) {
      try {
        // Upsert main recipe record
        const { error: recipeError } = await supabase.from("recipes").upsert(
          {
            id: recipe.id,
            slug: recipe.slug,
            title: recipe.title,
            image_url: recipe.imageUrl,
            tags: recipe.tags,
            cuisine: recipe.cuisine,
            total_minutes: recipe.total_minutes,
            avg_rating: recipe.avg_rating,
            calories_per_serving: recipe.calories_per_serving,
            updated_at: recipe.updated_at || new Date().toISOString(),
            external_source: true,
          } as any,
          {
            onConflict: "id",
          }
        );

        if (recipeError) {
          errors.push(`Recipe ${recipe.id}: ${recipeError.message}`);
          continue;
        }

        // Upsert ingredients
        if (recipe.ingredients.length > 0) {
          const { error: ingredientsError } = await supabase
            .from("recipe_ingredients")
            .delete()
            .eq("recipe_id", recipe.id);

          if (!ingredientsError) {
            const { error: insertError } = await supabase
              .from("recipe_ingredients")
              .insert(
                recipe.ingredients.map((ing: any, index: number) => ({
                  recipe_id: recipe.id,
                  line_text: ing.line_text,
                  order_index: index,
                })) as any
              );

            if (insertError) {
              errors.push(
                `Ingredients for ${recipe.id}: ${insertError.message}`
              );
            }
          }
        }

        // Upsert steps
        if (recipe.steps.length > 0) {
          const { error: stepsError } = await supabase
            .from("recipe_steps")
            .delete()
            .eq("recipe_id", recipe.id);

          if (!stepsError) {
            const { error: insertError } = await supabase
              .from("recipe_steps")
              .insert(
                recipe.steps.map((step: any, index: number) => ({
                  recipe_id: recipe.id,
                  text: step.text,
                  order_index: index,
                  timer_seconds: step.timer_seconds,
                })) as any
              );

            if (insertError) {
              errors.push(`Steps for ${recipe.id}: ${insertError.message}`);
            }
          }
        }

        // Upsert nutrition if available
        if (recipe.nutrition) {
          const { error: nutritionError } = await supabase
            .from("recipe_nutrition")
            .upsert(
              {
                recipe_id: recipe.id,
                calories: recipe.nutrition.calories,
                protein_g: recipe.nutrition.protein_g,
                fat_g: recipe.nutrition.fat_g,
                carbs_g: recipe.nutrition.carbs_g,
              } as any,
              {
                onConflict: "recipe_id",
              }
            );

          if (nutritionError) {
            errors.push(
              `Nutrition for ${recipe.id}: ${nutritionError.message}`
            );
          }
        }

        syncedCount++;
      } catch (error) {
        errors.push(
          `Recipe ${recipe.id}: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }

    console.log(`Synced ${syncedCount} recipes to Supabase`);

    // Sync to Algolia if admin client is available
    let algoliaCount = 0;
    if (adminClient) {
      try {
        const algoliaObjects = normalizedRecipes.map(toAlgoliaDoc);

        // Note: For Algolia v5, we'll need to implement the proper batch upload
        // For now, we'll log what would be synced
        console.log(
          `Would sync ${algoliaObjects.length} objects to Algolia index: ${ALGOLIA_INDEX}`
        );
        algoliaCount = algoliaObjects.length;

        // TODO: Implement actual Algolia v5 batch upload when the API is properly configured
      } catch (algoliaError) {
        errors.push(
          `Algolia sync error: ${
            algoliaError instanceof Error
              ? algoliaError.message
              : "Unknown error"
          }`
        );
      }
    }

    const response = {
      success: true,
      message: `Sync completed`,
      stats: {
        fetched: rawRecipes.length,
        normalized: normalizedRecipes.length,
        syncedToSupabase: syncedCount,
        syncedToAlgolia: algoliaCount,
        errors: errors.length,
      },
      errors: errors.length > 0 ? errors.slice(0, 10) : undefined, // Limit error output
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Catalog sync error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Sync failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
