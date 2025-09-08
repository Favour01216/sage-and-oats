import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/src/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { deviceId } = await request.json();

    if (!deviceId) {
      return NextResponse.json(
        { error: "Device ID is required" },
        { status: 400 }
      );
    }

    const supabase = await createServiceClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    // Start a transaction to safely merge hearts
    const { data: deviceHearts, error: fetchError } = await supabase
      .from("hearts")
      .select("recipe_id")
      .eq("device_id", deviceId);

    if (fetchError) {
      console.error("Error fetching device hearts:", fetchError);
      return NextResponse.json(
        { error: "Failed to fetch device hearts" },
        { status: 500 }
      );
    }

    if (!deviceHearts || deviceHearts.length === 0) {
      return NextResponse.json({
        success: true,
        mergedCount: 0,
        message: "No device hearts to merge",
      });
    }

    // Get unique recipe IDs from device hearts
    const recipeIds = [...new Set(deviceHearts.map((h) => h.recipe_id))];

    // For each recipe, handle potential conflicts
    for (const recipeId of recipeIds) {
      // Check if user already has a heart for this recipe
      const { data: existingHeart } = await supabase
        .from("hearts")
        .select("id")
        .eq("recipe_id", recipeId)
        .eq("user_id", user.id)
        .single();

      if (existingHeart) {
        // User already has a heart, remove the device heart
        await supabase
          .from("hearts")
          .delete()
          .eq("recipe_id", recipeId)
          .eq("device_id", deviceId);
      } else {
        // Update device heart to user heart
        await supabase
          .from("hearts")
          .update({ user_id: user.id, device_id: null })
          .eq("recipe_id", recipeId)
          .eq("device_id", deviceId);
      }
    }

    // Get final count of user's hearts
    const { count: finalCount } = await supabase
      .from("hearts")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    return NextResponse.json({
      success: true,
      mergedCount: recipeIds.length,
      finalCount: finalCount || 0,
      message: `Successfully merged ${recipeIds.length} hearts`,
    });
  } catch (error) {
    console.error("Merge hearts API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
