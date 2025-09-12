"use client";

import Image from "next/image";
import { Clock, Users, ChefHat } from "lucide-react";
import { formatTime } from "@/src/lib/utils";

interface RecipePreviewProps {
  data: any;
}

export function RecipePreview({ data }: RecipePreviewProps) {
  return (
    <div className="overflow-hidden rounded-lg bg-surface shadow-lg">
      <div className="border-b bg-primary/10 p-4">
        <h3 className="text-sm font-semibold">Live Preview</h3>
      </div>

      <div className="space-y-6 p-6">
        {/* Hero Image */}
        {data.hero_image_url && (
          <div className="relative h-48 overflow-hidden rounded-lg bg-gray-100">
            <Image src={data.hero_image_url} alt={data.title} fill className="object-cover" />
          </div>
        )}

        {/* Title & Meta */}
        <div>
          <h1 className="mb-2 font-serif text-2xl font-bold">{data.title || "Recipe Title"}</h1>
          <p className="mb-4 text-muted">{data.intro || "Recipe introduction..."}</p>

          <div className="flex items-center gap-4 text-sm text-muted">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{formatTime(data.total_minutes)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{data.yield}</span>
            </div>
            <div className="flex items-center gap-1">
              <ChefHat className="h-4 w-4" />
              <span>{data.difficulty}</span>
            </div>
          </div>
        </div>

        {/* Ingredients */}
        {data.ingredients.length > 0 && (
          <div>
            <h2 className="mb-2 font-semibold">Ingredients</h2>
            <ul className="space-y-1 text-sm">
              {data.ingredients.map((ing: any, idx: number) => (
                <li key={idx}>
                  {ing.group && <div className="mt-2 font-semibold">{ing.group}</div>}
                  {ing.line && <div className="ml-4">• {ing.line}</div>}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Steps */}
        {data.steps.length > 0 && (
          <div>
            <h2 className="mb-2 font-semibold">Instructions</h2>
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
  );
}
