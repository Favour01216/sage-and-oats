"use client";

import { cn } from "@/src/lib/utils";

interface SearchResultsSkeletonProps {
  count?: number;
  className?: string;
}

export function SearchResultsSkeleton({ count = 12, className }: SearchResultsSkeletonProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className,
      )}
    >
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="animate-pulse overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-gray-800"
        >
          {/* Image skeleton */}
          <div className="aspect-[4/3] bg-gray-200 md:aspect-[16/9] dark:bg-gray-700" />

          {/* Content skeleton */}
          <div className="space-y-3 p-4">
            {/* Title skeleton */}
            <div className="h-5 w-3/4 rounded-md bg-gray-200 dark:bg-gray-700" />

            {/* Tags skeleton */}
            <div className="flex gap-2">
              <div className="h-4 w-16 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-12 rounded-full bg-gray-200 dark:bg-gray-700" />
            </div>

            {/* Meta info skeleton */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-4 w-8 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-4 w-12 rounded bg-gray-200 dark:bg-gray-700" />
              </div>
              <div className="h-4 w-6 rounded bg-gray-200 dark:bg-gray-700" />
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
      <div className="mb-2 h-8 w-48 rounded bg-gray-200 dark:bg-gray-700" />
      <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700" />
    </div>
  );
}
