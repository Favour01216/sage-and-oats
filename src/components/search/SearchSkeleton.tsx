/**
 * Search skeleton components for loading states
 */

import React from "react";

/**
 * Skeleton for a single recipe card
 */
export function RecipeCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="overflow-hidden rounded-lg bg-gray-200">
        {/* Image skeleton */}
        <div className="h-48 w-full bg-gray-300" />

        {/* Content skeleton */}
        <div className="space-y-3 p-4">
          {/* Title */}
          <div className="h-6 w-3/4 rounded bg-gray-300" />

          {/* Description */}
          <div className="space-y-2">
            <div className="h-4 rounded bg-gray-300" />
            <div className="h-4 w-5/6 rounded bg-gray-300" />
          </div>

          {/* Meta info */}
          <div className="flex gap-4 pt-2">
            <div className="h-4 w-16 rounded bg-gray-300" />
            <div className="h-4 w-20 rounded bg-gray-300" />
            <div className="h-4 w-16 rounded bg-gray-300" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for search results grid
 */
export function SearchResultsSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <RecipeCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Skeleton for search filters
 */
export function SearchFiltersSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {/* Search input skeleton */}
      <div className="h-10 rounded-lg bg-gray-200" />

      {/* Filter buttons skeleton */}
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-8 w-20 rounded-full bg-gray-200" />
        ))}
      </div>

      {/* Active filters skeleton */}
      <div className="flex gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-6 w-24 rounded-full bg-gray-200" />
        ))}
      </div>
    </div>
  );
}

/**
 * Full page search skeleton
 */
export function SearchPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="mb-4 h-10 w-1/3 animate-pulse rounded bg-gray-200" />
        <div className="h-6 w-1/2 animate-pulse rounded bg-gray-200" />
      </div>

      {/* Filters and results */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Sidebar filters */}
        <div className="lg:col-span-1">
          <SearchFiltersSkeleton />
        </div>

        {/* Results */}
        <div className="lg:col-span-3">
          <SearchResultsSkeleton />
        </div>
      </div>
    </div>
  );
}
