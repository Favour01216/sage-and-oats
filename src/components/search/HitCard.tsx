"use client";

import RecipeCard from "@/src/components/RecipeCard";

interface HitCardProps {
  hit: {
    objectID: string;
    id: string;
    slug: string;
    title: string;
    imageUrl?: string;
    hero_image_url?: string;
    tags: string[];
    cuisine: string;
    total_minutes: number;
    avg_rating: number;
    calories_per_serving: number;
    hearts: number;
    _highlightResult?: {
      title?: {
        value: string;
      };
    };
  };
}

export default function HitCard({ hit }: HitCardProps) {
  // Use highlighted title if available, otherwise fallback to regular title
  const displayTitle = hit._highlightResult?.title?.value || hit.title;

  // Use imageUrl if available, otherwise fallback to hero_image_url
  const imageUrl = hit.imageUrl || hit.hero_image_url;

  return (
    <RecipeCard
      href={`/recipe/${hit.id}`}
      recipeId={hit.id}
      imageUrl={imageUrl}
      title={displayTitle}
      tags={hit.tags || []}
      totalMinutes={hit.total_minutes}
      hearts={hit.hearts || 0}
      rating={hit.avg_rating}
    />
  );
}
