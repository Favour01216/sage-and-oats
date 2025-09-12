import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/src/lib/supabase/server";
import { mergeHeartsSchema } from "@/src/lib/validation";
import { ok, badRequestZod, unauthorized, serverError, withRateLimit } from "@/src/lib/http";
import { ZodError } from "zod";

async function handleMergeHearts(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = mergeHeartsSchema.parse(body);
    const { deviceId } = validatedData;

    const supabase = await createServiceClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return unauthorized("User not authenticated");
    }

    // Start a transaction to safely merge hearts
    const { data: deviceHearts, error: fetchError } = await supabase
      .from("hearts")
      .select("recipe_id")
      .eq("device_id", deviceId);

    if (fetchError) {
      console.error("Error fetching device hearts:", fetchError);
      return serverError("Failed to fetch device hearts", fetchError);
    }

    if (!deviceHearts || deviceHearts.length === 0) {
      return ok({
        success: true,
        mergedCount: 0,
        message: "No device hearts to merge",
      });
    }

    // Get unique recipe IDs from device hearts
    const recipeIds = [...new Set(deviceHearts.map(h => h.recipe_id))];

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
        await supabase.from("hearts").delete().eq("recipe_id", recipeId).eq("device_id", deviceId);
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

    return ok({
      success: true,
      mergedCount: recipeIds.length,
      finalCount: finalCount || 0,
      message: `Successfully merged ${recipeIds.length} hearts`,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return badRequestZod(error);
    }
    return serverError("Merge hearts API error", error);
  }
}

export const POST = withRateLimit(handleMergeHearts, {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 10, // 10 requests per window (more restrictive for merge operation)
});
