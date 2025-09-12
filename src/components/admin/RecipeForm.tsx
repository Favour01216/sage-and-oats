"use client";

import { useState, useEffect } from "react";
import { ImageUpload } from "./ImageUpload";
import { IngredientsEditor } from "./IngredientsEditor";
import { StepsEditor } from "./StepsEditor";
import { RecipePreview } from "./RecipePreview";

interface RecipeFormProps {
  recipe?: any;
  onSubmit: (data: any) => Promise<void>;
  loading?: boolean;
}

export function RecipeForm({ recipe, onSubmit, loading }: RecipeFormProps) {
  const [formData, setFormData] = useState({
    title: recipe?.title || "",
    slug: recipe?.slug || "",
    intro: recipe?.intro || "",
    yield: recipe?.yield || "4 servings",
    total_minutes: recipe?.total_minutes || 30,
    difficulty: recipe?.difficulty || "easy",
    tags: recipe?.tags || [],
    cuisine: recipe?.cuisine || "",
    hero_image_url: recipe?.hero_image_url || "",
    ingredients: recipe?.ingredients || [],
    steps: recipe?.steps || [],
    status: recipe?.status || "draft",
  });

  const [showPreview, setShowPreview] = useState(false);
  const [nutritionLoading, setNutritionLoading] = useState(false);
  const [nutrition, setNutrition] = useState(null);

  // Auto-generate slug from title
  useEffect(() => {
    if (!recipe && formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.title, recipe]);

  const handleCalculateNutrition = async () => {
    if (formData.ingredients.length === 0) return;

    setNutritionLoading(true);
    try {
      const response = await fetch("/api/nutrition/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredientLines: formData.ingredients.map((i: any) => i.line),
          servings: parseInt(formData.yield.match(/\d+/)?.[0] || "4"),
        }),
      });
      const data = await response.json();
      setNutrition(data);
    } catch (error) {
      console.error("Failed to calculate nutrition:", error);
    }
    setNutritionLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ ...formData, nutrition });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="space-y-4 rounded-lg bg-surface p-6">
          <h2 className="text-lg font-semibold">Basic Information</h2>

          <div>
            <label className="mb-1 block text-sm font-medium">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Slug</label>
            <input
              type="text"
              value={formData.slug}
              onChange={e => setFormData({ ...formData, slug: e.target.value })}
              className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Introduction</label>
            <textarea
              value={formData.intro}
              onChange={e => setFormData({ ...formData, intro: e.target.value })}
              className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-primary"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Yield</label>
              <input
                type="text"
                value={formData.yield}
                onChange={e => setFormData({ ...formData, yield: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-primary"
                placeholder="4 servings"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Total Minutes</label>
              <input
                type="number"
                value={formData.total_minutes}
                onChange={e =>
                  setFormData({ ...formData, total_minutes: parseInt(e.target.value) })
                }
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={e => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-primary"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Cuisine</label>
              <input
                type="text"
                value={formData.cuisine}
                onChange={e => setFormData({ ...formData, cuisine: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-primary"
                placeholder="Italian"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Tags (comma separated)</label>
            <input
              type="text"
              value={formData.tags.join(", ")}
              onChange={e =>
                setFormData({
                  ...formData,
                  tags: e.target.value
                    .split(",")
                    .map(t => t.trim())
                    .filter(Boolean),
                })
              }
              className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-primary"
              placeholder="vegan, gluten-free, quick"
            />
          </div>
        </div>

        {/* Hero Image */}
        <div className="rounded-lg bg-surface p-6">
          <h2 className="mb-4 text-lg font-semibold">Hero Image</h2>
          <ImageUpload
            value={formData.hero_image_url}
            onChange={url => setFormData({ ...formData, hero_image_url: url })}
          />
        </div>

        {/* Ingredients */}
        <div className="rounded-lg bg-surface p-6">
          <h2 className="mb-4 text-lg font-semibold">Ingredients</h2>
          <IngredientsEditor
            value={formData.ingredients}
            onChange={ingredients => setFormData({ ...formData, ingredients })}
          />
        </div>

        {/* Steps */}
        <div className="rounded-lg bg-surface p-6">
          <h2 className="mb-4 text-lg font-semibold">Instructions</h2>
          <StepsEditor
            value={formData.steps}
            onChange={steps => setFormData({ ...formData, steps })}
          />
        </div>

        {/* Nutrition */}
        <div className="rounded-lg bg-surface p-6">
          <h2 className="mb-4 text-lg font-semibold">Nutrition</h2>
          <button
            type="button"
            onClick={handleCalculateNutrition}
            disabled={nutritionLoading || formData.ingredients.length === 0}
            className="rounded-lg bg-accent px-4 py-2 text-white hover:bg-accent/90 disabled:opacity-50"
          >
            {nutritionLoading ? "Calculating..." : "Calculate Nutrition"}
          </button>
          {nutrition && (
            <div className="mt-4 rounded-lg bg-background p-4">
              <pre className="text-xs">{JSON.stringify(nutrition, null, 2)}</pre>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="submit"
            name="status"
            value="draft"
            onClick={() => setFormData({ ...formData, status: "draft" })}
            disabled={loading}
            className="rounded-lg border border-primary px-6 py-2 text-primary hover:bg-primary/10 disabled:opacity-50"
          >
            Save Draft
          </button>
          <button
            type="submit"
            name="status"
            value="published"
            onClick={() => setFormData({ ...formData, status: "published" })}
            disabled={loading}
            className="rounded-lg bg-primary px-6 py-2 text-white hover:bg-primary/90 disabled:opacity-50"
          >
            Publish
          </button>
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="ml-auto px-4 py-2 text-muted hover:text-text"
          >
            {showPreview ? "Hide" : "Show"} Preview
          </button>
        </div>
      </form>

      {/* Live Preview */}
      {showPreview && (
        <div className="h-fit lg:sticky lg:top-4">
          <RecipePreview data={formData} />
        </div>
      )}
    </div>
  );
}
