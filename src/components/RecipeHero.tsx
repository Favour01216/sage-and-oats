"use client";
import Image from "next/image";
import { getOptimizedImageProps } from "@/src/lib/image-optimization";

export default function RecipeHero({ src, alt }: { src: string; alt: string }) {
  // Check if this is an Edamam image with signed URL
  const isEdamamImage = src?.includes("edamam-product-images.s3.amazonaws.com");

  return (
    <div
      className="relative w-full h-[48vh] md:h-[60vh] overflow-hidden"
      style={{ height: "60vh" }} // fallback if Tailwind isn't active
    >
      {isEdamamImage ? (
        // For Edamam images, use a regular img tag to avoid Next.js optimization issues
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          loading="eager" // Hero images should load immediately
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
            <Image {...imageProps} fill className="object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
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
