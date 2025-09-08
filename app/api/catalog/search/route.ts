import { NextRequest, NextResponse } from "next/server";
import { searchRecipes } from "@/src/lib/external";
import { normalizeExtRecipe } from "@/src/lib/catalog";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const q = searchParams.get("q") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const perPage = parseInt(searchParams.get("perPage") || "12", 10);

    // Handle tags array
    const tags: string[] = [];
    searchParams.forEach((value, key) => {
      if (key === "tags[]" || key === "tags") {
        tags.push(value);
      }
    });

    // Handle cuisine array
    const cuisine: string[] = [];
    searchParams.forEach((value, key) => {
      if (key === "cuisine[]" || key === "cuisine") {
        cuisine.push(value);
      }
    });

    // Handle time filter
    const timeMax = searchParams.get("time");
    const timeMin = searchParams.get("timeMin");
    const time =
      timeMax || timeMin
        ? {
            min: timeMin ? parseInt(timeMin, 10) : undefined,
            max: timeMax ? parseInt(timeMax, 10) : undefined,
          }
        : undefined;

    // Handle calorie filter
    const calorieMax = searchParams.get("calorieMax");
    const calorieMin = searchParams.get("calorieMin");
    const calories =
      calorieMax || calorieMin
        ? {
            min: calorieMin ? parseInt(calorieMin, 10) : undefined,
            max: calorieMax ? parseInt(calorieMax, 10) : undefined,
          }
        : undefined;

    // Call external API
    const result = await searchRecipes({
      q,
      tags: tags.length > 0 ? tags : undefined,
      cuisine: cuisine.length > 0 ? cuisine : undefined,
      time,
      calories,
      page,
      perPage,
    });

    // Normalize all recipes
    const normalizedItems = result.items.map(normalizeExtRecipe);

    return NextResponse.json({
      items: normalizedItems,
      total: result.total,
      page: result.page,
      perPage: result.perPage,
      totalPages: Math.ceil(result.total / result.perPage),
    });
  } catch (error) {
    console.error("Catalog search error:", error);
    return NextResponse.json(
      {
        error: "Failed to search recipes",
        message: error instanceof Error ? error.message : "Unknown error",
        items: [],
        total: 0,
      },
      { status: 500 }
    );
  }
}
