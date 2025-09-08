import { liteClient as algoliasearch } from "algoliasearch/lite"; // client (browser)
import { algoliasearch as algoliasearchFull } from "algoliasearch"; // admin (server)

export const ALGOLIA_APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!;
export const ALGOLIA_INDEX =
  process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || "recipes";

// IMPORTANT: use a SEARCH-ONLY key in the browser, never the admin key.
export const ALGOLIA_SEARCH_KEY =
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY ?? ""; // add this env if missing

// Singleton client for the browser (avoid new instance each render)
export const searchClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY);

// Admin client for reindex routes or scripts (server only)
// Only create this on the server-side where ALGOLIA_ADMIN_KEY is available
export const adminClient =
  typeof window === "undefined" && process.env.ALGOLIA_ADMIN_KEY
    ? algoliasearchFull(ALGOLIA_APP_ID, process.env.ALGOLIA_ADMIN_KEY)
    : null;

// Export the index name for server-side operations  
export const recipesIndexName = ALGOLIA_INDEX;

export async function ensureIndexSettings() {
  if (!adminClient) {
    console.warn(
      "Admin client not available (client-side or missing admin key)"
    );
    return;
  }
  // Using v5 API - simplified for now, will be implemented in admin routes
  console.log("Index settings configuration would be applied here");
}

export interface RecipeSearchRecord {
  objectID: string;
  id: string;
  slug: string;
  title: string;
  tags: string[];
  cuisine: string;
  total_minutes: number;
  avg_rating: number;
  calories_per_serving: number;
  ingredients_text: string;
  created_at: number;
  hero_image_url?: string;
  intro?: string;
}
