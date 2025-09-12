"use client";

import { useState } from "react";
import { X, Filter, Clock, ChefHat, Leaf } from "lucide-react";

interface FilterBarProps {
  onFiltersChange: (filters: { tags: string[]; maxTime?: number; difficulty?: string[] }) => void;
  initialFilters?: {
    tags: string[];
    maxTime?: number;
    difficulty?: string[];
  };
}

export function FilterBar({ onFiltersChange, initialFilters }: FilterBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>(initialFilters?.tags || []);
  const [maxTime, setMaxTime] = useState<number | undefined>(initialFilters?.maxTime);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string[]>(
    initialFilters?.difficulty || [],
  );

  const popularTags = [
    "vegan",
    "vegetarian",
    "gluten-free",
    "dairy-free",
    "high-protein",
    "low-carb",
    "keto",
    "paleo",
    "quick",
    "meal-prep",
    "one-pot",
    "no-bake",
  ];

  const timeOptions = [
    { label: "15 min", value: 15 },
    { label: "30 min", value: 30 },
    { label: "45 min", value: 45 },
    { label: "1 hour", value: 60 },
    { label: "2 hours", value: 120 },
  ];

  const difficultyOptions = ["easy", "medium", "hard"];

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newTags);
    applyFilters(newTags, maxTime, selectedDifficulty);
  };

  const handleTimeSelect = (time: number | undefined) => {
    setMaxTime(time);
    applyFilters(selectedTags, time, selectedDifficulty);
  };

  const handleDifficultyToggle = (difficulty: string) => {
    const newDifficulty = selectedDifficulty.includes(difficulty)
      ? selectedDifficulty.filter(d => d !== difficulty)
      : [...selectedDifficulty, difficulty];
    setSelectedDifficulty(newDifficulty);
    applyFilters(selectedTags, maxTime, newDifficulty);
  };

  const applyFilters = (tags: string[], time?: number, difficulty?: string[]) => {
    onFiltersChange({
      tags,
      maxTime: time,
      difficulty: difficulty?.length ? difficulty : undefined,
    });
  };

  const clearFilters = () => {
    setSelectedTags([]);
    setMaxTime(undefined);
    setSelectedDifficulty([]);
    onFiltersChange({ tags: [] });
  };

  const activeFilterCount = selectedTags.length + (maxTime ? 1 : 0) + selectedDifficulty.length;

  return (
    <>
      {/* Filter Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 transition-colors hover:bg-muted/10 dark:border-border-dark dark:bg-surface-dark"
      >
        <Filter className="h-4 w-4" />
        <span>Filters</span>
        {activeFilterCount > 0 && (
          <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-white">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Filter Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setIsOpen(false)}>
          <div
            className="absolute right-0 top-0 h-full w-full max-w-md bg-background shadow-xl dark:bg-background-dark"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border p-6 dark:border-border-dark">
              <h2 className="text-xl font-semibold text-text dark:text-text-dark">Filters</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-2 transition-colors hover:bg-muted/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[calc(100vh-200px)] space-y-8 overflow-y-auto p-6">
              {/* Tags */}
              <div>
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-text dark:text-text-dark">
                  <Leaf className="h-5 w-5" />
                  Dietary Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => handleTagToggle(tag)}
                      className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                        selectedTags.includes(tag)
                          ? "bg-primary text-white"
                          : "border border-border bg-surface hover:bg-muted/10 dark:border-border-dark dark:bg-surface-dark"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cook Time */}
              <div>
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-text dark:text-text-dark">
                  <Clock className="h-5 w-5" />
                  Max Cook Time
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {timeOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() =>
                        handleTimeSelect(maxTime === option.value ? undefined : option.value)
                      }
                      className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                        maxTime === option.value
                          ? "bg-primary text-white"
                          : "border border-border bg-surface hover:bg-muted/10 dark:border-border-dark dark:bg-surface-dark"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-text dark:text-text-dark">
                  <ChefHat className="h-5 w-5" />
                  Difficulty
                </h3>
                <div className="flex gap-2">
                  {difficultyOptions.map(difficulty => (
                    <button
                      key={difficulty}
                      onClick={() => handleDifficultyToggle(difficulty)}
                      className={`rounded-lg px-4 py-2 capitalize transition-colors ${
                        selectedDifficulty.includes(difficulty)
                          ? "bg-primary text-white"
                          : "border border-border bg-surface hover:bg-muted/10 dark:border-border-dark dark:bg-surface-dark"
                      }`}
                    >
                      {difficulty}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 border-t border-border bg-background p-6 dark:border-border-dark dark:bg-background-dark">
              <div className="flex gap-3">
                <button
                  onClick={clearFilters}
                  className="flex-1 rounded-lg border border-border px-4 py-2 transition-colors hover:bg-muted/10 dark:border-border-dark"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex-1 rounded-lg bg-primary px-4 py-2 text-white transition-colors hover:bg-primary/90"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
