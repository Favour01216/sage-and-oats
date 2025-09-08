/**
 * Custom image loader for Next.js
 * Handles different image sources including signed URLs from Edamam
 */

export default function customImageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  // For Edamam S3 URLs with signed parameters, return as-is
  if (src.includes("edamam-product-images.s3.amazonaws.com")) {
    return src;
  }

  // For Spoonacular images, use their sizing system
  if (src.includes("img.spoonacular.com")) {
    // Extract base URL and replace size if present
    const baseUrl = src.replace(/-\d+x\d+/, "");
    const extension = baseUrl.split(".").pop() || "jpg";
    const withoutExt = baseUrl.replace(/\.[^/.]+$/, "");

    // Map width to Spoonacular sizes
    let spoonacularSize;
    if (width <= 90) spoonacularSize = "90x90";
    else if (width <= 240) spoonacularSize = "240x150";
    else if (width <= 312) spoonacularSize = "312x231";
    else if (width <= 480) spoonacularSize = "480x360";
    else if (width <= 556) spoonacularSize = "556x370";
    else spoonacularSize = "636x393";

    return `${withoutExt}-${spoonacularSize}.${extension}`;
  }

  // For other external URLs, return as-is
  if (src.startsWith("http")) {
    return src;
  }

  // For local images, use default Next.js behavior
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${
    quality || 75
  }`;
}
