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
  const secureImageUrl = imageUrl?.replace(/^http:\/\//i, 'https://');
  return (
    <div
      className={cn(
        "group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 relative",
        className
      )}
      data-testid="recipe-card"
    >
      <Link href={href} className="block" aria-label={`Open recipe: ${title}`}>
        <div className="aspect-[4/3] md:aspect-[16/9] relative overflow-hidden">
          {secureImageUrl ? (
            <SafeImage
              src={secureImageUrl}
              alt={title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              priority={priority}
              unoptimized={secureImageUrl.includes("edamam") || secureImageUrl.includes("amazonaws")}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20" />
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 className="font-semibold text-lg mb-2 line-clamp-2">{title}</h3>

            <div className="flex items-center gap-4 text-sm">
              {totalMinutes && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{totalMinutes} min</span>
                </div>
              )}

              {rating && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{rating.toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* Heart button overlay with count badge */}
      <div className="absolute top-2 right-2 z-10">
        <HeartButton
          recipeId={recipeId}
          recipeSlug={recipeSlug}
          initialCount={hearts}
          size="sm"
          showCount={false}
          className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
        />
        {hearts && hearts > 0 && (
          <div 
            className="absolute -bottom-1 -right-1 bg-accent text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center"
            title={`Saved by ${hearts} ${hearts === 1 ? 'person' : 'people'}`}
          >
            {hearts}
          </div>
        )}
      </div>

      {/* Tags below image */}
      {tags.length > 0 && (
        <div className="p-4">
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600"
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
RecipeCard.Skeleton = function RecipeCardSkeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm",
        className
      )}
    >
      <SkeletonCard />
    </div>
  );
};
