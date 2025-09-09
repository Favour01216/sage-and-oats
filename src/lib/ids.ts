/**
 * Recipe ID utilities for consistent keying across hearts, ratings, and shopping lists
 * Ensures LIVE and MIRROR modes point to the same database rows
 */

/**
 * Get a stable key for a recipe that works across LIVE and MIRROR modes
 * @param recipe - Recipe object with id and/or slug
 * @returns Stable key string (prefers external id, falls back to slug)
 */
export function getRecipeKey(recipe: { id?: string | number; slug?: string }): string {
  // Prefer external ID as it's stable across both modes
  if (recipe.id) {
    return String(recipe.id);
  }
  
  // Fallback to slug if no ID available
  if (recipe.slug) {
    return recipe.slug;
  }
  
  // Should not happen in practice, but provide a fallback
  console.warn('Recipe has neither id nor slug:', recipe);
  return 'unknown';
}

/**
 * Extract recipe ID from various recipe formats
 * @param recipe - Recipe in various possible formats
 * @returns Extracted ID or slug
 */
export function extractRecipeId(recipe: any): string {
  // Handle normalized recipe format
  if (recipe.externalId) {
    return recipe.externalId;
  }
  
  // Handle database recipe format
  if (recipe.recipe_uri) {
    // Extract ID from URI if it's in format like "recipe_123"
    const match = recipe.recipe_uri.match(/recipe[_#](.+)$/);
    if (match) {
      return match[1];
    }
    return recipe.recipe_uri;
  }
  
  // Use getRecipeKey for standard handling
  return getRecipeKey(recipe);
}

/**
 * Create a consistent recipe URI for database storage
 * @param recipeId - The recipe ID or slug
 * @returns Formatted URI for database storage
 */
export function createRecipeUri(recipeId: string): string {
  // Use consistent format: recipe_<id>
  if (recipeId.startsWith('recipe_')) {
    return recipeId;
  }
  return `recipe_${recipeId}`;
}

/**
 * Parse a recipe URI to extract the ID
 * @param uri - The recipe URI from database
 * @returns Extracted ID
 */
export function parseRecipeUri(uri: string): string {
  if (uri.startsWith('recipe_')) {
    return uri.substring(7);
  }
  return uri;
}