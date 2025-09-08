"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { InstantSearch, Configure } from "react-instantsearch";
import { searchClient, ALGOLIA_INDEX } from "@/src/lib/algolia";

interface SearchShellProps {
  children: ReactNode;
}

export default function SearchShell({ children }: SearchShellProps) {
  if (!searchClient) {
    return (
      <div className="min-h-screen bg-oat flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-semibold mb-4">Search Not Available</h1>
          <p className="text-gray-600 mb-4">
            Search functionality requires Algolia configuration. Please set up
            your Algolia credentials to enable search.
          </p>
          <Link
            href="/"
            className="inline-block px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <InstantSearch
      searchClient={searchClient}
      indexName={ALGOLIA_INDEX}
      routing={false}
      // Reduce skeleton thrash on slow networks
      stalledSearchDelay={800}
      insights={false}
    >
      <Configure
        hitsPerPage={12}
        attributesToRetrieve={[
          "id",
          "slug",
          "title",
          "imageUrl",
          "hero_image_url",
          "tags",
          "cuisine",
          "total_minutes",
          "avg_rating",
          "calories_per_serving",
          "hearts",
        ]}
        attributesToHighlight={["title", "ingredients_text"]}
      />
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        {children}
      </div>
    </InstantSearch>
  );
}
