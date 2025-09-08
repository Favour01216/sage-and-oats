"use client";

import { Hits, useInstantSearch } from "react-instantsearch";
import HitCard from "./HitCard";

// Skeleton component for loading state
function RecipeCardSkeleton() {
  return (
    <div className="bg-surface dark:bg-surface-dark rounded-lg overflow-hidden shadow-sm animate-pulse">
      <div className="aspect-[4/3] bg-muted/20 dark:bg-muted-dark/20" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-muted/20 dark:bg-muted-dark/20 rounded w-3/4" />
        <div className="h-3 bg-muted/20 dark:bg-muted-dark/20 rounded w-1/2" />
        <div className="flex gap-2">
          <div className="h-6 bg-muted/20 dark:bg-muted-dark/20 rounded-full w-16" />
          <div className="h-6 bg-muted/20 dark:bg-muted-dark/20 rounded-full w-20" />
        </div>
        <div className="flex items-center justify-between">
          <div className="h-4 bg-muted/20 dark:bg-muted-dark/20 rounded w-16" />
          <div className="h-4 bg-muted/20 dark:bg-muted-dark/20 rounded w-12" />
        </div>
      </div>
    </div>
  );
}

export default function HitsGrid() {
  const { status, results } = useInstantSearch();

  // Show skeleton loading state ONLY when status === "loading" and no results yet
  // Do NOT flip on "stalled" to avoid flash
  const isLoading = status === "loading" && !results;
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, index) => (
          <RecipeCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <Hits
      hitComponent={HitCard}
      classNames={{
        root: "space-y-6",
        list: "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6",
        item: "",
      }}
    />
  );
}
