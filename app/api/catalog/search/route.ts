import { NextRequest } from "next/server";
import { searchRecipes } from "@/src/lib/external";
import { normalizeExtRecipe } from "@/src/lib/catalog";
import { searchParamsSchema } from "@/src/lib/validation";
import { ok, badRequestZod, serverError, withRateLimit } from "@/src/lib/http";
import { ZodError } from "zod";

async function handleSearch(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse and validate search parameters
    const params = Object.fromEntries(searchParams.entries());
    const validatedParams = searchParamsSchema.parse(params);

    const { q, page, perPage, tags, cuisine, time, timeMin, calorieMax, calorieMin } = validatedParams;

    // Build time filter
    const timeFilter =
      time || timeMin
        ? {
            min: timeMin,
            max: time,
          }
        : undefined;

    // Build calorie filter
    const calorieFilter =
      calorieMax || calorieMin
        ? {
            min: calorieMin,
            max: calorieMax,
          }
        : undefined;

    // Call external API
    const result = await searchRecipes({
      q: q ?? "",
      tags: tags && tags.length > 0 ? tags : undefined,
      cuisine: cuisine && cuisine.length > 0 ? cuisine : undefined,
      time: timeFilter,
      calories: calorieFilter,
      page,
      perPage,
    });

    // Normalize all recipes
    const normalizedItems = result.items.map(normalizeExtRecipe);

    return ok({
      items: normalizedItems,
      total: result.total,
      page: result.page,
      perPage: result.perPage,
      totalPages: Math.ceil(result.total / result.perPage),
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return badRequestZod(error);
    }
    return serverError("Catalog search error", error);
  }
}

export const GET = withRateLimit(handleSearch, {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 200, // 200 search requests per window
});