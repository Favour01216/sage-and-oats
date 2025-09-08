'use client'

import { cn } from '@/src/lib/utils';

interface SearchResultsSkeletonProps {
  count?: number;
  className?: string;
}

export function SearchResultsSkeleton({ 
  count = 12, 
  className 
}: SearchResultsSkeletonProps) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6", className)}>
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm animate-pulse"
        >
          {/* Image skeleton */}
          <div className="aspect-[4/3] md:aspect-[16/9] bg-gray-200 dark:bg-gray-700" />
          
          {/* Content skeleton */}
          <div className="p-4 space-y-3">
            {/* Title skeleton */}
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-md w-3/4" />
            
            {/* Tags skeleton */}
            <div className="flex gap-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-16" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-12" />
            </div>
            
            {/* Meta info skeleton */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-8" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12" />
              </div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-6" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function SearchHeaderSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
    </div>
  );
}