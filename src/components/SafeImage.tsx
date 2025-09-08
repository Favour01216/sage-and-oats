'use client'

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/src/lib/utils";

interface SafeImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  className?: string;
  unoptimized?: boolean;
  fallbackClassName?: string;
}

export function SafeImage({
  src,
  alt,
  width,
  height,
  fill,
  sizes,
  priority,
  className,
  unoptimized,
  fallbackClassName,
  ...props
}: SafeImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // If image failed to load, use fallback
  if (imageError || !src) {
    return (
      <div 
        className={cn(
          "bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center",
          fallbackClassName,
          className
        )}
        {...(width && height ? { style: { width, height } } : {})}
      >
        <span className="text-primary/60 text-sm font-medium">
          {alt || "Recipe Image"}
        </span>
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <div 
          className={cn(
            "absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 animate-pulse",
            className
          )}
        />
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        sizes={sizes}
        priority={priority}
        unoptimized={unoptimized}
        className={cn(
          className,
          isLoading ? "opacity-0" : "opacity-100 transition-opacity duration-300"
        )}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setImageError(true);
          setIsLoading(false);
        }}
        {...props}
      />
    </>
  );
}