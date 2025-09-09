/**
 * Search skeleton components for loading states
 */

import React from 'react';

/**
 * Skeleton for a single recipe card
 */
export function RecipeCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-200 rounded-lg overflow-hidden">
        {/* Image skeleton */}
        <div className="w-full h-48 bg-gray-300" />
        
        {/* Content skeleton */}
        <div className="p-4 space-y-3">
          {/* Title */}
          <div className="h-6 bg-gray-300 rounded w-3/4" />
          
          {/* Description */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded" />
            <div className="h-4 bg-gray-300 rounded w-5/6" />
          </div>
          
          {/* Meta info */}
          <div className="flex gap-4 pt-2">
            <div className="h-4 bg-gray-300 rounded w-16" />
            <div className="h-4 bg-gray-300 rounded w-20" />
            <div className="h-4 bg-gray-300 rounded w-16" />
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
      <div className="h-10 bg-gray-200 rounded-lg" />
      
      {/* Filter buttons skeleton */}
      <div className="flex gap-2 flex-wrap">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-8 w-20 bg-gray-200 rounded-full" />
        ))}
      </div>
      
      {/* Active filters skeleton */}
      <div className="flex gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-6 w-24 bg-gray-200 rounded-full" />
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
        <div className="h-10 bg-gray-200 rounded w-1/3 mb-4 animate-pulse" />
        <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse" />
      </div>
      
      {/* Filters and results */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
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