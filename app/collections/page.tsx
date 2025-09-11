import { Heart, Search } from "lucide-react";
import { createClient } from "@/src/lib/supabase/server";
import { getRecipeById } from "@/src/lib/external";
import { normalizeExtRecipe } from "@/src/lib/catalog";
import RecipeCard from "@/src/components/RecipeCard";
import Button from "@/src/components/ui/Button";
import Link from "next/link";
import { mapNormalizedToCard, mapRecipeRowToCard, type CardData } from "@/src/lib/cards/mapToCard";
import { SOURCE_MODE } from "@/src/lib/sourceMode";
import { cookies } from "next/headers";
import CollectionsClient from "./CollectionsClient";

interface HeartedRecipe {
  id: string;
  recipe_id: string;
  created_at: string;
  // Snapshot fields for resilience
  title_snapshot?: string | null;
  image_url_snapshot?: string | null;
  source_url_snapshot?: string | null;
}

async function getHeartCounts(recipeIds: string[]): Promise<Record<string, number>> {
  if (recipeIds.length === 0) return {};

  const supabase = await createClient();
  const { data: hearts } = await supabase
    .from("hearts")
    .select("recipe_id")
    .in("recipe_id", recipeIds);

  return hearts?.reduce((acc: Record<string, number>, heart: any) => {
    acc[heart.recipe_id] = (acc[heart.recipe_id] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};
}

async function hydrateRecipe(
  heart: HeartedRecipe,
  heartCount: number
): Promise<CardData | null> {
  // First try to use snapshot data if available
  if (heart.title_snapshot && heart.image_url_snapshot) {
    return mapRecipeRowToCard({
      id: heart.recipe_id,
      slug: heart.recipe_id,
      title: heart.title_snapshot,
      image_url: heart.image_url_snapshot,
      source_url: heart.source_url_snapshot,
      hearts: heartCount,
    });
  }

  // Otherwise, fetch the full recipe data
  if (SOURCE_MODE === "mirror") {
    // Fetch from Supabase
    const supabase = await createClient();
    const { data: recipe } = await supabase
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
      .eq("id", heart.recipe_id)
      .single();

    if (recipe) {
      return {
        ...mapRecipeRowToCard(recipe),
        hearts: heartCount,
      };
    }
  } else {
    // LIVE mode: fetch from external API
    try {
      const externalRecipe = await getRecipeById(heart.recipe_id);
      if (externalRecipe) {
        const normalized = normalizeExtRecipe(externalRecipe);
        return {
          ...mapNormalizedToCard(normalized),
          hearts: heartCount,
        };
      }
    } catch (error) {
      console.error(`Failed to fetch recipe ${heart.recipe_id}:`, error);
    }
  }

  // Fallback: return minimal card with ID
  return {
    id: heart.recipe_id,
    slug: heart.recipe_id,
    title: `Recipe ${heart.recipe_id.slice(0, 8)}...`,
    href: `/recipe/${encodeURIComponent(heart.recipe_id)}`,
    hearts: heartCount,
    tags: [],
  };
}

export default async function CollectionsPage() {
  const supabase = await createClient();

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();

  let heartedRecipes: HeartedRecipe[] = [];
  let recipes: CardData[] = [];

  if (user) {
    // Authenticated users: get from Supabase with snapshots
    const { data, error } = await supabase
      .from("hearts")
      .select(`
        id,
        recipe_id,
        created_at
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      heartedRecipes = data;
    }
  } else {
    // For anonymous users, we'll need client-side handling
    // Return the client component for localStorage access
    return <CollectionsClient />;
  }

  // Hydrate all recipes in parallel
  if (heartedRecipes.length > 0) {
    const recipeIds = heartedRecipes.map(h => h.recipe_id);
    const heartCounts = await getHeartCounts(recipeIds);

    const hydratedRecipes = await Promise.all(
      heartedRecipes.map(heart =>
        hydrateRecipe(heart, heartCounts[heart.recipe_id] || 1)
      )
    );

    recipes = hydratedRecipes.filter((r): r is CardData => r !== null);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-8 h-8 text-accent fill-current" />
            <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-gray-100">
              My Collection
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {recipes.length} saved recipe{recipes.length !== 1 ? "s" : ""}
          </p>
        </div>

        {recipes.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No saved recipes yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Start exploring recipes and tap the heart icon to save your
              favorites here.
            </p>
            <Link href="/">
              <Button>Discover Recipes</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recipes.map((recipe, index) => (
              <RecipeCard
                key={recipe.id}
                href={recipe.href}
                recipeId={recipe.id}
                recipeSlug={recipe.slug}
                imageUrl={recipe.imageUrl}
                title={recipe.title}
                tags={recipe.tags}
                totalMinutes={recipe.total_minutes}
                hearts={recipe.hearts}
                rating={recipe.rating || undefined}
                priority={index < 4} // Priority for first 4 images
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}