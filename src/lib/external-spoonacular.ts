import { ExtRecipeRaw } from "./catalog";

const SPOONACULAR_API_KEY = process.env.EXTERNAL_API_KEY || "";
const SPOONACULAR_BASE_URL = "https://api.spoonacular.com/recipes";

// Rate limiting and retry logic for Spoonacular API
class SpoonacularAPIClient {
  private baseURL: string;
  private apiKey: string;
  private requestQueue: Promise<any>[] = [];
  private maxConcurrent = 5;

  constructor(baseURL: string, apiKey: string) {
    this.baseURL = baseURL.replace(/\/$/, ""); // Remove trailing slash
    this.apiKey = apiKey;
  }

  private async makeRequest<T>(endpoint: string, params: URLSearchParams): Promise<T> {
    // Wait for queue to have space
    while (this.requestQueue.length >= this.maxConcurrent) {
      await Promise.race(this.requestQueue);
    }

    // Add required Spoonacular parameters
    params.set("apiKey", this.apiKey);

    const url = `${this.baseURL}${endpoint}?${params.toString()}`;
    const requestPromise = fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })
      .then(async response => {
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Spoonacular API Error ${response.status}: ${errorText}`);
        }
        return response.json();
      })
      .catch(error => {
        console.error(`Spoonacular API request failed for ${url}:`, error);
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
    try {
      const params = new URLSearchParams();
      params.set("includeNutrition", "true");

      const response = await this.makeRequest<any>(`/${id}/information`, params);
      return this.transformSpoonacularRecipe(response);
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
    const { q = "", tags = [], cuisine = [], page = 1, perPage = 12, time, calories } = params;

    // Build Spoonacular query parameters
    const searchParams = new URLSearchParams();

    // Main query
    if (q) {
      searchParams.append("query", q);
    }

    // Cuisine filters
    if (cuisine.length > 0) {
      searchParams.append("cuisine", cuisine.join(","));
    }

    // Diet/tag filters (Spoonacular uses "diet" parameter)
    if (tags.length > 0) {
      const dietTags = tags.filter(tag =>
        ["vegetarian", "vegan", "gluten free", "dairy free", "ketogenic", "paleo"].includes(
          tag.toLowerCase(),
        ),
      );
      if (dietTags.length > 0) {
        searchParams.append("diet", dietTags.join(","));
      }
    }

    // Time filters (Spoonacular uses maxReadyTime)
    if (time?.max) {
      searchParams.append("maxReadyTime", time.max.toString());
    }

    // Calorie filters
    if (calories?.min) {
      searchParams.append("minCalories", calories.min.toString());
    }
    if (calories?.max) {
      searchParams.append("maxCalories", calories.max.toString());
    }

    // Pagination (Spoonacular uses offset/number)
    const offset = (page - 1) * perPage;
    searchParams.append("offset", offset.toString());
    searchParams.append("number", perPage.toString());

    // Additional quality parameters
    searchParams.append("addRecipeInformation", "true");
    searchParams.append("fillIngredients", "true");

    try {
      const response = await this.makeRequest<{
        results: any[];
        totalResults: number;
        offset: number;
        number: number;
      }>(`/complexSearch`, searchParams);

      const transformedRecipes = response.results
        .map(recipe => this.transformSpoonacularRecipe(recipe))
        .filter(recipe => recipe !== null) as ExtRecipeRaw[];

      return {
        items: transformedRecipes,
        total: response.totalResults || 0,
        page,
        perPage,
      };
    } catch (error) {
      console.error("Spoonacular search failed:", error);
      return {
        items: [],
        total: 0,
        page,
        perPage,
      };
    }
  }

  private transformSpoonacularRecipe(spoonacularRecipe: any): ExtRecipeRaw | null {
    if (!spoonacularRecipe) return null;

    try {
      // Extract ingredients
      const ingredients =
        spoonacularRecipe.extendedIngredients?.map((ing: any) => ({
          text: ing.original || ing.name || "",
        })) || [];

      // Extract steps
      const steps = spoonacularRecipe.analyzedInstructions?.[0]?.steps?.map((step: any) => ({
        text: step.step || "",
      })) || [
        {
          text: `View full instructions at ${spoonacularRecipe.sourceUrl || "the source"}`,
        },
      ];

      // Extract tags
      const tags = [
        ...(spoonacularRecipe.diets || []),
        ...(spoonacularRecipe.dishTypes || []),
        ...(spoonacularRecipe.occasions || []),
      ]
        .filter(Boolean)
        .slice(0, 6);

      // Extract nutrition
      let nutrition = null;
      if (spoonacularRecipe.nutrition?.nutrients) {
        const nutrients = spoonacularRecipe.nutrition.nutrients;
        const findNutrient = (name: string) =>
          nutrients.find((n: any) => n.name.toLowerCase().includes(name.toLowerCase()))?.amount ||
          null;

        nutrition = {
          calories: findNutrient("calories"),
          protein: findNutrient("protein"),
          carbs: findNutrient("carbohydrates"),
          fat: findNutrient("fat"),
        };
      }

      return {
        id: spoonacularRecipe.id?.toString() || "unknown",
        title: spoonacularRecipe.title || "Untitled Recipe",
        imageUrl: spoonacularRecipe.image || null,
        ingredients,
        steps,
        tags,
        cuisine: spoonacularRecipe.cuisines?.[0] || "International",
        total_minutes: spoonacularRecipe.readyInMinutes || null,
        yield: spoonacularRecipe.servings || null,
        rating: spoonacularRecipe.spoonacularScore
          ? Math.round(spoonacularRecipe.spoonacularScore / 20)
          : null, // Convert 0-100 to 0-5
        nutrition,
        source_url: spoonacularRecipe.sourceUrl || null,
        raw_external: spoonacularRecipe, // Store full Spoonacular response
      };
    } catch (error) {
      console.error("Failed to transform Spoonacular recipe:", error);
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

        // Add delay to respect Spoonacular rate limits
        if (hasMore) {
          await new Promise(resolve => setTimeout(resolve, 200));
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
export const externalAPI = new SpoonacularAPIClient(SPOONACULAR_BASE_URL, SPOONACULAR_API_KEY);

// Export individual functions for easier use
export const getRecipeById = (id: string) => externalAPI.getRecipeById(id);
export const searchRecipes = (params: Parameters<typeof externalAPI.searchRecipes>[0]) =>
  externalAPI.searchRecipes(params);
export const getAllRecipes = (batchSize?: number) => externalAPI.getAllRecipes(batchSize);

// Helper to check if Spoonacular API is configured
export function isExternalAPIConfigured(): boolean {
  return Boolean(SPOONACULAR_API_KEY && SPOONACULAR_API_KEY !== "your-api-key");
}
