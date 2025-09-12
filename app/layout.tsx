import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "@/src/components/SiteHeader";
import SiteFooter from "@/src/components/SiteFooter";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "Sage & Oat - Mindful Recipes",
  description: "Discover nourishing recipes for mindful cooking and healthy living",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to image hosts for faster loading */}
        <link rel="preconnect" href="https://www.edamam.com" />
        <link rel="preconnect" href="https://edamam-product-images.s3.amazonaws.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        
        {/* Accessibility improvements */}
        <meta name="color-scheme" content="light dark" />
        <meta name="theme-color" content="#2F5D45" />
      </head>
      <body className="flex min-h-screen flex-col bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
        <SiteHeader />
        <main id="content" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
