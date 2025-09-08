'use client'

import Image from 'next/image'
import { Clock, Users, ChefHat } from 'lucide-react'
import { formatTime } from '@/src/lib/utils'

interface RecipePreviewProps {
  data: any
}

export function RecipePreview({ data }: RecipePreviewProps) {
  return (
    <div className="bg-surface rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 bg-primary/10 border-b">
        <h3 className="font-semibold text-sm">Live Preview</h3>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Hero Image */}
        {data.hero_image_url && (
          <div className="relative h-48 bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={data.hero_image_url}
              alt={data.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        
        {/* Title & Meta */}
        <div>
          <h1 className="text-2xl font-serif font-bold mb-2">{data.title || 'Recipe Title'}</h1>
          <p className="text-muted mb-4">{data.intro || 'Recipe introduction...'}</p>
          
          <div className="flex items-center gap-4 text-sm text-muted">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{formatTime(data.total_minutes)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{data.yield}</span>
            </div>
            <div className="flex items-center gap-1">
              <ChefHat className="w-4 h-4" />
              <span>{data.difficulty}</span>
            </div>
          </div>
        </div>
        
        {/* Ingredients */}
        {data.ingredients.length > 0 && (
          <div>
            <h2 className="font-semibold mb-2">Ingredients</h2>
            <ul className="space-y-1 text-sm">
              {data.ingredients.map((ing: any, idx: number) => (
                <li key={idx}>
                  {ing.group && <div className="font-semibold mt-2">{ing.group}</div>}
                  {ing.line && <div className="ml-4">• {ing.line}</div>}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Steps */}
        {data.steps.length > 0 && (
          <div>
            <h2 className="font-semibold mb-2">Instructions</h2>
            <ol className="space-y-2 text-sm">
              {data.steps.map((step: any, idx: number) => (
                <li key={idx} className="flex gap-2">
                  <span className="font-semibold">{idx + 1}.</span>
                  <span>{step.instruction}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  )
}
