import Link from "next/link";
import { Clock, Star } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { SkeletonCard } from "./ui/Shimmer";
import { getOptimizedImageProps } from "@/src/lib/image-optimization";
import { HeartButton } from "./HeartButton";
import { SafeImage } from "./SafeImage";

interface RecipeCardProps {
  href: string;
  recipeId: string;
  recipeSlug?: string;
  imageUrl?: string;
  title: string;
  tags?: string[];
  totalMinutes?: number;
  hearts?: number;
  rating?: number;
  className?: string;
  priority?: boolean;
}

export default function RecipeCard({
  href,
  recipeId,
  recipeSlug,
  imageUrl,
  title,
  tags = [],
  totalMinutes,
  hearts = 0,
  rating,
  className,
  priority = false,
}: RecipeCardProps) {
  // Ensure HTTPS for images
  const secureImageUrl = imageUrl?.replace(/^http:\/\//i, "https://");

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:shadow-md dark:bg-gray-800",
        className,
      )}
      data-testid="recipe-card"
    >
      <Link href={href} className="block" aria-label={`Open recipe: ${title}`}>
        <div className="relative aspect-[4/3] overflow-hidden md:aspect-[16/9]">
          {secureImageUrl ? (
            <SafeImage
              src={secureImageUrl}
              alt={title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              priority={priority}
              unoptimized={
                secureImageUrl.includes("edamam") || secureImageUrl.includes("amazonaws")
              }
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-primary/20 to-accent/20" />
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 className="mb-2 line-clamp-2 text-lg font-semibold">{title}</h3>

            <div className="flex items-center gap-4 text-sm">
              {totalMinutes && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{totalMinutes} min</span>
                </div>
              )}

              {rating && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-current" />
                  <span>{rating.toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* Heart button with integrated count */}
      <div className="absolute right-2 top-2 z-10">
        <HeartButton
          recipeId={recipeId}
          recipeSlug={recipeSlug}
          initialCount={hearts}
          size="sm"
          showCount={true}
          className="border-white/30 bg-white/20 text-white backdrop-blur-sm hover:bg-white/30"
        />
      </div>

      {/* Tags below image */}
      {tags.length > 0 && (
        <div className="p-4">
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full border border-gray-200 bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Skeleton component
RecipeCard.Skeleton = function RecipeCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-gray-800", className)}
    >
      <SkeletonCard />
    </div>
  );
};
