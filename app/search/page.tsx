"use client";

import { useExternalSearch } from "@/src/lib/hooks";
import RecipeCard from "@/src/components/RecipeCard";
import { useMemo, useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  Search,
  Filter,
  X,
  Clock,
  Star,
  ChevronDown,
  Utensils,
} from "lucide-react";

function LiveResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // local UI state that mirrors your facets/filters
  const [q, setQ] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [cuisine, setCuisine] = useState<string[]>([]);
  const [time, setTime] = useState<{ min?: number; max?: number }>({});
  const [cal, setCal] = useState<{ min?: number; max?: number }>({});
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<
    "relevance" | "time" | "rating" | "alphabetical"
  >("relevance");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Initialize state from URL parameters
  useEffect(() => {
    const urlQ = searchParams.get("q") || "";
    const urlTags = searchParams.getAll("tags");
    const urlCuisine = searchParams.getAll("cuisine");
    const urlTime = searchParams.get("time");
    const urlSortBy = searchParams.get("sortBy") as
      | "relevance"
      | "time"
      | "rating"
      | "alphabetical";

    setQ(urlQ);
    setTags(urlTags);
    setCuisine(urlCuisine);
    if (urlSortBy) setSortBy(urlSortBy);

    // Handle time filter (e.g., "30" means max 30 minutes)
    if (urlTime) {
      const timeValue = parseInt(urlTime, 10);
      if (!isNaN(timeValue)) {
        setTime({ max: timeValue });
      }
    }

    setPage(1);
  }, [searchParams]); // Update URL when filters change
  const updateURL = (newParams: Record<string, any>) => {
    const params = new URLSearchParams();

    if (newParams.q) params.set("q", newParams.q);
    newParams.tags?.forEach((tag: string) => params.append("tags", tag));
    newParams.cuisine?.forEach((c: string) => params.append("cuisine", c));
    if (newParams.time?.max) params.set("time", newParams.time.max.toString());
    if (newParams.sortBy && newParams.sortBy !== "relevance")
      params.set("sortBy", newParams.sortBy);
    if (newParams.page && newParams.page > 1)
      params.set("page", newParams.page.toString());

    router.push(`${pathname}?${params.toString()}`);
  };

  // Predefined options
  const availableTags = [
    "vegetarian",
    "vegan",
    "gluten-free",
    "dairy-free",
    "keto",
    "low-carb",
    "high-protein",
    "quick",
    "easy",
    "healthy",
    "dessert",
    "breakfast",
    "lunch",
    "dinner",
    "snack",
  ];

  const availableCuisines = [
    "american",
    "italian",
    "mexican",
    "chinese",
    "indian",
    "french",
    "japanese",
    "thai",
    "mediterranean",
    "greek",
    "spanish",
    "korean",
    "middle eastern",
    "german",
    "british",
  ];

  const { data, total, isLoading } = useExternalSearch({
    q,
    tags,
    cuisine,
    page,
    perPage: 24,
    time,
    calories: cal,
  });

  // Apply client-side sorting
  const sortedData = useMemo(() => {
    if (!data) return null;

    const sorted = [...data];

    switch (sortBy) {
      case "alphabetical":
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case "time":
        return sorted.sort(
          (a, b) => (a.total_minutes || 0) - (b.total_minutes || 0)
        );
      case "rating":
        return sorted.sort((a, b) => (b.avg_rating || 0) - (a.avg_rating || 0));
      case "relevance":
      default:
        return sorted; // Keep original order for relevance
    }
  }, [data, sortBy]);

  // Helper functions
  const toggleTag = (tag: string) => {
    const newTags = tags.includes(tag)
      ? tags.filter((t) => t !== tag)
      : [...tags, tag];
    setTags(newTags);
    setPage(1);
    updateURL({ q, tags: newTags, cuisine, time, page: 1 });
  };

  const toggleCuisine = (cuisineType: string) => {
    const newCuisine = cuisine.includes(cuisineType)
      ? cuisine.filter((c) => c !== cuisineType)
      : [...cuisine, cuisineType];
    setCuisine(newCuisine);
    setPage(1);
    updateURL({ q, tags, cuisine: newCuisine, time, page: 1 });
  };

  const handleSearch = (newQ: string) => {
    setQ(newQ);
    setPage(1);
    updateURL({ q: newQ, tags, cuisine, time, page: 1 });
  };

  const handleTimeFilter = (maxTime?: number) => {
    const newTime = maxTime ? { max: maxTime } : {};
    setTime(newTime);
    setPage(1);
    updateURL({ q, tags, cuisine, time: newTime, page: 1 });
  };

  const clearAllFilters = () => {
    setQ("");
    setTags([]);
    setCuisine([]);
    setTime({});
    setCal({});
    setPage(1);
    updateURL({ q: "", tags: [], cuisine: [], time: {}, page: 1 });
  };

  const hasActiveFilters =
    q ||
    tags.length > 0 ||
    cuisine.length > 0 ||
    time.min ||
    time.max ||
    cal.min ||
    cal.max;

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <header className="flex items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-text dark:text-text-dark">
          Search Recipes
        </h1>
        <div className="text-sm text-muted dark:text-muted-dark">Search</div>
      </header>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch(q);
            }
          }}
          onBlur={() => handleSearch(q)}
          placeholder="Search for recipes..."
          className="w-full pl-12 pr-4 py-4 rounded-xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark text-text dark:text-text-dark outline-none focus-visible:ring-2 focus-visible:ring-primary/40 text-lg"
        />
      </div>

      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
            showMobileFilters || hasActiveFilters
              ? "bg-primary text-white border-primary"
              : "bg-surface dark:bg-surface-dark text-text dark:text-text-dark border-border dark:border-border-dark"
          }`}
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="bg-white text-primary text-xs px-2 py-0.5 rounded-full">
              {[
                tags.length,
                cuisine.length,
                time.min || time.max ? 1 : 0,
                cal.min || cal.max ? 1 : 0,
              ].reduce((a, b) => a + b, 0)}
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              showMobileFilters ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
        {/* Filters Sidebar */}
        <aside
          className={`space-y-6 ${
            showMobileFilters ? "block" : "hidden lg:block"
          }`}
        >
          <div className="bg-surface dark:bg-surface-dark rounded-xl border border-border dark:border-border-dark p-6 space-y-6">
            {/* Clear Filters */}
            {hasActiveFilters && (
              <div className="flex justify-between items-center pb-4 border-b border-border dark:border-border-dark">
                <span className="text-sm font-medium text-text dark:text-text-dark">
                  Active Filters
                </span>
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-primary hover:text-primary/80 underline"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Diet/Tags Filter */}
            <div>
              <h3 className="font-semibold text-text dark:text-text-dark mb-3">
                Diet & Preferences
              </h3>
              <div className="space-y-2">
                {availableTags.map((tag) => (
                  <label
                    key={tag}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={tags.includes(tag)}
                      onChange={() => toggleTag(tag)}
                      className="rounded border-border dark:border-border-dark text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-text dark:text-text-dark capitalize">
                      {tag.replace("-", " ")}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Cuisine Filter */}
            <div>
              <h3 className="font-semibold text-text dark:text-text-dark mb-3">
                <Utensils className="w-4 h-4 inline mr-1" />
                Cuisine
              </h3>
              <div className="space-y-2">
                {availableCuisines.map((cuisineType) => (
                  <label
                    key={cuisineType}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={cuisine.includes(cuisineType)}
                      onChange={() => toggleCuisine(cuisineType)}
                      className="rounded border-border dark:border-border-dark text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-text dark:text-text-dark capitalize">
                      {cuisineType}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Time Filter */}
            <div>
              <h3 className="font-semibold text-text dark:text-text-dark mb-3">
                <Clock className="w-4 h-4 inline mr-1" />
                Cooking Time (minutes)
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-muted dark:text-muted-dark mb-1">
                    Minimum
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={time.min || ""}
                    onChange={(e) => {
                      const newTime = {
                        ...time,
                        min: e.target.value
                          ? parseInt(e.target.value)
                          : undefined,
                      };
                      setTime(newTime);
                      setPage(1);
                      updateURL({ q, tags, cuisine, time: newTime, page: 1 });
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-border dark:border-border-dark bg-surface dark:bg-surface-dark text-text dark:text-text-dark text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted dark:text-muted-dark mb-1">
                    Maximum
                  </label>
                  <input
                    type="number"
                    placeholder="∞"
                    value={time.max || ""}
                    onChange={(e) => {
                      const newTime = {
                        ...time,
                        max: e.target.value
                          ? parseInt(e.target.value)
                          : undefined,
                      };
                      setTime(newTime);
                      setPage(1);
                      updateURL({ q, tags, cuisine, time: newTime, page: 1 });
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-border dark:border-border-dark bg-surface dark:bg-surface-dark text-text dark:text-text-dark text-sm"
                  />
                </div>
                {/* Quick time presets */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "≤ 15min", min: undefined, max: 15 },
                    { label: "≤ 30min", min: undefined, max: 30 },
                    { label: "≤ 60min", min: undefined, max: 60 },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => {
                        const newTime = { min: preset.min, max: preset.max };
                        setTime(newTime);
                        setPage(1);
                        updateURL({ q, tags, cuisine, time: newTime, page: 1 });
                      }}
                      className="text-xs px-2 py-1 rounded border border-border dark:border-border-dark text-muted dark:text-muted-dark hover:bg-muted/10 dark:hover:bg-muted-dark/10"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Calories Filter */}
            <div>
              <h3 className="font-semibold text-text dark:text-text-dark mb-3">
                Calories per Serving
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-muted dark:text-muted-dark mb-1">
                    Minimum
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={cal.min || ""}
                    onChange={(e) => {
                      setCal((prev) => ({
                        ...prev,
                        min: e.target.value
                          ? parseInt(e.target.value)
                          : undefined,
                      }));
                      setPage(1);
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-border dark:border-border-dark bg-surface dark:bg-surface-dark text-text dark:text-text-dark text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted dark:text-muted-dark mb-1">
                    Maximum
                  </label>
                  <input
                    type="number"
                    placeholder="∞"
                    value={cal.max || ""}
                    onChange={(e) => {
                      setCal((prev) => ({
                        ...prev,
                        max: e.target.value
                          ? parseInt(e.target.value)
                          : undefined,
                      }));
                      setPage(1);
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-border dark:border-border-dark bg-surface dark:bg-surface-dark text-text dark:text-text-dark text-sm"
                  />
                </div>
                {/* Quick calorie presets */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "≤ 200", min: undefined, max: 200 },
                    { label: "≤ 400", min: undefined, max: 400 },
                    { label: "≤ 600", min: undefined, max: 600 },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => {
                        setCal({ min: preset.min, max: preset.max });
                        setPage(1);
                      }}
                      className="text-xs px-2 py-1 rounded border border-border dark:border-border-dark text-muted dark:text-muted-dark hover:bg-muted/10 dark:hover:bg-muted-dark/10"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Results Section */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <p className="text-sm text-muted dark:text-muted-dark">
              {total ?? 0} results {q && `for "${q}"`}
            </p>

            {/* Sort Options */}
            <select
              value={sortBy}
              onChange={(e) => {
                const newSortBy = e.target.value as any;
                setSortBy(newSortBy);
                updateURL({
                  q,
                  tags,
                  cuisine,
                  time,
                  sortBy: newSortBy,
                  page: 1,
                });
              }}
              className="px-3 py-2 rounded-lg border border-border dark:border-border-dark bg-surface dark:bg-surface-dark text-text dark:text-text-dark text-sm"
            >
              <option value="relevance">Most Relevant</option>
              <option value="rating">Highest Rated</option>
              <option value="time">Quickest First</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
          </div>

          {/* Active Filter Tags */}
          {hasActiveFilters && (
            <div className="mb-6 flex flex-wrap gap-2">
              {q && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                  Search: "{q}"
                  <button
                    onClick={() => {
                      setQ("");
                      setPage(1);
                    }}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                >
                  {tag.replace("-", " ")}
                  <button onClick={() => toggleTag(tag)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {cuisine.map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                >
                  {c}
                  <button onClick={() => toggleCuisine(c)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {(time.min || time.max) && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                  Time: {time.min || 0}-{time.max || "∞"} min
                  <button
                    onClick={() => {
                      setTime({});
                      setPage(1);
                    }}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {(cal.min || cal.max) && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                  Calories: {cal.min || 0}-{cal.max || "∞"}
                  <button
                    onClick={() => {
                      setCal({});
                      setPage(1);
                    }}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-surface dark:bg-surface-dark rounded-lg overflow-hidden shadow-sm animate-pulse"
                >
                  <div className="aspect-[4/3] bg-muted/20 dark:bg-muted-dark/20" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-muted/20 dark:bg-muted-dark/20 rounded w-3/4" />
                    <div className="h-3 bg-muted/20 dark:bg-muted-dark/20 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : sortedData && sortedData.length ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedData.map((hit) => (
                  <RecipeCard
                    key={hit.id}
                    href={`/recipe/${encodeURIComponent(hit.id)}`}
                    recipeId={hit.id}
                    imageUrl={hit.imageUrl}
                    title={hit.title}
                    tags={hit.tags}
                    totalMinutes={hit.total_minutes}
                    hearts={0} // Will be loaded separately from Supabase
                    rating={hit.avg_rating ?? 0}
                  />
                ))}
              </div>
              {/* Simple pager */}
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  className="px-3 py-2 rounded-md border border-border dark:border-border-dark bg-surface dark:bg-surface-dark disabled:opacity-50"
                  disabled={page <= 1}
                  onClick={() => {
                    const newPage = Math.max(1, page - 1);
                    setPage(newPage);
                    updateURL({ q, tags, cuisine, time, page: newPage });
                  }}
                >
                  Prev
                </button>
                <span className="text-sm text-text dark:text-text-dark">
                  Page {page} {total && `of ${Math.ceil(total / 24)}`}
                </span>
                <button
                  className="px-3 py-2 rounded-md border border-border dark:border-border-dark bg-surface dark:bg-surface-dark disabled:opacity-50"
                  disabled={
                    !sortedData ||
                    sortedData.length === 0 ||
                    (total ?? 0) <= page * 24
                  }
                  onClick={() => {
                    const newPage = page + 1;
                    setPage(newPage);
                    updateURL({ q, tags, cuisine, time, page: newPage });
                  }}
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <div className="text-sm text-muted dark:text-muted-dark">
              No recipes match your filters.
            </div>
          )}
        </section>
      </div>
    </section>
  );
}

export default function SearchPage() {
  return <LiveResults />;
}
