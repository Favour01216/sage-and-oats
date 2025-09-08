'use client'

import { Plus, X, GripVertical } from 'lucide-react'

interface Ingredient {
  group?: string
  line: string
}

interface IngredientsEditorProps {
  value: Ingredient[]
  onChange: (ingredients: Ingredient[]) => void
}

export function IngredientsEditor({ value, onChange }: IngredientsEditorProps) {
  const addIngredient = () => {
    onChange([...value, { line: '' }])
  }

  const removeIngredient = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const updateIngredient = (index: number, ingredient: Ingredient) => {
    const updated = [...value]
    updated[index] = ingredient
    onChange(updated)
  }

  const addGroup = () => {
    onChange([...value, { group: 'New Group', line: '' }])
  }

  return (
    <div className="space-y-3">
      {value.map((ingredient, index) => (
        <div key={index} className="flex gap-2">
          <button
            type="button"
            className="text-gray-400 hover:text-gray-600 cursor-move"
          >
            <GripVertical className="w-5 h-5" />
          </button>
          
          {ingredient.group !== undefined && (
            <input
              type="text"
              value={ingredient.group}
              onChange={(e) => updateIngredient(index, { ...ingredient, group: e.target.value })}
              className="px-2 py-1 border rounded text-sm font-semibold"
              placeholder="Group name"
            />
          )}
          
          <input
            type="text"
            value={ingredient.line}
            onChange={(e) => updateIngredient(index, { ...ingredient, line: e.target.value })}
            className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
            placeholder="1 cup flour"
          />
          
          <button
            type="button"
            onClick={() => removeIngredient(index)}
            className="text-red-500 hover:text-red-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ))}
      
      <div className="flex gap-2">
        <button
          type="button"
          onClick={addIngredient}
          className="flex items-center gap-2 px-3 py-2 text-sm border border-primary text-primary rounded-lg hover:bg-primary/10"
        >
          <Plus className="w-4 h-4" />
          Add Ingredient
        </button>
        <button
          type="button"
          onClick={addGroup}
          className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50"
        >
          <Plus className="w-4 h-4" />
          Add Group
        </button>
      </div>
    </div>
  )
}
