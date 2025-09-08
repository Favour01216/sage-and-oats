'use client'

import { useUnitSystem } from '@/src/lib/hooks/useUnitSystem'
import { UnitSystem } from '@/src/lib/units/conversions'

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
  const { unitSystem, toggleUnitSystem } = useUnitSystem(defaultSystem)

  const handleToggle = () => {
    toggleUnitSystem()
    onSystemChange?.(unitSystem === 'us' ? 'metric' : 'us')
  }

  return (
    <button
      onClick={handleToggle}
      className={`inline-flex items-center gap-2 px-3 py-1.5 bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-lg hover:bg-muted/10 transition-colors ${className}`}
      aria-label={`Switch to ${unitSystem === 'us' ? 'metric' : 'US'} units`}
    >
      <span className={`text-sm font-medium ${unitSystem === 'us' ? 'text-primary' : 'text-muted dark:text-muted-dark'}`}>
        US
      </span>
      <div className="w-8 h-4 bg-muted/20 rounded-full relative">
        <div 
          className={`absolute top-0.5 w-3 h-3 bg-primary rounded-full transition-transform ${
            unitSystem === 'metric' ? 'translate-x-4' : 'translate-x-0.5'
          }`}
        />
      </div>
      <span className={`text-sm font-medium ${unitSystem === 'metric' ? 'text-primary' : 'text-muted dark:text-muted-dark'}`}>
        Metric
      </span>
    </button>
  )
}
