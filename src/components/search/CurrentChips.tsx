"use client";

import { CurrentRefinements, ClearRefinements } from "react-instantsearch";

export default function CurrentChips() {
  return (
    <div className="flex items-center gap-3">
      <CurrentRefinements
        classNames={{
          root: "flex-1",
          list: "flex flex-wrap gap-2",
          item: "inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium",
          label: "flex items-center gap-2",
          categoryLabel: "font-semibold",
          delete: "ml-1 p-0.5 hover:bg-primary/20 rounded-full transition-colors",
        }}
      />
      <ClearRefinements
        classNames={{
          root: "shrink-0",
          button:
            "px-4 py-2 text-sm border border-border dark:border-border-dark rounded-lg hover:bg-muted/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
        }}
      />
    </div>
  );
}
