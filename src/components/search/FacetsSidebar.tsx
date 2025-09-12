"use client";

import { RefinementList, RangeInput, useNumericMenu } from "react-instantsearch";

// Custom Rating Component
function RatingFilter() {
  const { items, refine } = useNumericMenu({
    attribute: "avg_rating",
    items: [
      { label: "4+ stars", start: 4 },
      { label: "3+ stars", start: 3 },
      { label: "2+ stars", start: 2 },
      { label: "1+ stars", start: 1 },
    ],
  });

  return (
    <div className="space-y-2">
      {items.map(item => (
        <div key={item.label} className="flex items-center">
          <label className="flex cursor-pointer items-center gap-2 transition-colors hover:text-primary">
            <input
              type="radio"
              name="rating"
              checked={item.isRefined}
              onChange={() => refine(item.value)}
              className="h-4 w-4 text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            />
            <span className="text-text dark:text-text-dark">{item.label}</span>
          </label>
        </div>
      ))}
    </div>
  );
}

export default function FacetsSidebar() {
  return (
    <aside className="space-y-8">
      {/* Tags */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Tags
        </h3>
        <RefinementList
          attribute="tags"
          limit={10}
          showMore={true}
          searchable={true}
          classNames={{
            root: "space-y-2",
            list: "space-y-2",
            item: "flex items-center",
            label: "flex items-center gap-2 cursor-pointer hover:text-primary transition-colors",
            checkbox:
              "w-4 h-4 text-primary rounded border-border dark:border-border-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
            labelText: "text-text dark:text-text-dark",
            count: "text-sm text-muted dark:text-muted-dark ml-auto",
            searchBox: "mb-3",
            showMore: "text-sm text-primary hover:text-primary/80 transition-colors",
          }}
        />
      </div>

      {/* Cuisine */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Cuisine
        </h3>
        <RefinementList
          attribute="cuisine"
          limit={8}
          searchable={true}
          classNames={{
            root: "space-y-2",
            list: "space-y-2",
            item: "flex items-center",
            label: "flex items-center gap-2 cursor-pointer hover:text-primary transition-colors",
            checkbox:
              "w-4 h-4 text-primary rounded border-border dark:border-border-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
            labelText: "text-text dark:text-text-dark",
            count: "text-sm text-muted dark:text-muted-dark ml-auto",
            searchBox: "mb-3",
          }}
        />
      </div>

      {/* Cook Time */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Cook Time (minutes)
        </h3>
        <RangeInput
          attribute="total_minutes"
          classNames={{
            root: "space-y-3",
            form: "space-y-3",
            label: "text-sm text-muted dark:text-muted-dark",
            input:
              "w-full px-3 py-2 text-sm border border-border dark:border-border-dark rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
            separator: "text-muted dark:text-muted-dark text-center",
            submit:
              "w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
          }}
        />
      </div>

      {/* Calories */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Calories per Serving
        </h3>
        <RangeInput
          attribute="calories_per_serving"
          classNames={{
            root: "space-y-3",
            form: "space-y-3",
            label: "text-sm text-muted dark:text-muted-dark",
            input:
              "w-full px-3 py-2 text-sm border border-border dark:border-border-dark rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
            separator: "text-muted dark:text-muted-dark text-center",
            submit:
              "w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
          }}
        />
      </div>

      {/* Rating */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Rating
        </h3>
        <RatingFilter />
      </div>
    </aside>
  );
}
