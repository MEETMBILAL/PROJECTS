"use client";

import { Star } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type RatingStarsProps = {
  value: number;
  voteCount?: number;
  interactive?: boolean;
  comicId?: string;
  className?: string;
};

export function RatingStars({ value, voteCount, interactive = false, comicId, className }: RatingStarsProps) {
  const [optimisticValue, setOptimisticValue] = useState(value);
  const fullStars = Math.round(optimisticValue / 2);

  async function submitRating(nextValue: number) {
    if (!interactive || !comicId) {
      return;
    }

    setOptimisticValue(nextValue * 2);
    await fetch("/api/ratings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comicId, value: nextValue * 2 })
    });
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center gap-0.5" aria-label={`${optimisticValue.toFixed(1)} out of 10 stars`}>
        {Array.from({ length: 5 }, (_, index) => {
          const active = index < fullStars;
          return interactive ? (
            <button
              key={index}
              type="button"
              onClick={() => submitRating(index + 1)}
              className="rounded-sm p-0.5 text-brand-rating transition-transform duration-150 hover:scale-110"
              aria-label={`Rate ${index + 1} stars`}
            >
              <Star className={cn("h-4 w-4", active ? "fill-brand-rating" : "fill-transparent")} />
            </button>
          ) : (
            <Star
              key={index}
              className={cn("h-4 w-4 text-brand-rating", active ? "fill-brand-rating" : "fill-transparent")}
              aria-hidden
            />
          );
        })}
      </div>
      <span className="text-sm font-semibold text-white">{optimisticValue.toFixed(1)}</span>
      {voteCount !== undefined && <span className="text-xs text-brand-textMuted">({voteCount.toLocaleString()} votes)</span>}
    </div>
  );
}
