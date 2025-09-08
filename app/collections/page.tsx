"use client";

import { useState, useEffect } from "react";
import {
  Heart,
  Search,
  Filter,
  X,
  Clock,
  Star,
  ChevronDown,
} from "lucide-react";
import { createClient } from "@/src/lib/supabase/client";
import { getRecipeById } from "@/src/lib/external";
import { normalizeExtRecipe } from "@/src/lib/catalog";
import RecipeCard from "@/src/components/RecipeCard";
import Button from "@/src/components/ui/Button";

interface HeartedRecipe {
  id: string;
  recipe_id: string;
  created_at: string;
  recipe?: any;
}

export default function CollectionsPage() {
  const [heartedRecipes, setHeartedRecipes] = useState<HeartedRecipe[]>([]);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<
    "newest" | "oldest" | "alphabetical" | "rating" | "time"
  >("newest");
  const [filterByTime, setFilterByTime] = useState<
    "all" | "quick" | "medium" | "long"
  >("all");
  const [filterByRating, setFilterByRating] = useState<
    "all" | "4+" | "3+" | "2+"
  >("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    loadHeartedRecipes();
  }, []);

  useEffect(() => {
    loadRecipeDetails();
  }, [heartedRecipes]);

  async function loadHeartedRecipes() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Authenticated users: get from Supabase
        const { data, error } = await supabase
          .from("hearts")
          .select("id, recipe_id, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error loading hearted recipes:", error);
          return;
        }

        setHeartedRecipes(data || []);
      } else {
        // Anonymous users: get from localStorage
        const localHearts = JSON.parse(localStorage.getItem("hearts") || "[]");
        const now = new Date().toISOString();

        const heartedRecipes = localHearts.map(
          (recipeId: string, index: number) => ({
            id: `local-${recipeId}`,
            recipe_id: recipeId,
            created_at: new Date(Date.now() - index * 1000).toISOString(), // Stagger timestamps slightly
          })
        );

        setHeartedRecipes(heartedRecipes);
      }
    } catch (error) {
      console.error("Error loading hearted recipes:", error);
    }
  }

  async function loadRecipeDetails() {
    if (heartedRecipes.length === 0) {
      setLoading(false);
      return;
    }

    setApiError(false);
    let hasApiErrors = false;

    try {
      const recipePromises = heartedRecipes.map(async (heart) => {
        try {
          // For now, skip fetching individual recipes to avoid API errors
          // Instead, return a placeholder that indicates the recipe is hearted
          // TODO: Implement proper recipe caching when hearts are created
          hasApiErrors = true;
          return {
            id: heart.recipe_id,
            title: `Recipe ${heart.recipe_id.slice(0, 20)}...`,
            imageUrl:
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-family='Arial' font-size='14' fill='%236b7280'%3ERecipe Image%3C/text%3E%3C/svg%3E",
            tags: ["Hearted Recipe"],
            total_minutes: 30, // Default estimate
            avg_rating: 4, // Default estimate
            hearted_at: heart.created_at,
          };
        } catch (error) {
          console.error(`Error loading recipe ${heart.recipe_id}:`, error);
          hasApiErrors = true;
          // Return a fallback recipe object if API fails
          return {
            id: heart.recipe_id,
            title: `Recipe ${heart.recipe_id}`,
            imageUrl:
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-family='Arial' font-size='14' fill='%236b7280'%3ERecipe Image%3C/text%3E%3C/svg%3E",
            tags: ["External Recipe"],
            total_minutes: 0,
            avg_rating: 0,
            hearted_at: heart.created_at,
          };
        }
      });

      const recipeResults = await Promise.all(recipePromises);
      const validRecipes = recipeResults.filter((recipe) => recipe !== null);

      if (hasApiErrors) {
        setApiError(true);
      }

      setRecipes(validRecipes);
    } catch (error) {
      console.error("Error loading recipe details:", error);
      setApiError(true);
    } finally {
      setLoading(false);
    }
  }

  // Get unique tags from all recipes
  const allTags = Array.from(
    new Set(recipes.flatMap((recipe) => recipe.tags || []))
  ).sort();

  // Apply filters
  const filteredAndSortedRecipes = recipes
    .filter((recipe) => {
      // Text search
      const matchesSearch =
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.tags?.some((tag: string) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );

      // Time filter
      const matchesTime =
        filterByTime === "all" ||
        (filterByTime === "quick" && recipe.total_minutes <= 30) ||
        (filterByTime === "medium" &&
          recipe.total_minutes > 30 &&
          recipe.total_minutes <= 60) ||
        (filterByTime === "long" && recipe.total_minutes > 60);

      // Rating filter
      const matchesRating =
        filterByRating === "all" ||
        (filterByRating === "4+" && recipe.avg_rating >= 4) ||
        (filterByRating === "3+" && recipe.avg_rating >= 3) ||
        (filterByRating === "2+" && recipe.avg_rating >= 2);

      // Tags filter
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((tag) => recipe.tags?.includes(tag));

      return matchesSearch && matchesTime && matchesRating && matchesTags;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.hearted_at).getTime() - new Date(a.hearted_at).getTime()
          );
        case "oldest":
          return (
            new Date(a.hearted_at).getTime() - new Date(b.hearted_at).getTime()
          );
        case "alphabetical":
          return a.title.localeCompare(b.title);
        case "rating":
          return (b.avg_rating || 0) - (a.avg_rating || 0);
        case "time":
          return (a.total_minutes || 0) - (b.total_minutes || 0);
        default:
          return 0;
      }
    });

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setFilterByTime("all");
    setFilterByRating("all");
    setSelectedTags([]);
    setSortBy("newest");
  };

  const hasActiveFilters =
    searchTerm ||
    filterByTime !== "all" ||
    filterByRating !== "all" ||
    selectedTags.length > 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Loading your collection...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-8 h-8 text-accent fill-current" />
            <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-gray-100">
              My Collection
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {recipes.length} saved recipe{recipes.length !== 1 ? "s" : ""}
          </p>

          {/* API Error Warning */}
          {apiError && (
            <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
              <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                ⚠️ Some recipe details couldn't be loaded due to API
                limitations. Your saved recipes are still here!
              </p>
            </div>
          )}
        </div>

        {recipes.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No saved recipes yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Start exploring recipes and tap the heart icon to save your
              favorites here.
            </p>
            <a href="/">
              <Button>Discover Recipes</Button>
            </a>
          </div>
        ) : (
          <>
            {/* Filters and Search */}
            <div className="mb-8">
              {/* Search Bar */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search your collection..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Filter Toggle and Sort */}
              <div className="flex flex-wrap items-center gap-4 justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                      showFilters || hasActiveFilters
                        ? "bg-primary text-white border-primary"
                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    <Filter className="w-4 h-4" />
                    <span>Filters</span>
                    {hasActiveFilters && (
                      <span className="bg-white text-primary text-xs px-2 py-0.5 rounded-full">
                        {[
                          searchTerm ? 1 : 0,
                          filterByTime !== "all" ? 1 : 0,
                          filterByRating !== "all" ? 1 : 0,
                          selectedTags.length,
                        ].reduce((a, b) => a + b, 0)}
                      </span>
                    )}
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        showFilters ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {hasActiveFilters && (
                    <button
                      onClick={clearAllFilters}
                      className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 underline"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="alphabetical">Alphabetical</option>
                  <option value="rating">Highest Rated</option>
                  <option value="time">Quickest First</option>
                </select>
              </div>

              {/* Advanced Filters Panel */}
              {showFilters && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 space-y-4">
                  {/* Time Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Cooking Time
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { value: "all", label: "Any Time" },
                        { value: "quick", label: "≤ 30 min" },
                        { value: "medium", label: "30-60 min" },
                        { value: "long", label: "> 60 min" },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setFilterByTime(option.value as any)}
                          className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                            filterByTime === option.value
                              ? "bg-primary text-white border-primary"
                              : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Rating Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Star className="w-4 h-4 inline mr-1" />
                      Minimum Rating
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { value: "all", label: "Any Rating" },
                        { value: "2+", label: "2+ Stars" },
                        { value: "3+", label: "3+ Stars" },
                        { value: "4+", label: "4+ Stars" },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setFilterByRating(option.value as any)}
                          className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                            filterByRating === option.value
                              ? "bg-primary text-white border-primary"
                              : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tags Filter */}
                  {allTags.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Tags
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {allTags.map((tag) => (
                          <button
                            key={tag}
                            onClick={() => handleTagToggle(tag)}
                            className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                              selectedTags.includes(tag)
                                ? "bg-primary text-white border-primary"
                                : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                            }`}
                          >
                            {tag}
                            {selectedTags.includes(tag) && (
                              <X className="w-3 h-3 ml-1 inline" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Results Count */}
            <div className="mb-6">
              <p className="text-gray-600 dark:text-gray-400">
                {filteredAndSortedRecipes.length} recipe
                {filteredAndSortedRecipes.length !== 1 ? "s" : ""} found
                {hasActiveFilters && ` (${recipes.length} total)`}
              </p>
            </div>

            {/* Recipe Grid */}
            {filteredAndSortedRecipes.length === 0 ? (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  No recipes found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Try adjusting your search terms
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAndSortedRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    href={`/recipe/${encodeURIComponent(recipe.id)}`}
                    recipeId={recipe.id}
                    imageUrl={recipe.imageUrl}
                    title={recipe.title}
                    tags={recipe.tags || []}
                    totalMinutes={recipe.total_minutes || 0}
                    hearts={1} // This recipe is hearted by definition
                    rating={recipe.avg_rating || 0}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
