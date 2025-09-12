"use client";
import { getOptimizedImageProps } from "@/src/lib/image-optimization";
import { SafeImage } from "./SafeImage";

export default function RecipeHero({ src, alt }: { src: string; alt: string }) {
  // Check if this is an Edamam image with signed URL
  const isEdamamImage = src?.includes("edamam-product-images.s3.amazonaws.com");

  return (
    <div
      className="relative h-[48vh] w-full overflow-hidden md:h-[60vh]"
      style={{ height: "60vh" }} // fallback if Tailwind isn't active
      data-testid="recipe-hero"
    >
      {isEdamamImage ? (
        // For Edamam images, use SafeImage with unoptimized flag
        <SafeImage
          src={src}
          alt={alt}
          fill
          sizes="100vw"
          priority
          className="object-cover"
          unoptimized
        />
      ) : (
        (() => {
          // For other images, use the optimization utility
          const imageProps = getOptimizedImageProps(src, alt, {
            size: "xxlarge",
            priority: true,
            responsive: true,
          });

          return imageProps ? (
            <SafeImage {...imageProps} fill sizes="100vw" className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
              <div className="text-center text-gray-500">
                <p className="text-2xl font-medium">{alt}</p>
                <p className="text-sm opacity-75">Image not available</p>
              </div>
            </div>
          );
        })()
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
    </div>
  );
}
