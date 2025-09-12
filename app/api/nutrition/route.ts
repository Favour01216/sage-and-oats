import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { ingredientLines, servings, recipeTitle } = await request.json();

    if (!ingredientLines || !Array.isArray(ingredientLines) || ingredientLines.length === 0) {
      return NextResponse.json({ error: "Invalid ingredient lines" }, { status: 400 });
    }

    const edamamAppId = process.env.EDAMAM_APP_ID;
    const edamamAppKey = process.env.EDAMAM_APP_KEY;

    if (!edamamAppId || !edamamAppKey) {
      return NextResponse.json({ error: "Nutrition API not configured" }, { status: 500 });
    }

    const response = await fetch(
      `https://api.edamam.com/api/nutrition-details?app_id=${edamamAppId}&app_key=${edamamAppKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: recipeTitle || "Recipe",
          ingr: ingredientLines,
          yield: servings || 1,
        }),
      },
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("Edamam API error:", error);
      return NextResponse.json(
        { error: "Failed to analyze nutrition" },
        { status: response.status },
      );
    }

    const data = await response.json();

    // Extract per-serving nutrition
    const perServing = {
      calories: Math.round(data.calories / (servings || 1)),
      protein_g: Math.round((data.totalNutrients?.PROCNT?.quantity || 0) / (servings || 1)),
      fat_g: Math.round((data.totalNutrients?.FAT?.quantity || 0) / (servings || 1)),
      carbs_g: Math.round((data.totalNutrients?.CHOCDF?.quantity || 0) / (servings || 1)),
      fiber_g: Math.round((data.totalNutrients?.FIBTG?.quantity || 0) / (servings || 1)),
      sugar_g: Math.round((data.totalNutrients?.SUGAR?.quantity || 0) / (servings || 1)),
      sodium_mg: Math.round((data.totalNutrients?.NA?.quantity || 0) / (servings || 1)),
      raw_edamam: data,
    };

    return NextResponse.json(perServing);
  } catch (error) {
    console.error("Nutrition API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
