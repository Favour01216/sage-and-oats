'use client'

import { ExternalLink, Clock, BookOpen } from 'lucide-react'
import { cn } from '@/src/lib/utils'
import { isDomainAllowed } from '@/src/lib/instructions/ingest'
import { AttributionBar } from './AttributionBar'

interface Step {
  text: string
  timer_seconds?: number | null
}

interface StepListProps {
  steps: Step[]
  sourceUrl?: string | null
  totalTime?: number
  className?: string
  cookMode?: boolean
}

export function StepList({ 
  steps, 
  sourceUrl, 
  totalTime,
  className, 
  cookMode = false 
}: StepListProps) {
  
  // Get attribution info for this recipe
  const isAllowed = sourceUrl ? isDomainAllowed(sourceUrl) : true;
  const attribution = sourceUrl && !isAllowed ? {
    needsAttribution: true,
    attributionText: 'View full instructions at source',
    sourceLink: sourceUrl
  } : null;
  
  // Check if this is just a link to external instructions
  const hasOnlyExternalLink = steps.length === 1 && 
    steps[0]?.text?.includes('Visit the source for detailed cooking instructions');

  if (hasOnlyExternalLink) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-amber-800 dark:text-amber-200 mb-2">
                Recipe Instructions Available at Source
              </h3>
              <p className="text-amber-700 dark:text-amber-300 text-sm mb-4">
                This recipe's detailed cooking instructions are available on the original website. 
                The ingredients above have been extracted and can be scaled to your preferred serving size.
              </p>
              
              {totalTime && (
                <div className="flex items-center gap-2 mb-4 text-amber-700 dark:text-amber-300">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Total time: {totalTime} minutes</span>
                </div>
              )}
              
              {sourceUrl && (
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  View Full Recipe Instructions
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Cooking Tips Section */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
            Cooking Tips
          </h4>
          <ul className="text-blue-700 dark:text-blue-300 text-sm space-y-1">
            <li>• Read through all ingredients before starting</li>
            <li>• Prep all ingredients first (mise en place)</li>
            <li>• Check the source recipe for any special equipment needed</li>
            <li>• Adjust cooking times if you've changed the serving size</li>
          </ul>
        </div>
      </div>
    )
  }

  // If we have actual steps, render them normally
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">Instructions</h3>
        {totalTime && (
          <div className="flex items-center gap-2 text-muted">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Total: {totalTime} min</span>
          </div>
        )}
      </div>

      <ol className="space-y-4">
        {steps.map((step, index) => (
          <li key={index} className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-medium text-sm">
              {index + 1}
            </div>
            <div className="flex-1 pt-1">
              <p className="text-foreground leading-relaxed">
                {step.text}
              </p>
              {step.timer_seconds && (
                <div className="mt-2">
                  <span className="text-sm text-muted bg-surface px-2 py-1 rounded">
                    ⏱️ {Math.floor(step.timer_seconds / 60)}:{(step.timer_seconds % 60).toString().padStart(2, '0')}
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
  )
}
