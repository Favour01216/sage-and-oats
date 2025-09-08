import { NextResponse } from "next/server";
import {
  ensureIndexSettings,
  ALGOLIA_INDEX,
  adminClient,
} from "@/src/lib/algolia";

export async function GET() {
  try {
    if (!adminClient) {
      return NextResponse.json({
        index: ALGOLIA_INDEX,
        status: "error",
        message: "Admin client not available - missing ALGOLIA_ADMIN_KEY",
      });
    }

    await ensureIndexSettings();

    // For now, return a simple response about the index
    return NextResponse.json({
      index: ALGOLIA_INDEX,
      status: "configured",
      message:
        "Algolia admin client is configured. To check data, implement proper v5 API calls.",
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unknown error",
      index: ALGOLIA_INDEX,
      status: "error",
    });
  }
}
