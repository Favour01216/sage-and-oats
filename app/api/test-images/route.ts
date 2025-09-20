import { NextRequest, NextResponse } from "next/server";
import { searchRecipes } from "@/src/lib/external-edamam";

export async function GET() {
  try {
    const results = await searchRecipes({
      q: "",
      page: 1,
      perPage: 3,
    });

    const imageUrls = results.items.map(recipe => ({
      title: recipe.title,
      imageUrl: recipe.imageUrl,
      id: recipe.id,
    }));

    return NextResponse.json({
      success: true,
      count: results.items.length,
      imageUrls,
    });
  } catch (error) {
    console.error("Test image URLs error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
