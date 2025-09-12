"use client";

import { useState, useEffect } from "react";
import { X, ShoppingCart, Check, Trash2 } from "lucide-react";

interface ShoppingItem {
  id: string;
  text: string;
  checked: boolean;
  recipeId?: string;
  recipeTitle?: string;
}

interface ShoppingListDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialItems?: ShoppingItem[];
}

export function ShoppingListDrawer({
  isOpen,
  onClose,
  initialItems = [],
}: ShoppingListDrawerProps) {
  const [items, setItems] = useState<ShoppingItem[]>(initialItems);
  const [newItem, setNewItem] = useState("");

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem("shoppingList");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load shopping list:", e);
      }
    }
  }, []);

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem("shoppingList", JSON.stringify(items));
  }, [items]);

  const addItem = () => {
    if (!newItem.trim()) return;

    const item: ShoppingItem = {
      id: Date.now().toString(),
      text: newItem.trim(),
      checked: false,
    };

    setItems([...items, item]);
    setNewItem("");
  };

  const toggleItem = (id: string) => {
    setItems(items.map(item => (item.id === id ? { ...item, checked: !item.checked } : item)));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const clearChecked = () => {
    setItems(items.filter(item => !item.checked));
  };

  const checkedCount = items.filter(item => item.checked).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose}>
      <div
        className="absolute right-0 top-0 h-full w-full max-w-md bg-background shadow-xl dark:bg-background-dark"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-6 dark:border-border-dark">
          <div className="flex items-center gap-3">
            <ShoppingCart className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold text-text dark:text-text-dark">Shopping List</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 transition-colors hover:bg-muted/10">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Add Item */}
        <div className="border-b border-border p-4 dark:border-border-dark">
          <form
            onSubmit={e => {
              e.preventDefault();
              addItem();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={newItem}
              onChange={e => setNewItem(e.target.value)}
              placeholder="Add item..."
              className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary dark:border-border-dark dark:bg-surface-dark dark:text-text-dark dark:placeholder:text-muted-dark"
            />
            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2 text-white transition-colors hover:bg-primary/90"
            >
              Add
            </button>
          </form>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="py-12 text-center">
              <ShoppingCart className="mx-auto mb-3 h-12 w-12 text-muted/30" />
              <p className="text-muted dark:text-muted-dark">Your shopping list is empty</p>
              <p className="mt-1 text-sm text-muted dark:text-muted-dark">
                Add items from recipes or manually
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {items.map(item => (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 rounded-lg bg-surface p-3 dark:bg-surface-dark ${
                    item.checked ? "opacity-60" : ""
                  }`}
                >
                  <button
                    onClick={() => toggleItem(item.id)}
                    className={`h-5 w-5 flex-shrink-0 rounded border-2 transition-colors ${
                      item.checked
                        ? "border-primary bg-primary"
                        : "border-border hover:border-primary dark:border-border-dark"
                    }`}
                  >
                    {item.checked && <Check className="h-3 w-3 text-white" />}
                  </button>

                  <div className="flex-1">
                    <span
                      className={`text-text dark:text-text-dark ${
                        item.checked ? "line-through" : ""
                      }`}
                    >
                      {item.text}
                    </span>
                    {item.recipeTitle && (
                      <p className="mt-0.5 text-xs text-muted dark:text-muted-dark">
                        from {item.recipeTitle}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="rounded p-1.5 transition-colors hover:bg-muted/10"
                  >
                    <Trash2 className="h-4 w-4 text-muted dark:text-muted-dark" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border p-4 dark:border-border-dark">
            <div className="mb-3 flex items-center justify-between text-sm text-muted dark:text-muted-dark">
              <span>{items.length} items total</span>
              {checkedCount > 0 && <span>{checkedCount} checked</span>}
            </div>
            {checkedCount > 0 && (
              <button
                onClick={clearChecked}
                className="w-full rounded-lg border border-border px-4 py-2 transition-colors hover:bg-muted/10 dark:border-border-dark"
              >
                Clear checked items
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
