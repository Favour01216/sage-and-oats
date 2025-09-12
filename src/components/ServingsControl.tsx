"use client";

import { Minus, Plus } from "lucide-react";

interface ServingsControlProps {
  servings: number;
  onServingsChange: (servings: number) => void;
}

export function ServingsControl({ servings, onServingsChange }: ServingsControlProps) {
  const handleDecrease = () => {
    if (servings > 1) {
      onServingsChange(servings - 1);
    }
  };

  const handleIncrease = () => {
    if (servings < 20) {
      onServingsChange(servings + 1);
    }
  };

  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="text-sm text-muted">Servings:</span>
      <div className="flex items-center gap-2">
        <button
          onClick={handleDecrease}
          disabled={servings <= 1}
          className="rounded-lg border border-border p-1 hover:bg-surface disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Decrease servings"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-8 text-center font-medium">{servings}</span>
        <button
          onClick={handleIncrease}
          disabled={servings >= 20}
          className="rounded-lg border border-border p-1 hover:bg-surface disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Increase servings"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
