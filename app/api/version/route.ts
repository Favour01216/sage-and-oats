import { NextRequest } from "next/server";
import { ok } from "@/src/lib/http";

export async function GET(request: NextRequest) {
  const versionData = {
    version: process.env.npm_package_version || "0.1.0",
    buildTime: process.env.BUILD_TIME || new Date().toISOString(),
    gitCommit: process.env.VERCEL_GIT_COMMIT_SHA || "unknown",
    environment: process.env.NODE_ENV || "development",
  };

  return ok(versionData);
}