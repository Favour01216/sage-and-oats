import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/src/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { recipeId, deviceId } = await request.json();

    if (!recipeId) {
      return NextResponse.json(
        { error: "Recipe ID is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let result;
    if (user) {
      // Logged in user - use upsert to prevent duplicates
      result = await supabase
        .from("hearts")
        .upsert(
          { recipe_id: recipeId, user_id: user.id },
          { onConflict: "recipe_id,user_id" }
        );
    } else if (deviceId) {
      // Anonymous user with device ID - use upsert to prevent duplicates
      result = await supabase
        .from("hearts")
        .upsert(
          { recipe_id: recipeId, device_id: deviceId },
          { onConflict: "recipe_id,device_id" }
        );
    } else {
      return NextResponse.json(
        { error: "User not authenticated and no device ID provided" },
        { status: 401 }
      );
    }

    if (result.error) {
      console.error("Heart insert error:", result.error);
      return NextResponse.json(
        { error: "Failed to add heart" },
        { status: 500 }
      );
    }

    // Get updated count (distinct users + devices)
    const { count } = await supabase
      .from("hearts")
      .select("*", { count: "exact", head: true })
      .eq("recipe_id", recipeId);

    return NextResponse.json({ success: true, count });
  } catch (error) {
    console.error("Heart API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const recipeId = searchParams.get("recipeId");
    const deviceId = searchParams.get("deviceId");

    if (!recipeId) {
      return NextResponse.json(
        { error: "Recipe ID is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let result;
    if (user) {
      result = await supabase
        .from("hearts")
        .delete()
        .eq("recipe_id", recipeId)
        .eq("user_id", user.id);
    } else if (deviceId) {
      result = await supabase
        .from("hearts")
        .delete()
        .eq("recipe_id", recipeId)
        .eq("device_id", deviceId);
    } else {
      return NextResponse.json(
        { error: "User not authenticated and no device ID provided" },
        { status: 401 }
      );
    }

    if (result.error) {
      console.error("Heart delete error:", result.error);
      return NextResponse.json(
        { error: "Failed to remove heart" },
        { status: 500 }
      );
    }

    // Get updated count
    const { count } = await supabase
      .from("hearts")
      .select("*", { count: "exact", head: true })
      .eq("recipe_id", recipeId);

    return NextResponse.json({ success: true, count });
  } catch (error) {
    console.error("Heart API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
