import { NextRequest } from "next/server";
import { createClient } from "@/src/lib/supabase/server";
import { heartPostSchema, heartDeleteSchema } from "@/src/lib/validation";
import { ok, badRequestZod, unauthorized, serverError, withRateLimit } from "@/src/lib/http";
import { logger } from "@/src/lib/logger";
import { ZodError } from "zod";

async function handleHeartPost(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = heartPostSchema.parse(body);
    const { recipeId, deviceId } = validatedData;

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let result;
    if (user) {
      // Logged in user - use upsert to prevent duplicates
      result = await supabase
        .from("hearts")
        .upsert({ recipe_id: recipeId, user_id: user.id }, { onConflict: "recipe_id,user_id" });
    } else if (deviceId) {
      // Anonymous user with device ID - use upsert to prevent duplicates
      result = await supabase
        .from("hearts")
        .upsert(
          { recipe_id: recipeId, device_id: deviceId },
          { onConflict: "recipe_id,device_id" },
        );
    } else {
      return unauthorized("User not authenticated and no device ID provided");
    }

    if (result.error) {
      logger.error("Heart insert error", {
        requestId: request.headers.get("x-request-id") || undefined,
        userId: user?.id,
        recipeId,
        error: result.error,
      });
      return serverError("Failed to add heart", result.error);
    }

    // Get updated count (distinct users + devices)
    const { count } = await supabase
      .from("hearts")
      .select("*", { count: "exact", head: true })
      .eq("recipe_id", recipeId);

    return ok({ success: true, count });
  } catch (error) {
    if (error instanceof ZodError) {
      return badRequestZod(error);
    }
    return serverError("Heart API error", error);
  }
}

export const POST = withRateLimit(handleHeartPost, {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 50, // 50 requests per window
});

async function handleHeartDelete(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const recipeId = searchParams.get("recipeId");
    const deviceId = searchParams.get("deviceId");

    // Validate query parameters
    const validatedData = heartDeleteSchema.parse({
      recipeId,
      deviceId: deviceId || undefined,
    });

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let result;
    if (user) {
      result = await supabase
        .from("hearts")
        .delete()
        .eq("recipe_id", validatedData.recipeId)
        .eq("user_id", user.id);
    } else if (validatedData.deviceId) {
      result = await supabase
        .from("hearts")
        .delete()
        .eq("recipe_id", validatedData.recipeId)
        .eq("device_id", validatedData.deviceId);
    } else {
      return unauthorized("User not authenticated and no device ID provided");
    }

    if (result.error) {
      console.error("Heart delete error:", result.error);
      return serverError("Failed to remove heart", result.error);
    }

    // Get updated count
    const { count } = await supabase
      .from("hearts")
      .select("*", { count: "exact", head: true })
      .eq("recipe_id", validatedData.recipeId);

    return ok({ success: true, count });
  } catch (error) {
    if (error instanceof ZodError) {
      return badRequestZod(error);
    }
    return serverError("Heart API error", error);
  }
}

export const DELETE = withRateLimit(handleHeartDelete, {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 50, // 50 requests per window
});
