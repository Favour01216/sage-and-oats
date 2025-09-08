"use client";

import { useState, useEffect, use } from "react";
import { ChevronLeft, ChevronRight, X, Timer, Check } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/src/lib/supabase/client";
import { formatTime } from "@/src/lib/utils";
import { useExternalRecipe } from "@/src/lib/hooks";

interface Step {
  id: string;
  step_number: number;
  text: string;
  timer_seconds: number | null;
}

interface CookModeState {
  currentStepIndex: number;
  completedSteps: number[];
  activeTimer: number | null;
  timerStartTime: number | null;
}

export default function CookModePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [recipe, setRecipe] = useState<any>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [activeTimer, setActiveTimer] = useState<number | null>(null);
  const [timerStartTime, setTimerStartTime] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Use the external recipe hook (always LIVE mode now)
  const { data: externalRecipe, isLoading: externalLoading } =
    useExternalRecipe({ idOrSlug: id });

  // Load cook mode state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem(`cook-mode-${id}`);
    if (savedState) {
      try {
        const state: CookModeState = JSON.parse(savedState);
        setCurrentStepIndex(state.currentStepIndex);
        setCompletedSteps(new Set(state.completedSteps));
        if (state.activeTimer && state.timerStartTime) {
          const elapsed = Math.floor(
            (Date.now() - state.timerStartTime) / 1000
          );
          const remaining = Math.max(0, state.activeTimer - elapsed);
          if (remaining > 0) {
            setActiveTimer(remaining);
            setTimerStartTime(state.timerStartTime);
          }
        }
      } catch (error) {
        console.error("Failed to load cook mode state:", error);
      }
    }
  }, [id]);

  // Save cook mode state to localStorage
  const saveState = (
    newCurrentStep?: number,
    newCompletedSteps?: Set<number>,
    newTimer?: number | null
  ) => {
    const state: CookModeState = {
      currentStepIndex: newCurrentStep ?? currentStepIndex,
      completedSteps: Array.from(newCompletedSteps ?? completedSteps),
      activeTimer: newTimer ?? activeTimer,
      timerStartTime: newTimer ? Date.now() : timerStartTime,
    };
    localStorage.setItem(`cook-mode-${id}`, JSON.stringify(state));
  };

  useEffect(() => {
    // Always use external API (LIVE mode)
    if (externalRecipe && !externalLoading) {
      setRecipe(externalRecipe);
      // Convert external recipe steps to the expected format
      const convertedSteps = externalRecipe.steps.map(
        (step: any, index: number) => ({
          id: `ext-${index}`,
          step_number: index + 1,
          text: step.text,
          timer_seconds: step.timer_seconds || null,
        })
      );
      setSteps(convertedSteps);
      setLoading(false);
    } else if (externalLoading) {
      setLoading(true);
    }
  }, [id, externalRecipe, externalLoading]);

  useEffect(() => {
    // Prevent screen sleep on mobile
    if ("wakeLock" in navigator) {
      let wakeLock: any = null;

      const requestWakeLock = async () => {
        try {
          wakeLock = await (navigator as any).wakeLock.request("screen");
        } catch (err) {
          console.error("Wake Lock error:", err);
        }
      };

      requestWakeLock();

      return () => {
        if (wakeLock) {
          wakeLock.release();
        }
      };
    }
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault();
        handlePrevStep();
      } else if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault();
        handleNextStep();
      } else if (event.key === " ") {
        event.preventDefault();
        handleToggleComplete();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentStepIndex, steps.length, completedSteps]);

  useEffect(() => {
    if (activeTimer === null) return;

    const interval = setInterval(() => {
      setActiveTimer((prev) => {
        if (prev === null || prev <= 1) {
          // Timer finished
          const audio = new Audio("/timer-done.mp3");
          audio.play().catch(() => {});
          setTimerStartTime(null);
          saveState(currentStepIndex, completedSteps, null);
          return null;
        }
        const newTimer = prev - 1;
        saveState(currentStepIndex, completedSteps, newTimer);
        return newTimer;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTimer, currentStepIndex, completedSteps]);

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      const newIndex = currentStepIndex - 1;
      setCurrentStepIndex(newIndex);
      saveState(newIndex, completedSteps, activeTimer);
    }
  };

  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      const newIndex = currentStepIndex + 1;
      setCurrentStepIndex(newIndex);
      saveState(newIndex, completedSteps, activeTimer);
    }
  };

  const handleToggleComplete = () => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(currentStepIndex)) {
      newCompleted.delete(currentStepIndex);
    } else {
      newCompleted.add(currentStepIndex);
    }
    setCompletedSteps(newCompleted);
    saveState(currentStepIndex, newCompleted, activeTimer);
  };

  const handleStartTimer = () => {
    const currentStep = steps[currentStepIndex];
    if (currentStep?.timer_seconds) {
      setActiveTimer(currentStep.timer_seconds);
      setTimerStartTime(Date.now());
      saveState(currentStepIndex, completedSteps, currentStep.timer_seconds);
    }
  };

  const handleStopTimer = () => {
    setActiveTimer(null);
    setTimerStartTime(null);
    saveState(currentStepIndex, completedSteps, null);
  };

  const handleStepClick = (index: number) => {
    setCurrentStepIndex(index);
    saveState(index, completedSteps, activeTimer);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background dark:bg-background-dark flex items-center justify-center">
        <div className="text-muted dark:text-muted-dark">Loading recipe...</div>
      </div>
    );
  }

  if (!recipe || steps.length === 0) {
    return (
      <div className="min-h-screen bg-background dark:bg-background-dark flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted dark:text-muted-dark mb-4">
            Recipe not found
          </p>
          <Link href="/" className="text-primary hover:underline">
            Return home
          </Link>
        </div>
      </div>
    );
  }

  const currentStep = steps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark flex flex-col">
      {/* Header */}
      <div className="bg-surface dark:bg-surface-dark border-b border-border dark:border-border-dark">
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold text-text dark:text-text-dark truncate">
              {recipe.title}
            </h1>
            <Link
              href={`/recipe/${recipe.id}`}
              className="p-2 hover:bg-muted/10 rounded-lg transition-colors"
              aria-label="Exit cook mode"
            >
              <X className="w-5 h-5 text-muted dark:text-muted-dark" />
            </Link>
          </div>

          {/* Progress bar */}
          <div className="mt-3">
            <div className="h-2 bg-muted/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-muted dark:text-muted-dark mt-2">
              Step {currentStepIndex + 1} of {steps.length}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          <div className="bg-surface dark:bg-surface-dark rounded-lg p-8 shadow-lg">
            {/* Step Number */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-5xl font-bold text-primary">
                {currentStep.step_number}
              </span>
              <button
                onClick={handleToggleComplete}
                className={`p-3 rounded-lg transition-colors ${
                  completedSteps.has(currentStepIndex)
                    ? "bg-primary text-white"
                    : "bg-muted/10 text-muted dark:text-muted-dark hover:bg-muted/20"
                }`}
                aria-label={
                  completedSteps.has(currentStepIndex)
                    ? "Mark as incomplete"
                    : "Mark as complete"
                }
              >
                <Check className="w-6 h-6" />
              </button>
            </div>

            {/* Step Text */}
            <p className="text-xl lg:text-2xl text-text dark:text-text-dark leading-relaxed mb-8">
              {currentStep.text}
            </p>

            {/* Timer */}
            {currentStep.timer_seconds && (
              <div className="mb-8">
                {activeTimer !== null ? (
                  <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Timer className="w-6 h-6 text-primary" />
                      <span className="text-2xl font-mono font-semibold text-primary">
                        {formatTime(Math.floor(activeTimer / 60))}:
                        {String(activeTimer % 60).padStart(2, "0")}
                      </span>
                    </div>
                    <button
                      onClick={handleStopTimer}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Stop
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleStartTimer}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Timer className="w-5 h-5" />
                    Start{" "}
                    {formatTime(
                      Math.floor(currentStep.timer_seconds / 60)
                    )}{" "}
                    timer
                  </button>
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={handlePrevStep}
                disabled={currentStepIndex === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  currentStepIndex === 0
                    ? "bg-muted/10 text-muted/50 cursor-not-allowed"
                    : "bg-muted/10 text-text dark:text-text-dark hover:bg-muted/20"
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
                Previous
              </button>

              <div className="flex gap-2">
                {steps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleStepClick(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentStepIndex
                        ? "bg-primary w-8"
                        : completedSteps.has(index)
                        ? "bg-primary/50"
                        : "bg-muted/30"
                    }`}
                    aria-label={`Go to step ${index + 1}`}
                  />
                ))}
              </div>

              {currentStepIndex === steps.length - 1 ? (
                <Link
                  href={`/recipe/${recipe.id}`}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Finish
                  <Check className="w-5 h-5" />
                </Link>
              ) : (
                <button
                  onClick={handleNextStep}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Next
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Keyboard shortcuts hint */}
            <div className="mt-6 text-center text-sm text-muted dark:text-muted-dark">
              <p>Use arrow keys to navigate • Space to mark complete</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
