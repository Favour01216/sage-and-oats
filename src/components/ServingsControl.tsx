'use client'

import { Minus, Plus } from 'lucide-react'

interface ServingsControlProps {
  servings: number
  onServingsChange: (servings: number) => void
}

export function ServingsControl({ servings, onServingsChange }: ServingsControlProps) {
  const handleDecrease = () => {
    if (servings > 1) {
      onServingsChange(servings - 1)
    }
  }

  const handleIncrease = () => {
    if (servings < 20) {
      onServingsChange(servings + 1)
    }
  }

  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="text-sm text-muted">Servings:</span>
      <div className="flex items-center gap-2">
        <button
          onClick={handleDecrease}
          disabled={servings <= 1}
          className="p-1 rounded-lg border border-border hover:bg-surface disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Decrease servings"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="w-8 text-center font-medium">{servings}</span>
        <button
          onClick={handleIncrease}
          disabled={servings >= 20}
          className="p-1 rounded-lg border border-border hover:bg-surface disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Increase servings"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
