/**
 * Empty state components for search
 */

import React from 'react';
import { Search, Filter, ChefHat } from 'lucide-react';

interface EmptyStateProps {
  query?: string;
  hasFilters?: boolean;
  onClearFilters?: () => void;
}

/**
 * Empty state for no search results
 */
export function SearchEmptyState({ 
  query, 
  hasFilters, 
  onClearFilters 
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Search className="w-10 h-10 text-gray-400" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No recipes found
      </h3>
      
      {query && (
        <p className="text-gray-600 text-center mb-4">
          We couldn't find any recipes matching "{query}"
        </p>
      )}
      
      {hasFilters && (
        <>
          <p className="text-gray-600 text-center mb-4">
            Try adjusting your filters to see more results
          </p>
          <button
            onClick={onClearFilters}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Clear all filters
          </button>
        </>
      )}
      
      {!query && !hasFilters && (
        <p className="text-gray-600 text-center">
          Start typing to search for delicious recipes
        </p>
      )}
      
      {/* Suggestions */}
      <div className="mt-8 w-full max-w-md">
        <p className="text-sm text-gray-500 mb-3">Try searching for:</p>
        <div className="flex flex-wrap gap-2">
          {['pasta', 'chicken', 'salad', 'dessert', 'vegan'].map((suggestion) => (
            <button
              key={suggestion}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
              onClick={() => {
                // Trigger search with suggestion
                const searchInput = document.querySelector<HTMLInputElement>('[data-search-input]');
                if (searchInput) {
                  searchInput.value = suggestion;
                  searchInput.dispatchEvent(new Event('input', { bubbles: true }));
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
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mb-6">
        <ChefHat className="w-12 h-12 text-primary" />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-3">
        Discover Amazing Recipes
      </h2>
      
      <p className="text-gray-600 text-center max-w-md mb-8">
        Search through thousands of delicious recipes. Find your next favorite meal!
      </p>
      
      {/* Popular categories */}
      <div className="w-full max-w-2xl">
        <h3 className="text-sm font-semibold text-gray-700 mb-4 text-center">
          Popular Categories
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { name: 'Quick & Easy', icon: '⚡', query: 'time:0-30' },
            { name: 'Healthy', icon: '🥗', query: 'tags:healthy' },
            { name: 'Desserts', icon: '🍰', query: 'tags:dessert' },
            { name: 'Vegetarian', icon: '🥦', query: 'tags:vegetarian' },
            { name: 'Comfort Food', icon: '🍲', query: 'tags:comfort' },
            { name: 'International', icon: '🌍', query: 'cuisine:asian,italian,mexican' },
          ].map((category) => (
            <button
              key={category.name}
              className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:border-primary hover:shadow-sm transition-all"
              onClick={() => {
                // Trigger search with category
                console.log('Search for:', category.query);
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
export function SearchErrorState({ 
  error,
  onRetry 
}: { 
  error?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <Filter className="w-10 h-10 text-red-500" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Something went wrong
      </h3>
      
      <p className="text-gray-600 text-center mb-6 max-w-md">
        {error || 'We encountered an error while searching. Please try again.'}
      </p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Try again
        </button>
      )}
    </div>
  );
}