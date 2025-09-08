import { NextResponse } from "next/server";
import { SOURCE_MODE, isLive, isMirror } from "@/src/lib/sourceMode";

export async function GET() {
  return NextResponse.json({
    SOURCE_MODE,
    isLive,
    isMirror,
    env_vars: {
      NEXT_PUBLIC_SOURCE_MODE: process.env.NEXT_PUBLIC_SOURCE_MODE,
      SOURCE_MODE: process.env.SOURCE_MODE,
      EXTERNAL_API_BASE_URL: process.env.EXTERNAL_API_BASE_URL,
      EXTERNAL_API_KEY: process.env.EXTERNAL_API_KEY ? "SET" : "NOT SET",
    },
  });
}
