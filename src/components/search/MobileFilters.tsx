"use client";

import { useState } from "react";
import { X, Filter } from "lucide-react";
import FacetsSidebar from "./FacetsSidebar";

export default function MobileFilters() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 lg:hidden"
      >
        <Filter className="h-4 w-4" />
        Filters
      </button>

      {/* Mobile Filters Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)} />

          {/* Drawer */}
          <div className="absolute right-0 top-0 h-full w-80 max-w-[90vw] bg-background shadow-xl dark:bg-background-dark">
            <div className="flex items-center justify-between border-b border-border p-4 dark:border-border-dark">
              <h3 className="text-lg font-semibold">Filters</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-2 transition-colors hover:bg-muted/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="h-full overflow-y-auto p-4">
              <FacetsSidebar />
            </div>

            <div className="border-t border-border p-4 dark:border-border-dark">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full rounded-lg bg-primary px-4 py-3 text-white transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
