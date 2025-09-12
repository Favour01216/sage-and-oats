/**
 * Recipe Image Optimization Utilities
 * Handles both Spoonacular and Edamam API images with blur placeholders for better UX
 */

export interface SpoonacularImageSizes {
  thumbnail: string; // 90x90 - for tiny thumbnails
  small: string; // 240x150 - for mobile cards
  medium: string; // 312x231 - for desktop cards
  large: string; // 480x360 - for larger cards
  xlarge: string; // 556x370 - for detail pages
  xxlarge: string; // 636x393 - highest quality
}

/**
 * Detect image source type
 */
function getImageSourceType(url: string): "spoonacular" | "edamam" | "other" {
  if (url.includes("img.spoonacular.com")) return "spoonacular";
  if (url.includes("edamam-product-images.s3.amazonaws.com")) return "edamam";
  return "other";
}

/**
 * Generate all available sizes for a Spoonacular image URL
 */
export function getSpoonacularImageSizes(
  originalUrl: string | null | undefined,
): SpoonacularImageSizes | null {
  if (!originalUrl) return null;

  // Extract base URL and extension
  const baseUrl = originalUrl.replace(/-\d+x\d+/, "").replace(/\.[^/.]+$/, "");
  const extension = originalUrl.split(".").pop() || "jpg";

  return {
    thumbnail: `${baseUrl}-90x90.${extension}`,
    small: `${baseUrl}-240x150.${extension}`,
    medium: `${baseUrl}-312x231.${extension}`,
    large: `${baseUrl}-480x360.${extension}`,
    xlarge: `${baseUrl}-556x370.${extension}`,
    xxlarge: `${baseUrl}-636x393.${extension}`,
  };
}

/**
 * Get the best image size for a given use case
 */
export function getBestImageSize(
  originalUrl: string | null | undefined,
  size: keyof SpoonacularImageSizes = "xxlarge",
): string | null {
  if (!originalUrl) return null;

  const sourceType = getImageSourceType(originalUrl);

  // For Edamam images, return the original URL as-is (they're already optimized)
  if (sourceType === "edamam") {
    return originalUrl;
  }

  // For Spoonacular images, generate the appropriate size
  if (sourceType === "spoonacular") {
    const sizes = getSpoonacularImageSizes(originalUrl);
    return sizes ? sizes[size] : null;
  }

  // For other sources, return as-is
  return originalUrl;
}

/**
 * Generate a simple blur placeholder for better loading UX
 * Creates a tiny, blurred version of the image
 */
export function getBlurDataURL(imageUrl: string | null | undefined): string {
  if (!imageUrl) {
    // Default placeholder for missing images
    return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjM2IiBoZWlnaHQ9IjM5MyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzk3OTc5NyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pjwvc3ZnPg==";
  }

  // For Edamam images, don't try to generate blur from URL manipulation
  const sourceType = getImageSourceType(imageUrl);

  if (sourceType === "edamam") {
    // Return a simple gradient placeholder for Edamam images
    return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjM2IiBoZWlnaHQ9IjM5MyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmM2Y0ZjYiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNlNWU3ZWIiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2cpIi8+PC9zdmc+";
  }

  // Create a blurred version using the smallest size for Spoonacular
  const smallImage = getBestImageSize(imageUrl, "thumbnail");

  // For now, return a simple gray placeholder
  // In production, you might want to use a service like Plaiceholder or generate actual blur hashes
  return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjM2IiBoZWlnaHQ9IjM5MyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmM2Y0ZjYiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNlNWU3ZWIiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2cpIi8+PC9zdmc+";
}

/**
 * Generate responsive image sizes for different breakpoints
 */
export function getResponsiveSizes(
  breakpoints: {
    mobile?: keyof SpoonacularImageSizes;
    tablet?: keyof SpoonacularImageSizes;
    desktop?: keyof SpoonacularImageSizes;
  } = {},
): string {
  const { mobile = "medium", tablet = "large", desktop = "xxlarge" } = breakpoints;

  return `(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw`;
}

/**
 * Get Next.js Image props optimized for Spoonacular images
 */
export function getOptimizedImageProps(
  imageUrl: string | null | undefined,
  alt: string,
  options: {
    size?: keyof SpoonacularImageSizes;
    priority?: boolean;
    responsive?: boolean;
  } = {},
) {
  const { size = "xxlarge", priority = false, responsive = true } = options;

  const optimizedUrl = getBestImageSize(imageUrl, size);
  const blurDataURL = getBlurDataURL(imageUrl);

  // Return null if no valid image URL
  if (!optimizedUrl) {
    return null;
  }

  return {
    src: optimizedUrl,
    alt,
    blurDataURL,
    placeholder: "blur" as const,
    priority,
    sizes: responsive ? getResponsiveSizes() : undefined,
  };
}
