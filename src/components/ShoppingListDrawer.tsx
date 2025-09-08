'use client'

import { useState, useEffect } from 'react'
import { X, ShoppingCart, Check, Trash2 } from 'lucide-react'

interface ShoppingItem {
  id: string
  text: string
  checked: boolean
  recipeId?: string
  recipeTitle?: string
}

interface ShoppingListDrawerProps {
  isOpen: boolean
  onClose: () => void
  initialItems?: ShoppingItem[]
}

export function ShoppingListDrawer({ isOpen, onClose, initialItems = [] }: ShoppingListDrawerProps) {
  const [items, setItems] = useState<ShoppingItem[]>(initialItems)
  const [newItem, setNewItem] = useState('')

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem('shoppingList')
    if (saved) {
      try {
        setItems(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load shopping list:', e)
      }
    }
  }, [])

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('shoppingList', JSON.stringify(items))
  }, [items])

  const addItem = () => {
    if (!newItem.trim()) return
    
    const item: ShoppingItem = {
      id: Date.now().toString(),
      text: newItem.trim(),
      checked: false
    }
    
    setItems([...items, item])
    setNewItem('')
  }

  const toggleItem = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ))
  }

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id))
  }

  const clearChecked = () => {
    setItems(items.filter(item => !item.checked))
  }

  const checkedCount = items.filter(item => item.checked).length

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose}>
      <div
        className="absolute right-0 top-0 h-full w-full max-w-md bg-background dark:bg-background-dark shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border dark:border-border-dark">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold text-text dark:text-text-dark">Shopping List</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Add Item */}
        <div className="p-4 border-b border-border dark:border-border-dark">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              addItem()
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="Add item..."
              className="flex-1 px-3 py-2 bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-lg text-text dark:text-text-dark placeholder:text-muted dark:placeholder:text-muted-dark focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Add
            </button>
          </form>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-12 h-12 text-muted/30 mx-auto mb-3" />
              <p className="text-muted dark:text-muted-dark">Your shopping list is empty</p>
              <p className="text-sm text-muted dark:text-muted-dark mt-1">
                Add items from recipes or manually
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 p-3 bg-surface dark:bg-surface-dark rounded-lg ${
                    item.checked ? 'opacity-60' : ''
                  }`}
                >
                  <button
                    onClick={() => toggleItem(item.id)}
                    className={`flex-shrink-0 w-5 h-5 rounded border-2 transition-colors ${
                      item.checked
                        ? 'bg-primary border-primary'
                        : 'border-border dark:border-border-dark hover:border-primary'
                    }`}
                  >
                    {item.checked && <Check className="w-3 h-3 text-white" />}
                  </button>
                  
                  <div className="flex-1">
                    <span className={`text-text dark:text-text-dark ${
                      item.checked ? 'line-through' : ''
                    }`}>
                      {item.text}
                    </span>
                    {item.recipeTitle && (
                      <p className="text-xs text-muted dark:text-muted-dark mt-0.5">
                        from {item.recipeTitle}
                      </p>
                    )}
                  </div>
                  
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1.5 hover:bg-muted/10 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-muted dark:text-muted-dark" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-border dark:border-border-dark">
            <div className="flex items-center justify-between text-sm text-muted dark:text-muted-dark mb-3">
              <span>{items.length} items total</span>
              {checkedCount > 0 && <span>{checkedCount} checked</span>}
            </div>
            {checkedCount > 0 && (
              <button
                onClick={clearChecked}
                className="w-full px-4 py-2 border border-border dark:border-border-dark rounded-lg hover:bg-muted/10 transition-colors"
              >
                Clear checked items
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
