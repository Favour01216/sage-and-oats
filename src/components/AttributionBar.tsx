"use client";

import Link from "next/link";
import { ExternalLink, Info } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface AttributionBarProps {
  attributionText: string;
  sourceLink?: string;
  className?: string;
}

export function AttributionBar({ attributionText, sourceLink, className }: AttributionBarProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border border-primary/10 bg-primary/5 px-4 py-3 text-sm",
        className,
      )}
    >
      <Info className="h-4 w-4 flex-shrink-0 text-primary" />

      <div className="min-w-0 flex-1">
        <span className="text-primary/80">{attributionText}</span>
      </div>

      {sourceLink && (
        <Link
          href={sourceLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 font-medium text-primary transition-colors hover:text-primary/80"
        >
          <span>View Source</span>
          <ExternalLink className="h-3 w-3" />
        </Link>
      )}
    </div>
  );
}
