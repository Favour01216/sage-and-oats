import { NextRequest, NextResponse } from "next/server";
import { getRecipeById } from "@/src/lib/external";
import { normalizeExtRecipe } from "@/src/lib/catalog";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Recipe ID is required" }, { status: 400 });
    }

    // Check if the ID is numeric (Spoonacular ID) or a slug
    const isNumericId = /^\d+$/.test(id);

    if (!isNumericId) {
      // If it's a slug, we can't fetch from Spoonacular directly
      // Return an error indicating the ID should be numeric
      return NextResponse.json(
        {
          error: "Recipe not found",
          message:
            "Spoonacular requires numeric recipe IDs. Please use the numeric ID instead of a slug.",
          receivedId: id,
        },
        { status: 404 },
      );
    }

    // Get recipe from external API using numeric ID
    const rawRecipe = await getRecipeById(id);

    if (!rawRecipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    // Normalize the recipe
    const normalizedRecipe = normalizeExtRecipe(rawRecipe);

    return NextResponse.json(normalizedRecipe);
  } catch (error) {
    console.error("Catalog recipe fetch error:", error);

    if (error instanceof Error && error.message.includes("404")) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        error: "Failed to fetch recipe",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
