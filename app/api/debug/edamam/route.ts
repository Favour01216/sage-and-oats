import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const SPOONACULAR_API_KEY = process.env.EXTERNAL_API_KEY;

  console.log("Debug - Spoonacular credentials:", {
    apiKey: SPOONACULAR_API_KEY ? `${SPOONACULAR_API_KEY.substring(0, 8)}...` : "missing",
  });

  if (!SPOONACULAR_API_KEY) {
    return NextResponse.json({
      error: "Missing Spoonacular API key",
      apiKey: !!SPOONACULAR_API_KEY,
    });
  }

  // Test simple Spoonacular Recipe Search API call
  const testUrl = `https://api.spoonacular.com/recipes/complexSearch?query=chicken&number=3&addRecipeInformation=true&apiKey=${SPOONACULAR_API_KEY}`;

  try {
    console.log("Testing Spoonacular API with URL:", testUrl.replace(SPOONACULAR_API_KEY, "***"));

    const response = await fetch(testUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    console.log("Spoonacular API response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Spoonacular API error:", errorText);
      return NextResponse.json({
        error: `Spoonacular API Error ${response.status}`,
        details: errorText,
        url: testUrl.replace(SPOONACULAR_API_KEY, "***"),
      });
    }

    const data = await response.json();
    console.log("Spoonacular API success - received results:", data.results?.length || 0);

    return NextResponse.json({
      success: true,
      resultCount: data.results?.length || 0,
      totalResults: data.totalResults || 0,
      sampleRecipe: data.results?.[0]
        ? {
            id: data.results[0].id,
            title: data.results[0].title,
            image: data.results[0].image,
            readyInMinutes: data.results[0].readyInMinutes,
          }
        : null,
    });
  } catch (error) {
    console.error("Spoonacular API request failed:", error);
    return NextResponse.json({
      error: "Request failed",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
