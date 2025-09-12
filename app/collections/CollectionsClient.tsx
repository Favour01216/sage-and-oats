"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import RecipeCard from "@/src/components/RecipeCard";
import Button from "@/src/components/ui/Button";
import Link from "next/link";
import { type CardData } from "@/src/lib/cards/mapToCard";

// Client component for anonymous users who use localStorage
export default function CollectionsClient() {
  const [recipes, setRecipes] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLocalHearts() {
      try {
        // Get hearts from localStorage
        const localHearts = JSON.parse(localStorage.getItem("hearts") || "[]");

        if (localHearts.length > 0) {
          // Fetch recipe details from API
          const response = await fetch("/api/collections/hydrate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ recipeIds: localHearts }),
          });

          if (response.ok) {
            const data = await response.json();
            setRecipes(data.recipes || []);
          }
        }
      } catch (error) {
        console.error("Failed to load local hearts:", error);
      } finally {
        setLoading(false);
      }
    }

    loadLocalHearts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your collection...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <Heart className="h-8 w-8 fill-current text-accent" />
            <h1 className="font-serif text-3xl font-bold text-gray-900 dark:text-gray-100">
              My Collection
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {recipes.length} saved recipe{recipes.length !== 1 ? "s" : ""}
          </p>
        </div>

        {recipes.length === 0 ? (
          /* Empty State */
          <div className="py-16 text-center">
            <Heart className="mx-auto mb-4 h-16 w-16 text-gray-300 dark:text-gray-600" />
            <h2 className="mb-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">
              No saved recipes yet
            </h2>
            <p className="mx-auto mb-6 max-w-md text-gray-600 dark:text-gray-400">
              Start exploring recipes and tap the heart icon to save your favorites here.
            </p>
            <Link href="/">
              <Button>Discover Recipes</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {recipes.map((recipe, index) => (
              <RecipeCard
                key={recipe.id}
                href={recipe.href}
                recipeId={recipe.id}
                recipeSlug={recipe.slug}
                imageUrl={recipe.imageUrl}
                title={recipe.title}
                tags={recipe.tags}
                totalMinutes={recipe.total_minutes}
                hearts={recipe.hearts}
                rating={recipe.rating || undefined}
                priority={index < 4} // Priority for first 4 images
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
