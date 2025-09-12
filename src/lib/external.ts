// Dynamic implementation based on SOURCE_MODE environment variable
const SOURCE_MODE = process.env.SOURCE_MODE || "live";

import * as edamamAPI from "./external-edamam";

// Mock API implementation for development/testing
const mockAPI = {
  async getRecipeById(id: string) {
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
        }/api/mock-external/recipes/${id}`,
      );
      if (!response.ok) {
        throw new Error(`API Error ${response.status}: ${await response.text()}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Failed to fetch recipe ${id}:`, error);
      return null;
    }
  },

  async searchRecipes(
    params: {
      q?: string;
      tags?: string[];
      cuisine?: string[];
      page?: number;
      perPage?: number;
      time?: { min?: number; max?: number };
      calories?: { min?: number; max?: number };
    } = {},
  ) {
    try {
      const { page = 1, perPage = 12, q = "" } = params;
      const searchParams = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString(),
        q,
      });

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
        }/api/mock-external/recipes/search?${searchParams}`,
      );
      if (!response.ok) {
        throw new Error(`API Error ${response.status}: ${await response.text()}`);
      }
      const data = await response.json();

      return {
        items: data.data || [],
        total: data.total || 0,
        page: data.page || 1,
        perPage: data.per_page || 12,
      };
    } catch (error) {
      console.error("Mock search failed:", error);
      return { items: [], total: 0, page: 1, perPage: 12 };
    }
  },

  async getAllRecipes(batchSize?: number) {
    try {
      const result = await this.searchRecipes({ page: 1, perPage: 100 });
      return result.items;
    } catch (error) {
      console.error("Failed to get all recipes:", error);
      return [];
    }
  },

  isExternalAPIConfigured() {
    return true; // Mock API is always "configured"
  },
};

// Create conditional API based on SOURCE_MODE
const api = SOURCE_MODE === "mock" ? mockAPI : edamamAPI;

// Export functions
export const getRecipeById = api.getRecipeById;
export const searchRecipes = api.searchRecipes;
export const getAllRecipes = api.getAllRecipes;
export const isExternalAPIConfigured = api.isExternalAPIConfigured;
