"use client";

import { Star } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

export function StarRating({
  value,
  interactive = false,
  onRate,
  size = "sm",
}: {
  value: number;
  interactive?: boolean;
  onRate?: (value: number) => void;
  size?: "sm" | "md";
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const displayValue = hovered ?? Math.round(value / 2);
  const iconClass = size === "md" ? "h-5 w-5" : "h-4 w-4";

  return (
    <div className="flex items-center gap-0.5" aria-label={`${value.toFixed(1)} out of 10 stars`}>
      {Array.from({ length: 5 }, (_, index) => {
        const star = index + 1;
        const filled = star <= displayValue;
        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onMouseEnter={() => interactive && setHovered(star)}
            onMouseLeave={() => interactive && setHovered(null)}
            onClick={() => onRate?.(star * 2)}
            className={cn("rounded-sm disabled:pointer-events-none", interactive && "cursor-pointer")}
            aria-label={interactive ? `Rate ${star * 2} out of 10` : undefined}
          >
            <Star className={cn(iconClass, filled ? "fill-brand-ratingGold text-brand-ratingGold" : "text-brand-textMuted")} />
          </button>
        );
      })}
    </div>
  );
}
