'use client'

import Link from "next/link";
import { ExternalLink, Info } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface AttributionBarProps {
  attributionText: string;
  sourceLink?: string;
  className?: string;
}

export function AttributionBar({ 
  attributionText, 
  sourceLink, 
  className 
}: AttributionBarProps) {
  return (
    <div 
      className={cn(
        "flex items-center gap-3 px-4 py-3 bg-primary/5 border border-primary/10 rounded-lg text-sm",
        className
      )}
    >
      <Info className="w-4 h-4 text-primary flex-shrink-0" />
      
      <div className="flex-1 min-w-0">
        <span className="text-primary/80">{attributionText}</span>
      </div>
      
      {sourceLink && (
        <Link
          href={sourceLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-primary hover:text-primary/80 font-medium transition-colors"
        >
          <span>View Source</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      )}
    </div>
  );
}