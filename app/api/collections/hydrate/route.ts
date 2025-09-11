import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/src/lib/supabase/server";
import { getRecipeById } from "@/src/lib/external";
import { normalizeExtRecipe } from "@/src/lib/catalog";
import { mapNormalizedToCard, mapRecipeRowToCard, type CardData } from "@/src/lib/cards/mapToCard";
import { SOURCE_MODE } from "@/src/lib/sourceMode";

export async function POST(request: NextRequest) {
  try {
    const { recipeIds } = await request.json();
    
    if (!Array.isArray(recipeIds) || recipeIds.length === 0) {
      return NextResponse.json({ recipes: [] });
    }
    
    // Limit to prevent abuse
    const limitedIds = recipeIds.slice(0, 50);
    const recipes: CardData[] = [];
    
    // Get heart counts
    const supabase = await createClient();
    const { data: hearts } = await supabase
      .from("hearts")
      .select("recipe_id")
      .in("recipe_id", limitedIds);
    
    const heartCounts = hearts?.reduce((acc: Record<string, number>, heart: any) => {
      acc[heart.recipe_id] = (acc[heart.recipe_id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};
    
    if (SOURCE_MODE === "mirror") {
      // Fetch from Supabase
      const { data: dbRecipes } = await supabase
        .from("recipes")
        .select(`
          id,
          slug,
          title,
          image_url,
          tags,
          total_minutes,
          avg_rating,
          source_url
        `)
        .in("id", limitedIds);
      
      if (dbRecipes) {
        for (const recipe of dbRecipes) {
          recipes.push({
            ...mapRecipeRowToCard(recipe),
            hearts: heartCounts[recipe.id] || 0,
          });
        }
      }
    } else {
      // LIVE mode: fetch from external API
      const fetchPromises = limitedIds.map(async (id) => {
        try {
          const externalRecipe = await getRecipeById(id);
          if (externalRecipe) {
            const normalized = normalizeExtRecipe(externalRecipe);
            return {
              ...mapNormalizedToCard(normalized),
              hearts: heartCounts[id] || 0,
            };
          }
        } catch (error) {
          console.error(`Failed to fetch recipe ${id}:`, error);
        }
        return null;
      });
      
      const results = await Promise.all(fetchPromises);
      recipes.push(...results.filter((r): r is CardData => r !== null));
    }
    
    return NextResponse.json({ recipes });
  } catch (error) {
    console.error("Error hydrating recipes:", error);
    return NextResponse.json({ recipes: [] }, { status: 500 });
  }
}