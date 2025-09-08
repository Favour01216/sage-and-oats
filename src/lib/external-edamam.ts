import { ExtRecipeRaw } from "./catalog";
import { supabaseCache } from "./supabase-cache";

// Simple in-memory cache for recipes (fallback)
const recipeCache = new Map<string, any>();

const EDAMAM_RECIPE_APP_ID = process.env.EDAMAM_APP_ID || "";
const EDAMAM_RECIPE_APP_KEY = process.env.EDAMAM_APP_KEY || "";
const EDAMAM_BASE_URL = "https://api.edamam.com/api/recipes/v2";

// Validate environment variables
if (!EDAMAM_RECIPE_APP_ID || !EDAMAM_RECIPE_APP_KEY) {
  console.warn(
    "Missing Edamam API credentials. Please set EDAMAM_APP_ID and EDAMAM_APP_KEY in your .env.local file."
  );
  console.log("EDAMAM_APP_ID:", process.env.EDAMAM_APP_ID ? "SET" : "MISSING");
  console.log(
    "EDAMAM_APP_KEY:",
    process.env.EDAMAM_APP_KEY ? "SET" : "MISSING"
  );
}

function range(min?: number, max?: number) {
  if (min == null && max == null) return undefined;
  if (min == null) return `0-${max}`;
  if (max == null) return `${min}-`;
  return `${min}-${max}`;
}

// Rate limiting and retry logic for Edamam API
class EdamamAPIClient {
  private baseURL: string;
  private appId: string;
  private appKey: string;
  private requestQueue: Promise<any>[] = [];
  private maxConcurrent = 5;

  constructor(baseURL: string, appId: string, appKey: string) {
    this.baseURL = baseURL.replace(/\/$/, ""); // Remove trailing slash
    this.appId = appId;
    this.appKey = appKey;
  }

