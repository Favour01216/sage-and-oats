import { createClient } from "./supabase/client";

interface EdamamRecipe {
  uri: string;
  label: string;
  image: string;
  source: string;
  url: string;
  yield: number;
  dietLabels: string[];
  healthLabels: string[];
  cautions: string[];
  ingredientLines: string[];
  ingredients: any[];
  calories: number;
  totalTime: number;
  cuisineType: string[];
  mealType: string[];
  dishType: string[];
}

export class SupabaseRecipeCache {
  private supabase = createClient();
  private readonly CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days
  private readonly SEARCH_CACHE_DURATION = 30 * 60 * 1000; // 30 minutes (shorter for fresh AWS URLs)

  async cacheRecipe(recipeUri: string, recipeData: EdamamRecipe): Promise<void> {
    try {
      const { error } = await this.supabase.from("cached_recipes").upsert(
        {
          uri: recipeUri,
          recipe_data: recipeData as any,
          expires_at: new Date(Date.now() + this.CACHE_DURATION).toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "uri",
        },
      );

      if (error) {
        console.error("Failed to cache recipe:", error);
      } else {
        console.log("✅ Recipe cached in Supabase:", `${recipeUri.slice(0, 50)}...`);
      }
    } catch (error) {
      console.error("Cache recipe error:", error);
    }
  }

  // Get cached recipe from Supabase
  async getCachedRecipe(recipeUri: string): Promise<any | null> {
    try {
      const { data, error } = await this.supabase
        .from("cached_recipes")
        .select("recipe_data, save_count")
        .eq("uri", recipeUri)
        .gte("expires_at", new Date().toISOString())
        .single();

      if (error || !data) {
        return null;
      }

      // Update view count in background
      this.supabase
        .from("cached_recipes")
        .update({
          view_count: 1, // We'll use an increment approach later
          updated_at: new Date().toISOString(),
        })
        .eq("uri", recipeUri)
        .then();

      return data.recipe_data;
    } catch (error) {
      console.error("Get cached recipe error:", error);
      return null;
    }
  }

  // Cache search results
  async cacheSearch(searchKey: string, results: any, queryParams: any = {}): Promise<void> {
    try {
      const { error } = await this.supabase.from("search_cache").upsert(
        {
          cache_key: searchKey,
          query_params: queryParams as any,
          results: results as any,
          expires_at: new Date(Date.now() + this.SEARCH_CACHE_DURATION).toISOString(),
        },
        {
          onConflict: "cache_key",
        },
      );

      if (error) {
        console.error("Failed to cache search:", error);
      } else {
        console.log("✅ Cached search results in Supabase:", searchKey);
      }
    } catch (error) {
      console.error("Cache search error:", error);
    }
  }

  // Get cached search results
  async getCachedSearch(searchKey: string): Promise<any | null> {
    try {
      const { data, error } = await this.supabase
        .from("search_cache")
        .select("results, hit_count")
        .eq("cache_key", searchKey)
        .gte("expires_at", new Date().toISOString())
        .single();

      if (error || !data) {
        return null;
      }

      // Increment hit count in background
      this.supabase
        .from("search_cache")
        .update({
          hit_count: (data.hit_count || 0) + 1,
        })
        .eq("cache_key", searchKey)
        .then();

      console.log("✅ Retrieved cached search results from Supabase:", searchKey);
      return data.results;
    } catch (error) {
      console.error("Get cached search error:", error);
      return null;
    }
  }

  // Get popular recipes based on save count
  async getPopularRecipes(limit: number = 12): Promise<any[]> {
    try {
      const { data, error } = await this.supabase
        .from("cached_recipes")
        .select("uri, recipe_data, save_count")
        .gte("expires_at", new Date().toISOString())
        .order("save_count", { ascending: false })
        .limit(limit);

      if (error) {
        console.error("Failed to get popular recipes:", error);
        return [];
      }

      return (
        data?.map((item: any) => ({
          uri: item.uri,
          ...item.recipe_data,
          saveCount: item.save_count,
        })) || []
      );
    } catch (error) {
      console.error("Get popular recipes error:", error);
      return [];
    }
  }

  // Clean up expired cache entries using the database function
  async cleanupExpiredCache(): Promise<void> {
    try {
      const { error } = await this.supabase.rpc("cleanup_expired_cache");

      if (error) {
        console.error("Failed to cleanup expired cache:", error);
      }
    } catch (error) {
      console.error("Cleanup expired cache error:", error);
    }
  }
}

export const supabaseCache = new SupabaseRecipeCache();
