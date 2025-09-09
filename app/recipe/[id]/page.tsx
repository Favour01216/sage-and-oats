import RecipeHero from "@/src/components/RecipeHero";
import Badge from "@/src/components/ui/Badge";
import { HeartButton } from "@/src/components/HeartButton";
import { Clock, Star, Users } from "lucide-react";
import { createClient } from "@/src/lib/supabase/server";
import { notFound } from "next/navigation";
import SeoRecipeJsonLd from "@/src/components/SeoRecipeJsonLd";
import { Metadata } from "next";
import { isLive, SOURCE_MODE } from "@/src/lib/sourceMode";
import { getRecipeById } from "@/src/lib/external";
import { normalizeExtRecipe } from "@/src/lib/catalog";
import { RecipePageClient } from "../../../src/components/RecipePageClient";

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

interface Ingredient {
  id: string;
  recipe_id: string;
  group_label: string | null;
  line_text: string;
  quantity_num: number | null;
  unit: string | null;
  item: string | null;
  note: string | null;
}

interface Step {
  id: string;
  recipe_id: string;
  step_number: number;
  text: string;
  timer_seconds: number | null;
}

interface Nutrition {
  recipe_id: string;
  calories: number | null;
  protein_g: number | null;
  fat_g: number | null;
  carbs_g: number | null;
  fiber_g: number | null;
  sugar_g: number | null;
  sodium_mg: number | null;
  raw_edamam: any | null;
}

// Generate metadata for the page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id: rawId } = await params;
  const id = decodeURIComponent(rawId);

  let recipe: any = null;

  if (isLive) {
    // For LIVE mode, try to get recipe from external API
    try {
      const rawRecipe = await getRecipeById(id);
      if (rawRecipe) {
        recipe = normalizeExtRecipe(rawRecipe);
      }
    } catch (error) {
      console.error("Failed to fetch recipe from external API:", error);
    }
  }

  if (!recipe) {
    return {
      title: "Recipe Not Found",
      description: "The requested recipe could not be found.",
    };
  }

  const description =
    recipe.intro ||
    recipe.description ||
    `A delicious ${recipe.cuisine || "recipe"} that takes ${
      recipe.total_minutes
    } minutes to prepare.`;

  return {
    title: `${recipe.title} - Sage & Oat`,
    description,
    openGraph: {
      title: recipe.title,
      description,
      images:
        recipe.hero_image_url || recipe.imageUrl
          ? [recipe.hero_image_url || recipe.imageUrl]
          : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: recipe.title,
      description,
      images:
        recipe.hero_image_url || recipe.imageUrl
          ? [recipe.hero_image_url || recipe.imageUrl]
          : [],
    },
    alternates: {
      canonical: `/recipe/${recipe.id}`,
    },
  };
}

export default async function RecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: rawId } = await params;
  const id = decodeURIComponent(rawId);

  if (isLive) {
    // LIVE mode: Get recipe from external API
    let extRecipe;
    try {
      const rawRecipe = await getRecipeById(id);
      if (rawRecipe) {
        extRecipe = normalizeExtRecipe(rawRecipe);
      } else {
        notFound();
      }
    } catch (error) {
      console.error("Failed to fetch recipe from external API:", error);
      notFound();
    }

    // Still get hearts from Supabase since that's local user data
    const supabase = await createClient();
    const { count: heartCount } = await supabase
      .from("hearts")
      .select("*", { count: "exact", head: true })
      .eq("recipe_id", extRecipe.id);

    // Calculate read time (rough estimate)
    const readTime = Math.ceil((extRecipe.total_minutes || 0) / 2);

    return (
      <>
        {/* SEO JSON-LD */}
        <SeoRecipeJsonLd
          recipe={{
            id: extRecipe.id,
            slug: extRecipe.slug,
            title: extRecipe.title,
            hero_image_url: extRecipe.imageUrl || null,
            intro: null, // No description field in normalized type
            yield: null, // No yield field in normalized type
            total_minutes: extRecipe.total_minutes || null,
            tags: extRecipe.tags,
            cuisine: extRecipe.cuisine || null,
            author_id: null,
            avg_rating: extRecipe.avg_rating || null,
            created_at: new Date().toISOString(),
          }}
          ingredients={extRecipe.ingredients.map((ing) => ({
            line_text: ing.line_text,
            quantity_num: null,
            unit: null,
            item: null,
          }))}
          steps={extRecipe.steps.map((step, idx) => ({
            step_number: idx + 1,
            text: step.text,
            timer_seconds: step.timer_seconds || null,
          }))}
          nutrition={
            extRecipe.nutrition
              ? {
                  calories: extRecipe.nutrition.calories || null,
                  protein_g: extRecipe.nutrition.protein_g || null,
                  fat_g: extRecipe.nutrition.fat_g || null,
                  carbs_g: extRecipe.nutrition.carbs_g || null,
                }
              : undefined
          }
          heartCount={heartCount || 0}
        />

        <main>
          <RecipeHero
            src={extRecipe.imageUrl || "/placeholder-recipe.jpg"}
            alt={extRecipe.title}
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="max-w-5xl mx-auto">
                {/* Title and Meta */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 dark:text-gray-100">
                      {extRecipe.title}
                    </h1>
                    <div className="text-sm text-muted dark:text-muted-dark">
                      LIVE mode
                    </div>
                  </div>                {/* Tags */}
                {extRecipe.tags && extRecipe.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {extRecipe.tags.map((tag) => (
                      <Badge key={tag} variant="default">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                  {extRecipe.total_minutes && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{extRecipe.total_minutes} min</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>4 servings</span>
                  </div>
                  <HeartButton
                    recipeId={extRecipe.id}
                    initialCount={heartCount || 0}
                    size="sm"
                  />
                  {extRecipe.avg_rating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-current text-yellow-400" />
                      <span>{extRecipe.avg_rating.toFixed(1)}</span>
                    </div>
                  )}
                  <div className="text-xs text-gray-500">
                    ~{readTime} min read
                  </div>
                </div>
              </div>

              {/* Content Grid */}
              <RecipePageClient
                recipe={{
                  id: extRecipe.id,
                  title: extRecipe.title,
                  imageUrl: extRecipe.imageUrl,
                  tags: extRecipe.tags,
                  cuisine: extRecipe.cuisine,
                  total_minutes: extRecipe.total_minutes,
                  avg_rating: extRecipe.avg_rating,
                  ingredients: extRecipe.ingredients,
                  steps: extRecipe.steps,
                  nutrition: extRecipe.nutrition,
                  source_url: extRecipe.source_url
                }}
                heartCount={heartCount || 0}
                defaultServings={4}
              />
            </div>
          </div>
        </main>
      </>
    );
  } else {
    // MIRROR mode is no longer supported - redirect to 404
    notFound();
  }
}
