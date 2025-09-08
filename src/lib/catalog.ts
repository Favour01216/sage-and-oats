// External API raw recipe shape (Edamam format)
export type ExtRecipeRaw = {
  id: string;
  title: string;
  imageUrl?: string | null;
  ingredients: { text: string }[];
  steps: { text: string }[];
  tags: string[];
  cuisine?: string;
  total_minutes?: number | null;
  yield?: number | null;
  rating?: number | null;
  nutrition?: {
    calories?: number | null;
    protein?: number | null;
    carbs?: number | null;
    fat?: number | null;
  } | null;
  source_url?: string | null;
  raw_external?: any; // Store full Edamam response
};

// Normalized recipe shape that works across the app
export type RecipeNormalized = {
  id: string; // stable external id
  slug: string; // kebab-case title or external slug
  title: string;
  imageUrl?: string;
  tags: string[];
  cuisine?: string;
  total_minutes?: number;
  avg_rating?: number | null;
  calories_per_serving?: number | null;
  ingredients: { line_text: string }[];
  steps: { text: string; timer_seconds?: number | null }[];
  nutrition?: {
    calories?: number;
    protein_g?: number;
    fat_g?: number;
    carbs_g?: number;
  };
  source_url?: string | null;
  updated_at?: string; // ISO from external API
};

// Convert external API recipe (Edamam) to our normalized format
export function normalizeExtRecipe(raw: ExtRecipeRaw): RecipeNormalized {
  if (!raw || typeof raw !== "object") {
    throw new Error("Invalid recipe data: expected an object");
  }

  // Generate a slug from title
  const slug =
    raw.title
      ?.toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "untitled-recipe";

  return {
    id: raw.id,
    slug,
    title: raw.title || "Untitled Recipe",
    imageUrl: raw.imageUrl || undefined,
    tags: raw.tags || [],
    cuisine: raw.cuisine,
    total_minutes: raw.total_minutes || undefined,
    avg_rating: raw.rating || undefined,
    calories_per_serving: raw.nutrition?.calories || undefined,
    ingredients: raw.ingredients?.map((ing) => ({ line_text: ing.text })) || [],
    steps: raw.steps || [],
    nutrition: raw.nutrition
      ? {
          calories: raw.nutrition.calories || undefined,
          protein_g: raw.nutrition.protein || undefined,
          fat_g: raw.nutrition.fat || undefined,
          carbs_g: raw.nutrition.carbs || undefined,
        }
      : undefined,
    source_url: raw.source_url || null,
    updated_at: new Date().toISOString(), // Current time since Edamam doesn't provide this
  };
}

// Convert normalized recipe to Algolia document format
export function toAlgoliaDoc(r: RecipeNormalized) {
  return {
    objectID: r.id,
    id: r.id,
    slug: r.slug,
    title: r.title,
    imageUrl: r.imageUrl,
    tags: r.tags,
    cuisine: r.cuisine,
    total_minutes: r.total_minutes,
    avg_rating: r.avg_rating ?? 0,
    calories_per_serving: r.calories_per_serving ?? null,
    hearts: 0, // Default to 0, will be updated from Supabase data if available
    created_at: Math.floor(Date.now() / 1000),
    ingredients_text: r.ingredients.map((i) => i.line_text).join(", "),
  };
}

// Helper to generate a URL-friendly slug
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
