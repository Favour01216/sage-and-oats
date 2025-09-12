"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { createClient } from "@/src/lib/supabase/client";
import { getRecipeKey } from "@/src/lib/ids";

interface HeartButtonProps {
  recipeId: string;
  recipeSlug?: string;
  initialHearted?: boolean;
  initialCount?: number;
  className?: string;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
}

export function HeartButton({
  recipeId,
  recipeSlug,
  initialHearted = false,
  initialCount = 0,
  className,
  size = "md",
  showCount = true,
}: HeartButtonProps) {
  const [hearted, setHearted] = useState(initialHearted);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  // Use stable key for hearts across LIVE/MIRROR modes
  const stableKey = getRecipeKey({ id: recipeId, slug: recipeSlug });

  useEffect(() => {
    checkHeartStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stableKey]);

  async function checkHeartStatus() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      // Authenticated users: check Supabase
      const { data } = await supabase
        .from("hearts")
        .select("id")
        .eq("recipe_id", stableKey)
        .eq("user_id", user.id)
        .single();

      setHearted(!!data);

      // Get total count from database
      const { count: totalCount } = await supabase
        .from("hearts")
        .select("*", { count: "exact", head: true })
        .eq("recipe_id", stableKey);

      setCount(totalCount || 0);
    } else {
      // Anonymous users: check localStorage
      const localHearts = JSON.parse(localStorage.getItem("hearts") || "[]");
      const isHearted = localHearts.includes(stableKey);
      setHearted(isHearted);

      // For anonymous users, show initial count plus their local heart
      setCount(initialCount + (isHearted ? 1 : 0));
    }
  }

  async function toggleHeart() {
    if (loading) return;
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Authenticated users: save to Supabase
        // Optimistic update
        setHearted(!hearted);
        setCount(hearted ? count - 1 : count + 1);

        if (hearted) {
          // Remove heart
          await supabase.from("hearts").delete().eq("recipe_id", stableKey).eq("user_id", user.id);
        } else {
          // Add heart
          await supabase.from("hearts").insert({ recipe_id: stableKey, user_id: user.id });
        }
      } else {
        // Anonymous users: save to localStorage
        const localHearts = JSON.parse(localStorage.getItem("hearts") || "[]");

        if (hearted) {
          // Remove heart
          const updatedHearts = localHearts.filter((id: string) => id !== stableKey);
          localStorage.setItem("hearts", JSON.stringify(updatedHearts));
          setHearted(false);
          setCount(Math.max(0, count - 1)); // Don't go below 0
        } else {
          // Add heart
          if (!localHearts.includes(stableKey)) {
            localHearts.push(stableKey);
            localStorage.setItem("hearts", JSON.stringify(localHearts));
          }
          setHearted(true);
          setCount(count + 1);
        }
      }
    } catch (error) {
      // Revert optimistic update on error (only for authenticated users)
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setHearted(hearted);
        setCount(hearted ? count + 1 : count - 1);
      }
      console.error("Error toggling heart:", error);
    } finally {
      setLoading(false);
    }
  }

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const buttonSizeClasses = {
    sm: "p-1.5 text-sm",
    md: "p-2 text-base",
    lg: "p-3 text-lg",
  };

  return (
    <button
      onClick={toggleHeart}
      disabled={loading}
      className={cn(
        "flex items-center gap-2 rounded-full transition-all",
        "hover:bg-accent/10 active:scale-95",
        "disabled:cursor-not-allowed disabled:opacity-50",
        buttonSizeClasses[size],
        className,
      )}
      aria-label={hearted ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        className={cn(
          sizeClasses[size],
          "transition-all",
          hearted ? "fill-accent text-accent" : "text-muted",
        )}
      />
      {showCount && (
        <span className={cn("font-medium", hearted ? "text-accent" : "text-muted")}>{count}</span>
      )}
    </button>
  );
}
