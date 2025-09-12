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
      <div className="bg-oat flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-3xl font-semibold">Search Not Available</h1>
          <p className="mb-4 text-gray-600">
            Search functionality requires Algolia configuration. Please set up your Algolia
            credentials to enable search.
          </p>
          <Link
            href="/"
            className="inline-block rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90"
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
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">{children}</div>
    </InstantSearch>
  );
}