  private async makeRequest<T>(url: string): Promise<T> {
    // Wait for queue to have space
    while (this.requestQueue.length >= this.maxConcurrent) {
      await Promise.race(this.requestQueue);
    }

    console.log("Edamam API URL:", url);
    const requestPromise = fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": "SageAndOat/1.0",
        "Edamam-Account-User": "sage-and-oat-user",
      },
      next: { revalidate: 60 },
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Edamam API Error ${response.status} for URL: ${url}`);
          console.error(`Error response: ${errorText}`);
          throw new Error(`Edamam API Error ${response.status}: ${errorText}`);
        }
        return response.json();
      })
      .catch((error) => {
        console.error(`Edamam API request failed for ${url}:`, error);
        throw error;
      })
      .finally(() => {
        // Remove from queue when complete
        const index = this.requestQueue.indexOf(requestPromise);
        if (index > -1) {
          this.requestQueue.splice(index, 1);
        }
      });

    this.requestQueue.push(requestPromise);
    return requestPromise;
  }

  async getRecipeById(id: string): Promise<ExtRecipeRaw | null> {
    // Return null if API credentials are missing
    if (!this.appId || !this.appKey) {
      console.warn(
        "Edamam API credentials not configured. Cannot fetch recipe by ID."
      );
      return null;
    }

    // Check Supabase cache first (shared across all users)
    const supabaseCached = await supabaseCache.getCachedRecipe(id);
    if (supabaseCached) {
      console.log("🚀 Using cached recipe from Supabase!");
      // Transform the raw Edamam data from cache
      const transformedRecipe = this.transformEdamamRecipe(supabaseCached);
      if (transformedRecipe) {
        // Also cache in memory for faster subsequent access
        recipeCache.set(id, transformedRecipe);
        return transformedRecipe;
      }
    }

    // Check in-memory cache second
    if (recipeCache.has(id)) {
      console.log(`Found recipe in memory cache!`);
      return recipeCache.get(id);
    }

    console.log(`Recipe not found in any cache, trying API...`);

    try {
      // For Edamam v2 API, we need to search by URI since direct ID lookup isn't supported
      // The ID is typically extracted from URI like: http://www.edamam.com/ontologies/edamam.owl#recipe_...
      const url = new URL(this.baseURL);
      url.searchParams.set("type", "public");
      url.searchParams.set("app_id", this.appId);
      url.searchParams.set("app_key", this.appKey);

      // The ID should now be the full URI, but handle both cases for backward compatibility
      const urisToTry = [];

      if (id.startsWith("http")) {
        // Already a full URI - use it directly
        urisToTry.push(id);
      } else {
        // Legacy format - construct the URI from the extracted ID
        urisToTry.push(
          `http://www.edamam.com/ontologies/edamam.owl#recipe_${id}`
        );
        urisToTry.push(
          `https://www.edamam.com/ontologies/edamam.owl#recipe_${id}`
        );
      }

      [
        "label",
        "image",
        "uri",
        "cuisineType",
        "ingredientLines",
        "totalTime",
        "calories",
        "totalNutrients",
        "yield",
        "url",
      ].forEach((f) => url.searchParams.append("field", f));

      // Try each URI format until one works
      for (const searchUri of urisToTry) {
        url.searchParams.set("uri", searchUri);

        try {
          const response = await this.makeRequest<{ hits: { recipe: any }[] }>(
            url.toString()
          );

          if (response && response.hits && response.hits.length > 0) {
            return this.transformEdamamRecipe(response.hits[0].recipe);
          }
        } catch (error) {
          // Continue to next URI format
          continue;
        }
      }

      // If URI search fails, extract the recipe hash from the URI and try a general search
      // This is a fallback approach when direct URI lookup doesn't work
      const recipeHash = id.split("#recipe_")[1] || id.split("_").pop() || id;
      if (recipeHash && recipeHash.length > 10) {
        console.log(`Trying fallback search for recipe hash: ${recipeHash}`);

        // Clear the URI parameter and try a general search
        const fallbackUrl = new URL(this.baseURL);
        fallbackUrl.searchParams.set("type", "public");
        fallbackUrl.searchParams.set("app_id", this.appId);
        fallbackUrl.searchParams.set("app_key", this.appKey);
        fallbackUrl.searchParams.set("q", "recipe"); // General search
        fallbackUrl.searchParams.set("from", "0");
        fallbackUrl.searchParams.set("size", "100"); // Get more results to find our recipe

        [
          "label",
          "image",
          "uri",
          "cuisineType",
          "ingredientLines",
          "totalTime",
          "calories",
          "totalNutrients",
          "yield",
          "url",
        ].forEach((f) => fallbackUrl.searchParams.append("field", f));

        try {
          const fallbackResponse = await this.makeRequest<{
            hits: { recipe: any }[];
          }>(fallbackUrl.toString());

          if (fallbackResponse && fallbackResponse.hits) {
            // Look for the recipe with matching URI in the search results
            const matchingHit = fallbackResponse.hits.find(
              (hit) =>
                hit.recipe.uri === id || hit.recipe.uri?.includes(recipeHash)
            );

            if (matchingHit) {
              console.log(
                `Found recipe via fallback search: ${matchingHit.recipe.label}`
              );
              return this.transformEdamamRecipe(matchingHit.recipe);
            }
          }
        } catch (error) {
          console.error("Fallback search failed:", error);
        }
      }

      return null;
    } catch (error) {
      console.error(`Failed to fetch recipe ${id}:`, error);
      return null;
    }
  }

  async searchRecipes(params: {
    q?: string;
    tags?: string[];
    cuisine?: string[];
    page?: number;
    perPage?: number;
    time?: { min?: number; max?: number };
    calories?: { min?: number; max?: number };
  }): Promise<{
    items: ExtRecipeRaw[];
    total: number;
    page: number;
    perPage: number;
  }> {
    const {
      q = "",
      tags = [],
      cuisine = [],
      page = 1,
      perPage = 12,
      time,
      calories,
    } = params;

    // Create cache key for this search
    const cacheKey = btoa(
      JSON.stringify({ q, tags, cuisine, page, perPage, time, calories })
    )
      .replace(/[^a-zA-Z0-9]/g, "")
      .slice(0, 64);

    // Check Supabase cache first
    const cachedResults = await supabaseCache.getCachedSearch(cacheKey);
    if (cachedResults && Array.isArray(cachedResults)) {
      console.log("� Using Supabase cached search results!");
      return {
        items: cachedResults,
        total: cachedResults.length,
        page: page,
        perPage: perPage,
      };
    }

    // Return empty results if API credentials are missing
    if (!this.appId || !this.appKey) {
      console.warn(
        "Edamam API credentials not configured. Returning empty results."
      );
      return {
        items: [],
        total: 0,
        page: page,
        perPage: perPage,
      };
    }

    console.log("📡 Making Edamam API call - no cache found");

    // Build URL for v2 API
    const url = new URL(this.baseURL);
    url.searchParams.set("type", "public");

    // Handle search query
    if (q) {
      url.searchParams.set("q", q);
    } else if (tags.length > 0) {
      // If no query but we have tags, use the first tag as the search term
      // For meal types like breakfast, lunch, dinner
      const mealTypeTags = ["breakfast", "lunch", "dinner", "snack"];
      const mealType = tags.find((tag) =>
        mealTypeTags.includes(tag.toLowerCase())
      );

      if (mealType) {
        url.searchParams.set("q", mealType);
      } else {
        // For other tags like vegan, gluten-free, use a general term
        url.searchParams.set("q", tags[0]);
      }
    } else {
      // Default search when no filters
      url.searchParams.set("q", "recipe");
    }

    url.searchParams.set("app_id", this.appId);
    url.searchParams.set("app_key", this.appKey);
    url.searchParams.set("from", String((page - 1) * perPage));
    url.searchParams.set("size", String(perPage));

    // Optional facets
    cuisine.forEach((c) => url.searchParams.append("cuisineType", c));

    // Handle tags by mapping them to appropriate Edamam parameters
    tags.forEach((tag) => {
      const lowerTag = tag.toLowerCase();
      // Map meal type tags to mealType parameter
      if (["breakfast", "lunch", "dinner", "snack"].includes(lowerTag)) {
        url.searchParams.append("mealType", lowerTag);
      }
      // Map diet tags to health parameter
      else if (
        [
          "vegan",
          "vegetarian",
          "gluten-free",
          "dairy-free",
          "keto",
          "low-carb",
        ].includes(lowerTag)
      ) {
        // Convert tag names to Edamam health labels
        const healthMap: Record<string, string> = {
          vegan: "vegan",
          vegetarian: "vegetarian",
          "gluten-free": "gluten-free",
          "dairy-free": "dairy-free",
          keto: "keto-friendly",
          "low-carb": "low-carb",
        };
        const healthLabel = healthMap[lowerTag];
        if (healthLabel) {
          url.searchParams.append("health", healthLabel);
        }
      }
    });

    const timeRange = range(time?.min, time?.max);
    if (timeRange) url.searchParams.set("time", timeRange);
    const calorieRange = range(calories?.min, calories?.max);
    if (calorieRange) url.searchParams.set("calories", calorieRange);

    // Ask for only fields we need (reduces payload)
    [
      "label",
      "image",
      "uri",
      "cuisineType",
      "mealType",
      "dishType",
      "ingredientLines",
      "totalTime",
      "calories",
      "totalNutrients",
      "yield",
      "url",
    ].forEach((f) => url.searchParams.append("field", f));

    try {
      const response = await this.makeRequest<{
        hits: Array<{ recipe: any }>;
        count: number;
        from: number;
        to: number;
        more: boolean;
      }>(url.toString());

      const transformedRecipes = response.hits
        .map((hit) => this.transformEdamamRecipe(hit.recipe))
        .filter((recipe) => recipe !== null) as ExtRecipeRaw[];

      // Cache the search results in Supabase (fire and forget)
      if (transformedRecipes.length > 0) {
        supabaseCache
          .cacheSearch(cacheKey, transformedRecipes, params)
          .catch(console.error);
        console.log(
          `✅ Cached ${transformedRecipes.length} search results in Supabase`
        );
      }

      return {
        items: transformedRecipes,
        total: response.count || 0,
        page: page,
        perPage: perPage,
      };
    } catch (error) {
      console.error("Edamam search failed:", error);
      return {
        items: [],
        total: 0,
        page: page,
        perPage: perPage,
      };
    }
  }

  private transformEdamamRecipe(edamamRecipe: any): ExtRecipeRaw | null {
    if (!edamamRecipe) return null;

    try {
      // Use the full URI as the ID since that's what we need to search by
      const recipeId = edamamRecipe.uri || "unknown";

      const result = {
        id: recipeId,
        title: edamamRecipe.label || "Untitled Recipe",
        imageUrl: edamamRecipe.image || null,
        ingredients:
          edamamRecipe.ingredientLines?.map((line: string) => ({
            text: line,
          })) || [],
        steps: [
          {
            text: edamamRecipe.url
              ? `Visit the source for detailed cooking instructions: ${edamamRecipe.url}`
              : "Cooking instructions not available.",
          },
        ],
        tags: [
          ...(edamamRecipe.dietLabels || []),
          ...(edamamRecipe.healthLabels || []),
          ...(edamamRecipe.mealType || []),
          ...(edamamRecipe.dishType || []),
        ].slice(0, 6), // Limit to 6 tags
        cuisine: edamamRecipe.cuisineType?.[0] || "International",
        total_minutes: edamamRecipe.totalTime || null,
        yield: edamamRecipe.yield || 4,
        rating: null, // Edamam doesn't provide ratings
        nutrition: edamamRecipe.totalNutrients
          ? {
              calories: edamamRecipe.yield
                ? Math.round((edamamRecipe.calories || 0) / edamamRecipe.yield)
                : Math.round(edamamRecipe.calories || 0),
              protein: edamamRecipe.totalNutrients.PROCNT
                ? Math.round(
                    (edamamRecipe.totalNutrients.PROCNT.quantity || 0) /
                      (edamamRecipe.yield || 1)
                  )
                : null,
              carbs: edamamRecipe.totalNutrients.CHOCDF
                ? Math.round(
                    (edamamRecipe.totalNutrients.CHOCDF.quantity || 0) /
                      (edamamRecipe.yield || 1)
                  )
                : null,
              fat: edamamRecipe.totalNutrients.FAT
                ? Math.round(
                    (edamamRecipe.totalNutrients.FAT.quantity || 0) /
                      (edamamRecipe.yield || 1)
                  )
                : null,
            }
          : null,
        source_url: edamamRecipe.url || null,
        raw_external: edamamRecipe, // Store full Edamam response
      };

      // Cache the transformed recipe in both places
      recipeCache.set(recipeId, result);

      // Cache in Supabase using the raw Edamam data (fire and forget - don't wait)
      supabaseCache.cacheRecipe(recipeId, edamamRecipe).catch(console.error);

      return result;
    } catch (error) {
      console.error("Failed to transform Edamam recipe:", error);
      return null;
    }
  }

  async getAllRecipes(batchSize: number = 50): Promise<ExtRecipeRaw[]> {
    const allRecipes: ExtRecipeRaw[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore && allRecipes.length < 1000) {
      // Limit to prevent excessive API calls
      try {
        const result = await this.searchRecipes({
          page,
          perPage: batchSize,
        });

        allRecipes.push(...result.items);

        // Check if we've reached the end
        hasMore = result.items.length === batchSize;
        page++;

        // Add delay to respect Edamam rate limits
        if (hasMore) {
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      } catch (error) {
        console.error(`Failed to fetch page ${page}:`, error);
        hasMore = false;
      }
    }

    return allRecipes;
  }
}

// Export singleton instance
export const externalAPI = new EdamamAPIClient(
  EDAMAM_BASE_URL,
  EDAMAM_RECIPE_APP_ID,
  EDAMAM_RECIPE_APP_KEY
);

// Export individual functions for easier use
export const getRecipeById = (id: string) => externalAPI.getRecipeById(id);
export const searchRecipes = (
  params: Parameters<typeof externalAPI.searchRecipes>[0]
) => externalAPI.searchRecipes(params);
export const getAllRecipes = (batchSize?: number) =>
  externalAPI.getAllRecipes(batchSize);

// Helper to check if Edamam API is configured
export function isExternalAPIConfigured(): boolean {
  return Boolean(
    EDAMAM_RECIPE_APP_ID &&
      EDAMAM_RECIPE_APP_KEY &&
      EDAMAM_RECIPE_APP_ID !== "your-app-id" &&
      EDAMAM_RECIPE_APP_KEY !== "your-app-key"
  );
}
