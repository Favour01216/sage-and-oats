/**
 * Server-side instruction ingestion for LIVE mode
 */

import { fetchInstructionsForRecipe, storeInstructionsInDB } from "./ingest";
import { RecipeNormalized } from "../catalog";
import { createClient } from "../supabase/server";

/**
 * Ingest instructions for a recipe in LIVE mode
 * Called when user opens a recipe page
 */
export async function ingestInstructionsLive(recipe: RecipeNormalized): Promise<RecipeNormalized> {
  try {
    // Attempt to fetch instructions
    const instructions = await fetchInstructionsForRecipe({
      recipe,
      sourceUrl: recipe.source_url || undefined,
      externalId: recipe.id,
    });

    // If we got instructions and they're from an external source, store them
    if (instructions && instructions.provenance !== "normalized") {
      // Store in database for future use
      await storeInstructionsInDB(recipe.id, instructions);

      // Update the recipe with the ingested steps
      return {
        ...recipe,
        steps: instructions.steps || [],
      };
    }

    return recipe;
  } catch (error) {
    console.error("Failed to ingest instructions in LIVE mode:", error);
    return recipe;
  }
}

/**
 * Ingest instructions for multiple recipes in MIRROR mode
 * Called during sync operations
 */
export async function ingestInstructionsMirror(recipes: RecipeNormalized[]): Promise<void> {
  const supabase = await createClient();

  for (const recipe of recipes) {
    try {
      // Skip if recipe already has steps
      if (recipe.steps && recipe.steps.length > 0) {
        continue;
      }

      // Skip if no source URL
      if (!recipe.source_url) {
        continue;
      }

      // Attempt to fetch instructions
      const instructions = await fetchInstructionsForRecipe({
        recipe,
        sourceUrl: recipe.source_url,
        externalId: recipe.id,
      });

      if (instructions) {
        await storeInstructionsInDB(recipe.id, instructions);
        console.log(`Ingested instructions for recipe ${recipe.id}`);
      }
    } catch (error) {
      console.error(`Failed to ingest instructions for recipe ${recipe.id}:`, error);
      // Continue with other recipes
    }
  }
}
