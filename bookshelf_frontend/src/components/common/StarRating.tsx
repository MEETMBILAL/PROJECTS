"use client";

import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: number;
  className?: string;
  showValue?: boolean;
  interactive?: boolean;
  onChange?: (value: number) => void;
}

export function StarRating({
  rating,
  max = 5,
  size = 16,
  className,
  showValue = false,
  interactive = false,
  onChange,
}: StarRatingProps) {
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: max }).map((_, index) => {
        const value = index + 1;
        const filled = value <= Math.round(rating);
        return (
          <button
            key={value}
            type="button"
            disabled={!interactive}
            onClick={() => onChange?.(value)}
            className={cn(interactive && "cursor-pointer", !interactive && "cursor-default")}
            aria-label={`${value} star${value > 1 ? "s" : ""}`}
          >
            <Star
              size={size}
              className={cn(
                filled ? "fill-secondary text-secondary" : "fill-transparent text-bsborder",
              )}
            />
          </button>
        );
      })}
      {showValue && (
        <span className="ml-1 text-sm text-text-secondary">{rating.toFixed(1)}</span>
      )}
    </div>
  );
}
