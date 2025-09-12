"use client";

import { ExternalLink, Clock, BookOpen } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { isDomainAllowed } from "@/src/lib/instructions/ingest";
import { AttributionBar } from "./AttributionBar";

interface Step {
  text: string;
  timer_seconds?: number | null;
}

interface StepListProps {
  steps: Step[];
  sourceUrl?: string | null;
  totalTime?: number;
  className?: string;
  cookMode?: boolean;
}

export function StepList({
  steps,
  sourceUrl,
  totalTime,
  className,
  cookMode = false,
}: StepListProps) {
  // Get attribution info for this recipe
  const isAllowed = sourceUrl ? isDomainAllowed(sourceUrl) : true;
  const attribution =
    sourceUrl && !isAllowed
      ? {
          needsAttribution: true,
          attributionText: "View full instructions at source",
          sourceLink: sourceUrl,
        }
      : null;

  // Check if this is just a link to external instructions
  const hasOnlyExternalLink =
    steps.length === 1 &&
    steps[0]?.text?.includes("Visit the source for detailed cooking instructions");

  if (hasOnlyExternalLink) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 dark:border-amber-800 dark:bg-amber-900/20">
          <div className="flex items-start gap-3">
            <BookOpen className="mt-0.5 h-5 w-5 text-amber-600 dark:text-amber-400" />
            <div className="flex-1">
              <h3 className="mb-2 font-medium text-amber-800 dark:text-amber-200">
                Recipe Instructions Available at Source
              </h3>
              <p className="mb-4 text-sm text-amber-700 dark:text-amber-300">
                This recipe's detailed cooking instructions are available on the original website.
                The ingredients above have been extracted and can be scaled to your preferred
                serving size.
              </p>

              {totalTime && (
                <div className="mb-4 flex items-center gap-2 text-amber-700 dark:text-amber-300">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">Total time: {totalTime} minutes</span>
                </div>
              )}

              {sourceUrl && (
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-700"
                >
                  View Full Recipe Instructions
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Cooking Tips Section */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
          <h4 className="mb-2 font-medium text-blue-800 dark:text-blue-200">Cooking Tips</h4>
          <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
            <li>• Read through all ingredients before starting</li>
            <li>• Prep all ingredients first (mise en place)</li>
            <li>• Check the source recipe for any special equipment needed</li>
            <li>• Adjust cooking times if you've changed the serving size</li>
          </ul>
        </div>
      </div>
    );
  }

  // If we have actual steps, render them normally
  return (
    <div className={cn("space-y-4", className)}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold">Instructions</h3>
        {totalTime && (
          <div className="flex items-center gap-2 text-muted">
            <Clock className="h-4 w-4" />
            <span className="text-sm">Total: {totalTime} min</span>
          </div>
        )}
      </div>

      <ol className="space-y-4">
        {steps.map((step, index) => (
          <li key={index} className="flex gap-4">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-medium text-white">
              {index + 1}
            </div>
            <div className="flex-1 pt-1">
              <p className="text-foreground leading-relaxed">{step.text}</p>
              {step.timer_seconds && (
                <div className="mt-2">
                  <span className="rounded bg-surface px-2 py-1 text-sm text-muted">
                    ⏱️ {Math.floor(step.timer_seconds / 60)}:
                    {(step.timer_seconds % 60).toString().padStart(2, "0")}
                  </span>
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>

      {/* Attribution bar if needed */}
      {attribution?.needsAttribution && (
        <div className="mt-6">
          <AttributionBar
            attributionText={attribution.attributionText}
            sourceLink={attribution.sourceLink}
          />
        </div>
      )}
    </div>
  );
}
