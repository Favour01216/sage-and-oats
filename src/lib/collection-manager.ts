import { createClient } from "./supabase/client";
import type { Database } from "./supabase/database.types";

type SupabaseClient = ReturnType<typeof createClient>;

export class CollectionManager {
  private supabase: SupabaseClient = createClient();

  // Create a new collection
  async createCollection(
    name: string,
    description?: string,
    isPublic: boolean = false
  ) {
    const {
      data: { user },
    } = await this.supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await this.supabase
      .from("user_collections")
      .insert({
        user_id: user.id,
        name,
        description,
        is_public: isPublic,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get user's collections
  async getUserCollections(userId?: string) {
    const {
      data: { user },
    } = await this.supabase.auth.getUser();
    const targetUserId = userId || user?.id;

    if (!targetUserId) return [];

    const { data, error } = await this.supabase
      .from("user_collections")
      .select(
        `
        *,
        collection_recipes(count)
      `
      )
      .eq("user_id", targetUserId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to get collections:", error);
      return [];
    }

    return data || [];
  }

  // Add recipe to collection
  async addRecipeToCollection(
    collectionId: string,
    recipeUri: string,
    notes?: string
  ) {
    const { data, error } = await this.supabase
      .from("collection_recipes")
      .insert({
        collection_id: collectionId,
        recipe_uri: recipeUri,
        notes,
      });

    if (error) throw error;

    // Update save count using the database function
    await this.supabase.rpc("increment_save_count", { recipe_uri: recipeUri });

    return data;
  }

  // Remove recipe from collection
  async removeRecipeFromCollection(collectionId: string, recipeUri: string) {
    const { error } = await this.supabase
      .from("collection_recipes")
      .delete()
      .eq("collection_id", collectionId)
      .eq("recipe_uri", recipeUri);

    if (error) throw error;

    // Decrement save count using the database function
    await this.supabase.rpc("decrement_save_count", { recipe_uri: recipeUri });
  }

  // Get recipes in a collection
  async getCollectionRecipes(collectionId: string) {
    const { data, error } = await this.supabase
      .from("collection_recipes")
      .select(
        `
        *,
        cached_recipes(recipe_data)
      `
      )
      .eq("collection_id", collectionId)
      .order("added_at", { ascending: false });

    if (error) {
      console.error("Failed to get collection recipes:", error);
      return [];
    }

    // For recipes not in cache, return placeholder data
    return (data || []).map((item: any) => ({
      ...item,
      recipe_data: item.cached_recipes?.recipe_data || {
        id: item.recipe_uri,
        title: `Recipe ${
          item.recipe_uri.split("recipe_")[1]?.slice(0, 8) || "Unknown"
        }`,
        imageUrl:
          'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"%3E%3Crect width="300" height="200" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-family="Arial" font-size="14" fill="%236b7280"%3ERecipe Image%3C/text%3E%3C/svg%3E',
        tags: ["Saved Recipe"],
        total_minutes: null,
        rating: null,
      },
    }));
  }

  // Check if recipe is in any of user's collections
  async isRecipeInUserCollections(recipeUri: string): Promise<string[]> {
    const {
      data: { user },
    } = await this.supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await this.supabase
      .from("collection_recipes")
      .select(
        `
        collection_id,
        user_collections!inner(name)
      `
      )
      .eq("recipe_uri", recipeUri)
      .eq("user_collections.user_id", user.id);

    if (error) return [];

    return data?.map((item: any) => item.collection_id) || [];
  }

  // Quick save to default "Favorites" collection
  async toggleFavorite(recipeUri: string): Promise<boolean> {
    const {
      data: { user },
    } = await this.supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    // Get or create "Favorites" collection
    let { data: favCollection } = await this.supabase
      .from("user_collections")
      .select("id")
      .eq("user_id", user.id)
      .eq("name", "Favorites")
      .single();

    if (!favCollection) {
      // Create Favorites collection
      const { data: newCollection, error } = await this.supabase
        .from("user_collections")
        .insert({
          user_id: user.id,
          name: "Favorites",
          description: "Your favorite recipes",
          is_public: false,
        })
        .select("id")
        .single();

      if (error) throw error;
      favCollection = newCollection;
    }

    // Check if recipe is already in favorites
    const { data: existingFav } = await this.supabase
      .from("collection_recipes")
      .select("id")
      .eq("collection_id", favCollection.id)
      .eq("recipe_uri", recipeUri)
      .single();

    if (existingFav) {
      // Remove from favorites
      await this.removeRecipeFromCollection(favCollection.id, recipeUri);
      return false;
    } else {
      // Add to favorites
      await this.addRecipeToCollection(favCollection.id, recipeUri);
      return true;
    }
  }

  // Get public collections (for discovery)
  async getPublicCollections(limit: number = 20) {
    const { data, error } = await this.supabase
      .from("user_collections")
      .select(
        `
        *,
        collection_recipes(count)
      `
      )
      .eq("is_public", true)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Failed to get public collections:", error);
      return [];
    }

    return data || [];
  }

  // Update collection
  async updateCollection(
    collectionId: string,
    updates: {
      name?: string;
      description?: string;
      is_public?: boolean;
    }
  ) {
    const { data, error } = await this.supabase
      .from("user_collections")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", collectionId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Delete collection
  async deleteCollection(collectionId: string) {
    const { error } = await this.supabase
      .from("user_collections")
      .delete()
      .eq("id", collectionId);

    if (error) throw error;
  }
}

// Singleton instance
export const collectionManager = new CollectionManager();
