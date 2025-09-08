'use client'

import { useState, useEffect } from 'react'

type UnitSystem = 'us' | 'metric'

interface UnitToggleProps {
  defaultSystem?: UnitSystem
  onSystemChange?: (system: UnitSystem) => void
  className?: string
}

export function UnitToggle({ 
  defaultSystem = 'us', 
  onSystemChange,
  className = ''
}: UnitToggleProps) {
  const [system, setSystem] = useState<UnitSystem>(defaultSystem)

  useEffect(() => {
    // Load preference from localStorage
    const saved = localStorage.getItem('preferredUnitSystem') as UnitSystem
    if (saved && (saved === 'us' || saved === 'metric')) {
      setSystem(saved)
      onSystemChange?.(saved)
    }
  }, [])

  const handleToggle = () => {
    const newSystem = system === 'us' ? 'metric' : 'us'
    setSystem(newSystem)
    localStorage.setItem('preferredUnitSystem', newSystem)
    onSystemChange?.(newSystem)
  }

  return (
    <button
      onClick={handleToggle}
      className={`inline-flex items-center gap-2 px-3 py-1.5 bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-lg hover:bg-muted/10 transition-colors ${className}`}
      aria-label={`Switch to ${system === 'us' ? 'metric' : 'US'} units`}
    >
      <span className={`text-sm font-medium ${system === 'us' ? 'text-primary' : 'text-muted dark:text-muted-dark'}`}>
        US
      </span>
      <div className="w-8 h-4 bg-muted/20 rounded-full relative">
        <div 
          className={`absolute top-0.5 w-3 h-3 bg-primary rounded-full transition-transform ${
            system === 'metric' ? 'translate-x-4' : 'translate-x-0.5'
          }`}
        />
      </div>
      <span className={`text-sm font-medium ${system === 'metric' ? 'text-primary' : 'text-muted dark:text-muted-dark'}`}>
        Metric
      </span>
    </button>
  )
}
