import { createClient } from "@/src/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();

    // Fetch all published recipes
    const { data: recipes } = await supabase
      .from("recipes")
      .select("slug, updated_at, created_at")
      .eq("status", "published")
      .order("updated_at", { ascending: false });

    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://sageandoat.com";

    // Generate sitemap XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/search</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
${
  recipes
    ?.map(
      (recipe) => `  <url>
    <loc>${baseUrl}/recipe/${recipe.slug}</loc>
    <lastmod>${new Date(
      recipe.updated_at || recipe.created_at
    ).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
    )
    .join("\n") || ""
}
</urlset>`;

    return new NextResponse(sitemap, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
      },
    });
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return new NextResponse("Error generating sitemap", { status: 500 });
  }
}
