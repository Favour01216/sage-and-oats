import Link from "next/link";
import RecipeCard from "@/src/components/RecipeCard";
import Button from "@/src/components/ui/Button";
import { Search, Clock, Leaf, Zap, ChefHat } from "lucide-react";
import { createClient } from "@/src/lib/supabase/server";
import { searchRecipes } from "@/src/lib/external";
import { normalizeExtRecipe } from "@/src/lib/catalog";

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
  let typedRecipes: any[] = [];
  let heartCounts: Record<string, number> = {};

  // LIVE mode: Get recipes from external API
  try {
    const result = await searchRecipes({ perPage: 8 });
    const normalizedRecipes = result.items.map(normalizeExtRecipe);
    typedRecipes = normalizedRecipes;

    // Still get hearts from Supabase since that's user interaction data
    if (typedRecipes.length > 0) {
      const supabase = await createClient();
      const recipeIds = typedRecipes.map((r) => r.id);
      const { data: hearts } = await supabase
        .from("hearts")
        .select("recipe_id")
        .in("recipe_id", recipeIds);

      heartCounts =
        hearts?.reduce((acc: Record<string, number>, heart: any) => {
          acc[heart.recipe_id] = (acc[heart.recipe_id] || 0) + 1;
          return acc;
        }, {} as Record<string, number>) || {};
    }
  } catch (error) {
    console.error("Failed to fetch recipes from external API:", error);
    // Fallback to empty array if external API fails
    typedRecipes = [];
  }

  // Transform recipes to match RecipeCard component expectations
  const displayRecipes =
    typedRecipes.map((recipe) => ({
      href: `/recipe/${encodeURIComponent(recipe.id)}`,
      recipeId: recipe.id,
      imageUrl:
        recipe.imageUrl || recipe.hero_image_url || "/placeholder-recipe.jpg",
      title: recipe.title,
      tags: recipe.tags || [],
      totalMinutes: recipe.total_minutes || 0,
      hearts: heartCounts[recipe.id] || 0,
      rating: recipe.avg_rating || 0,
    })) || [];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-white to-accent/10 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl lg:text-7xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-6">
              Sage & Oat
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              Mindful recipes for nourishing meals. Simple ingredients, bold
              flavors, beautiful presentation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/search">
                <Button size="lg" className="gap-2">
                  <Search className="w-5 h-5" />
                  Browse Recipes
                </Button>
              </Link>
              <Link href="/cook/lemon-herb-roasted-chicken">
                <Button variant="outline" size="lg" className="gap-2">
                  <ChefHat className="w-5 h-5" />
                  Cook Mode Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Filters */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-serif font-semibold text-center mb-8 text-gray-900 dark:text-gray-100">
            Quick Filters
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/search?tags=vegan"
              className="group flex items-center gap-3 p-6 bg-white dark:bg-gray-800 rounded-2xl hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700"
            >
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full group-hover:scale-110 transition-transform">
                <Leaf className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  Vegan
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Plant-based goodness
                </p>
              </div>
            </Link>

            <Link
              href="/search?tags=gluten-free"
              className="group flex items-center gap-3 p-6 bg-white dark:bg-gray-800 rounded-2xl hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700"
            >
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full group-hover:scale-110 transition-transform">
                <Leaf className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  Gluten-Free
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Safe & delicious
                </p>
              </div>
            </Link>

            <Link
              href="/search?time=30"
              className="group flex items-center gap-3 p-6 bg-white dark:bg-gray-800 rounded-2xl hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700"
            >
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  30-Minute
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Quick & easy meals
                </p>
              </div>
            </Link>

            <Link
              href="/search?tags=breakfast"
              className="group flex items-center gap-3 p-6 bg-white dark:bg-gray-800 rounded-2xl hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700"
            >
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  Breakfast
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Start your day right
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Recipes */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-serif font-semibold text-gray-900 dark:text-gray-100">
              Latest Recipes
            </h2>
            <Link
              href="/search"
              className="text-primary hover:text-primary/80 transition-colors font-medium"
            >
              View all →
            </Link>
          </div>

          {displayRecipes.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayRecipes.map((recipe, index) => (
                  <RecipeCard
                    key={recipe.href}
                    {...recipe}
                    className={index === 0 ? "md:col-span-2" : ""}
                  />
                ))}
              </div>

              <div className="text-center mt-12">
                <Link href="/search">
                  <Button variant="outline" size="lg">
                    Load More Recipes
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No recipes found. Start by adding some recipes in the admin
                panel!
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
