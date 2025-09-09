/**
 * SafeImage component with fallback and CLS prevention
 */

'use client';

import { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';

interface SafeImageProps extends Omit<ImageProps, 'onError'> {
  fallbackSrc?: string;
  aspectRatio?: string; // e.g., "16/9", "4/3", "1/1"
}

const DEFAULT_FALLBACK = '/images/placeholder-recipe.jpg';

/**
 * SafeImage wrapper component
 * - Provides error handling with fallback
 * - Prevents CLS with proper sizing
 * - Optimizes loading with responsive sizes
 */
export function SafeImage({
  src,
  alt,
  fallbackSrc = DEFAULT_FALLBACK,
  aspectRatio,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  className = '',
  priority = false,
  ...props
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [isError, setIsError] = useState(false);
  
  useEffect(() => {
    setImgSrc(src);
    setIsError(false);
  }, [src]);
  
  const handleError = () => {
    if (!isError) {
      setIsError(true);
      setImgSrc(fallbackSrc);
    }
  };
  
  // If Next Image fails completely, fall back to native img
  if (isError && imgSrc === fallbackSrc) {
    return (
      <div 
        className={`relative overflow-hidden bg-gray-100 ${className}`}
        style={aspectRatio ? { aspectRatio } : undefined}
      >
        <img
          src={fallbackSrc}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Last resort: hide broken image
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        {/* Fallback overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <svg
            className="w-12 h-12 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      </div>
    );
  }
  
  // Wrapper div for aspect ratio if specified
  if (aspectRatio) {
    return (
      <div 
        className={`relative overflow-hidden ${className}`}
        style={{ aspectRatio }}
      >
        <Image
          src={imgSrc}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          onError={handleError}
          className="object-cover"
          {...props}
        />
      </div>
    );
  }
  
  // Regular Image component
  return (
    <Image
      src={imgSrc}
      alt={alt}
      sizes={sizes}
      priority={priority}
      onError={handleError}
      className={className}
      {...props}
    />
  );
}

/**
 * Recipe card image with optimized settings
 */
export function RecipeCardImage({
  src,
  alt,
  priority = false,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  return (
    <SafeImage
      src={src}
      alt={alt}
      width={400}
      height={300}
      aspectRatio="4/3"
      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
      priority={priority}
      className="w-full h-full"
    />
  );
}

/**
 * Recipe hero image with optimized settings
 */
export function RecipeHeroImage({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  return (
    <SafeImage
      src={src}
      alt={alt}
      width={1200}
      height={600}
      aspectRatio="2/1"
      sizes="100vw"
      priority
      className="w-full h-full"
    />
  );
}