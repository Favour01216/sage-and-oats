/**
 * Unified card data mapping for consistent recipe cards across the app
 */

export type CardData = {
  id: string;
  slug: string;
  title: string; // always human-friendly (never a URL)
  imageUrl?: string; // always HTTPS
  tags?: string[];
  total_minutes?: number;
  hearts?: number; // global saves count (optional in lists)
  rating?: number | null;
  href: string; // e.g., `/recipe/${slug}`
  sourceHost?: string; // for attribution tooltip if needed
};

/**
 * Ensure URL uses HTTPS protocol
 */
export function ensureHttps(u?: string | null): string | undefined {
  if (!u) return undefined;
  try {
    const url = new URL(u);
    url.protocol = "https:";
    return url.toString();
  } catch {
    return u;
  }
}

/**
 * Clean up title to ensure it's human-readable
 * Falls back to domain name if title looks like a URL
 */
export function cleanTitle(
  t?: string | null,
  sourceUrl?: string | null
): string {
  // If we have a good title that's not a URL, use it
  if (t && !/^https?:\/\//i.test(t)) {
    return t;
  }

  // Try to extract domain from sourceUrl as fallback
  if (sourceUrl) {
    try {
      const hostname = new URL(sourceUrl).hostname.replace(/^www\./, "");
      return `Recipe from ${hostname}`;
    } catch {
      // Fall through to default
    }
  }

  // Last resort fallback
  return "Recipe";
}

/**
 * Map search hit (from Algolia or API) to card data
 */
export function mapHitToCard(hit: any): CardData {
  const title = cleanTitle(
    hit.title || hit.label,
    hit.source_url || hit.sourceUrl
  );
  const id = String(hit.id || hit.objectID || hit.slug || "unknown");
  const slug = String(hit.slug || hit.id || hit.objectID || "unknown");

  return {
    id,
    slug,
    title,
    imageUrl: ensureHttps(
      hit.imageUrl || hit.image_url || hit.hero_image_url || hit.image
    ),
    tags: Array.isArray(hit.tags) ? hit.tags : [],
    total_minutes: hit.total_minutes ?? hit.totalMinutes ?? undefined,
    hearts: hit.hearts ?? hit.heart_count ?? undefined,
    rating: hit.avg_rating ?? hit.rating ?? null,
    href: `/recipe/${encodeURIComponent(id)}`,
    sourceHost:
      hit.source_url || hit.sourceUrl
        ? new URL(hit.source_url || hit.sourceUrl).hostname.replace(
            /^www\./,
            ""
          )
        : undefined,
  };
}

/**
 * Map database row (from Supabase) to card data
 */
export function mapRecipeRowToCard(row: any): CardData {
  // Normalize the row to match hit structure and reuse the mapping
  return mapHitToCard({
    id: row.id,
    slug: row.slug,
    title: row.title || row.label,
    imageUrl: row.image_url || row.imageUrl || row.hero_image_url,
    tags: row.tags,
    total_minutes: row.total_minutes || row.totalMinutes,
    hearts: row.hearts || row.heart_count,
    avg_rating: row.avg_rating || row.rating,
    source_url: row.source_url || row.sourceUrl,
  });
}

/**
 * Map normalized recipe (from catalog.ts) to card data
 */
export function mapNormalizedToCard(recipe: any): CardData {
  return mapHitToCard({
    id: recipe.id,
    slug: recipe.slug,
    title: recipe.title,
    imageUrl: recipe.imageUrl || recipe.image_url,
    tags: recipe.tags,
    total_minutes: recipe.total_minutes,
    avg_rating: recipe.avg_rating,
    source_url: recipe.source_url,
  });
}
