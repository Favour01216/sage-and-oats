"use client";

import { useUnitSystem } from "@/src/lib/hooks/useUnitSystem";
import { UnitSystem } from "@/src/lib/units/conversions";

interface UnitToggleProps {
  defaultSystem?: UnitSystem;
  onSystemChange?: (system: UnitSystem) => void;
  className?: string;
}

export function UnitToggle({
  defaultSystem = "us",
  onSystemChange,
  className = "",
}: UnitToggleProps) {
  const { unitSystem, toggleUnitSystem } = useUnitSystem(defaultSystem);

  const handleToggle = () => {
    toggleUnitSystem();
    onSystemChange?.(unitSystem === "us" ? "metric" : "us");
  };

  return (
    <button
      onClick={handleToggle}
      className={`inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-1.5 transition-colors hover:bg-muted/10 dark:border-border-dark dark:bg-surface-dark ${className}`}
      aria-label={`Switch to ${unitSystem === "us" ? "metric" : "US"} units`}
    >
      <span
        className={`text-sm font-medium ${unitSystem === "us" ? "text-primary" : "text-muted dark:text-muted-dark"}`}
      >
        US
      </span>
      <div className="relative h-4 w-8 rounded-full bg-muted/20">
        <div
          className={`absolute top-0.5 h-3 w-3 rounded-full bg-primary transition-transform ${
            unitSystem === "metric" ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </div>
      <span
        className={`text-sm font-medium ${unitSystem === "metric" ? "text-primary" : "text-muted dark:text-muted-dark"}`}
      >
        Metric
      </span>
    </button>
  );
}
