"use client";

import { Stats, SortBy } from "react-instantsearch";

export default function ResultsToolbar() {
  return (
    <div className="flex items-center justify-between mb-6">
      <Stats
        classNames={{
          root: "text-sm text-muted dark:text-muted-dark",
        }}
      />

      <SortBy
        items={[
          { value: "recipes", label: "Most relevant" },
          { value: "recipes_recent", label: "Newest" },
          { value: "recipes_quick", label: "Fast to cook" },
        ]}
        classNames={{
          root: "flex items-center gap-2",
          select:
            "px-3 py-2 text-sm border border-border dark:border-border-dark rounded-lg bg-background dark:bg-background-dark text-text dark:text-text-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
        }}
      />
    </div>
  );
}
