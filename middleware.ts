import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if accessing admin routes
  if (pathname.startsWith("/admin")) {
    const sourceMode = process.env.SOURCE_MODE || "mirror";

    // If we're using external data source (not in mirror-authoring mode), redirect admin routes
    if (sourceMode !== "mirror-authoring") {
      // Create URL for redirect to search page
      const url = request.nextUrl.clone();
      url.pathname = "/search";
      url.search = ""; // Clear any query parameters

      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
