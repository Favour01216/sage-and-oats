/**
 * Empty state components for search
 */

import React from "react";
import { Search, Filter, ChefHat } from "lucide-react";

interface EmptyStateProps {
  query?: string;
  hasFilters?: boolean;
  onClearFilters?: () => void;
}

/**
 * Empty state for no search results
 */
export function SearchEmptyState({ query, hasFilters, onClearFilters }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-12">
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
        <Search className="h-10 w-10 text-gray-400" />
      </div>

      <h3 className="mb-2 text-xl font-semibold text-gray-900">No recipes found</h3>

      {query && (
        <p className="mb-4 text-center text-gray-600">
          We couldn't find any recipes matching "{query}"
        </p>
      )}

      {hasFilters && (
        <>
          <p className="mb-4 text-center text-gray-600">
            Try adjusting your filters to see more results
          </p>
          <button
            onClick={onClearFilters}
            className="rounded-lg bg-primary px-4 py-2 text-white transition-colors hover:bg-primary/90"
          >
            Clear all filters
          </button>
        </>
      )}

      {!query && !hasFilters && (
        <p className="text-center text-gray-600">Start typing to search for delicious recipes</p>
      )}

      {/* Suggestions */}
      <div className="mt-8 w-full max-w-md">
        <p className="mb-3 text-sm text-gray-500">Try searching for:</p>
        <div className="flex flex-wrap gap-2">
          {["pasta", "chicken", "salad", "dessert", "vegan"].map(suggestion => (
            <button
              key={suggestion}
              className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 transition-colors hover:bg-gray-200"
              onClick={() => {
                // Trigger search with suggestion
                const searchInput = document.querySelector<HTMLInputElement>("[data-search-input]");
                if (searchInput) {
                  searchInput.value = suggestion;
                  searchInput.dispatchEvent(new Event("input", { bubbles: true }));
                }
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Empty state for initial search page
 */
export function InitialSearchState() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-16">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10">
        <ChefHat className="h-12 w-12 text-primary" />
      </div>

      <h2 className="mb-3 text-2xl font-bold text-gray-900">Discover Amazing Recipes</h2>

      <p className="mb-8 max-w-md text-center text-gray-600">
        Search through thousands of delicious recipes. Find your next favorite meal!
      </p>

      {/* Popular categories */}
      <div className="w-full max-w-2xl">
        <h3 className="mb-4 text-center text-sm font-semibold text-gray-700">Popular Categories</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {[
            { name: "Quick & Easy", icon: "⚡", query: "time:0-30" },
            { name: "Healthy", icon: "🥗", query: "tags:healthy" },
            { name: "Desserts", icon: "🍰", query: "tags:dessert" },
            { name: "Vegetarian", icon: "🥦", query: "tags:vegetarian" },
            { name: "Comfort Food", icon: "🍲", query: "tags:comfort" },
            { name: "International", icon: "🌍", query: "cuisine:asian,italian,mexican" },
          ].map(category => (
            <button
              key={category.name}
              className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-primary hover:shadow-sm"
              onClick={() => {
                // Trigger search with category
                console.log("Search for:", category.query);
              }}
            >
              <span className="text-2xl">{category.icon}</span>
              <span className="font-medium text-gray-800">{category.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Error state for search
 */
export function SearchErrorState({ error, onRetry }: { error?: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-12">
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
        <Filter className="h-10 w-10 text-red-500" />
      </div>

      <h3 className="mb-2 text-xl font-semibold text-gray-900">Something went wrong</h3>

      <p className="mb-6 max-w-md text-center text-gray-600">
        {error || "We encountered an error while searching. Please try again."}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-lg bg-primary px-4 py-2 text-white transition-colors hover:bg-primary/90"
        >
          Try again
        </button>
      )}
    </div>
  );
}
