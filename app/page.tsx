import Link from "next/link";
import RecipeCard from "@/src/components/RecipeCard";
import Button from "@/src/components/ui/Button";
import { Search, Clock, Leaf, Zap, ChefHat } from "lucide-react";
import { createClient } from "@/src/lib/supabase/server";
import { searchRecipes } from "@/src/lib/external";
import { normalizeExtRecipe } from "@/src/lib/catalog";
import { mapNormalizedToCard, type CardData } from "@/src/lib/cards/mapToCard";
import { SOURCE_MODE } from "@/src/lib/sourceMode";

// Enable ISR with 2 minute revalidation
export const revalidate = 120;

// Define types for our data
interface Recipe {
  id: string;
  slug: string;
  title: string;
  hero_image_url: string | null;
  intro: string | null;
  yield: string | null;
  total_minutes: number | null;
  difficulty: string | null;
  tags: string[] | null;
  cuisine: string | null;
  author_id: string | null;
  avg_rating: number | null;
  created_at: string;
}

// Remove mock data - we'll fetch real data from Supabase

export default async function Home() {
  let displayRecipes: CardData[] = [];

  if (SOURCE_MODE === "mirror") {
    // MIRROR mode: Get recipes from Supabase
    try {
      const supabase = await createClient();

      // Query recipes with heart counts
      const { data: recipes, error } = await supabase
        .from("recipes")
        .select(
          `
          id,
          slug,
          title,
          hero_image_url,
          tags,
          total_minutes,
          avg_rating
        `,
        )
        .order("created_at", { ascending: false })
        .limit(8);

      if (error) {
        console.error("Failed to fetch recipes from Supabase:", error);
      } else if (recipes) {
        // Get heart counts for these recipes
        const recipeIds = recipes.map(r => r.id);
        const { data: hearts } = await supabase
          .from("hearts")
          .select("recipe_id")
          .in("recipe_id", recipeIds);

        const heartCounts =
          hearts?.reduce(
            (acc: Record<string, number>, heart: any) => {
              acc[heart.recipe_id] = (acc[heart.recipe_id] || 0) + 1;
              return acc;
            },
            {} as Record<string, number>,
          ) || {};

        // Map to card data
        displayRecipes = recipes.map(recipe => ({
          ...mapNormalizedToCard(recipe),
          hearts: heartCounts[recipe.id] || 0,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch recipes:", error);
    }
  } else {
    // LIVE mode: Get recipes from external API
    try {
      const result = await searchRecipes({ perPage: 8 });
      const normalizedRecipes = result.items.map(normalizeExtRecipe);

      // Get heart counts from Supabase
      if (normalizedRecipes.length > 0) {
        const supabase = await createClient();
        const recipeIds = normalizedRecipes.map((r: any) => r.id);
        const { data: hearts } = await supabase
          .from("hearts")
          .select("recipe_id")
          .in("recipe_id", recipeIds);

        const heartCounts =
          hearts?.reduce(
            (acc: Record<string, number>, heart: any) => {
              acc[heart.recipe_id] = (acc[heart.recipe_id] || 0) + 1;
              return acc;
            },
            {} as Record<string, number>,
          ) || {};

        // Map to card data
        displayRecipes = normalizedRecipes.map((recipe: any) => ({
          ...mapNormalizedToCard(recipe),
          hearts: heartCounts[recipe.id] || 0,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch recipes from external API:", error);
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-white to-accent/10 py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 font-serif text-5xl font-bold text-gray-900 lg:text-7xl dark:text-gray-100">
              Sage & Oat
            </h1>
            <p className="mb-8 text-xl leading-relaxed text-gray-600 lg:text-2xl dark:text-gray-400">
              Mindful recipes for nourishing meals. Simple ingredients, bold flavors, beautiful
              presentation.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/search">
                <Button size="lg" className="gap-2">
                  <Search className="h-5 w-5" />
                  Browse Recipes
                </Button>
              </Link>
              <Link href="/cook/lemon-herb-roasted-chicken">
                <Button variant="outline" size="lg" className="gap-2">
                  <ChefHat className="h-5 w-5" />
                  Cook Mode Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Filters */}
      <section className="bg-gray-50 py-12 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-center font-serif text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Quick Filters
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/search?tags=vegan"
              className="group flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="rounded-full bg-green-100 p-3 transition-transform group-hover:scale-110 dark:bg-green-900/30">
                <Leaf className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Vegan</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Plant-based goodness</p>
              </div>
            </Link>

            <Link
              href="/search?tags=gluten-free"
              className="group flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="rounded-full bg-blue-100 p-3 transition-transform group-hover:scale-110 dark:bg-blue-900/30">
                <Leaf className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Gluten-Free</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Safe & delicious</p>
              </div>
            </Link>

            <Link
              href="/search?time=30"
              className="group flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="rounded-full bg-orange-100 p-3 transition-transform group-hover:scale-110 dark:bg-orange-900/30">
                <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">30-Minute</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Quick & easy meals</p>
              </div>
            </Link>

            <Link
              href="/search?tags=breakfast"
              className="group flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="rounded-full bg-purple-100 p-3 transition-transform group-hover:scale-110 dark:bg-purple-900/30">
                <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Breakfast</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Start your day right</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Recipes */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex items-center justify-between">
            <h2 className="font-serif text-3xl font-semibold text-gray-900 dark:text-gray-100">
              Latest Recipes
            </h2>
            <Link
              href="/search"
              className="font-medium text-primary transition-colors hover:text-primary/80"
            >
              View all →
            </Link>
          </div>

          {displayRecipes.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                {displayRecipes.map((recipe, index) => (
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
                    className={index === 0 ? "md:col-span-2" : ""}
                    priority={index < 4} // Priority for first 4 images
                  />
                ))}
              </div>

              <div className="mt-12 text-center">
                <Link href="/search">
                  <Button variant="outline" size="lg">
                    Load More Recipes
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <div className="py-12 text-center">
              <p className="mb-4 text-gray-600 dark:text-gray-400">
                No recipes found. Start by adding some recipes in the admin panel!
              </p>
              <Link href="/admin/recipes/new">
                <Button>Add First Recipe</Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
