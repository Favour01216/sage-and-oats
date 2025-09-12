"use client";

import { Plus, X, Clock, GripVertical } from "lucide-react";

interface Step {
  instruction: string;
  timer_seconds?: number;
}

interface StepsEditorProps {
  value: Step[];
  onChange: (steps: Step[]) => void;
}

export function StepsEditor({ value, onChange }: StepsEditorProps) {
  const addStep = () => {
    onChange([...value, { instruction: "" }]);
  };

  const removeStep = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const updateStep = (index: number, step: Step) => {
    const updated = [...value];
    updated[index] = step;
    onChange(updated);
  };

  const formatTimer = (seconds?: number) => {
    if (!seconds) return "";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const parseTimer = (timeStr: string): number | undefined => {
    if (!timeStr) return undefined;
    const [mins, secs] = timeStr.split(":").map(Number);
    return (mins || 0) * 60 + (secs || 0);
  };

  return (
    <div className="space-y-3">
      {value.map((step, index) => (
        <div key={index} className="flex gap-2">
          <button type="button" className="cursor-move text-gray-400 hover:text-gray-600">
            <GripVertical className="h-5 w-5" />
          </button>

          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            {index + 1}
          </div>

          <textarea
            value={step.instruction}
            onChange={e => updateStep(index, { ...step, instruction: e.target.value })}
            className="flex-1 rounded-lg border px-3 py-2 focus:ring-2 focus:ring-primary"
            placeholder="Preheat oven to 375°F..."
            rows={2}
          />

          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={formatTimer(step.timer_seconds)}
              onChange={e =>
                updateStep(index, { ...step, timer_seconds: parseTimer(e.target.value) })
              }
              className="w-16 rounded border px-2 py-1 text-sm"
              placeholder="0:00"
            />
          </div>

          <button
            type="button"
            onClick={() => removeStep(index)}
            className="text-red-500 hover:text-red-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addStep}
        className="flex items-center gap-2 rounded-lg border border-primary px-3 py-2 text-sm text-primary hover:bg-primary/10"
      >
        <Plus className="h-4 w-4" />
        Add Step
      </button>
    </div>
  );
}
