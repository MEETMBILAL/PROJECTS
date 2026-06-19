"use client";

import { Star } from "lucide-react";
import { cn, formatRating } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  count?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  value?: number;
  onChange?: (value: number) => void;
  className?: string;
}

export function StarRating({
  rating,
  maxRating = 10,
  count,
  size = "md",
  interactive = false,
  value,
  onChange,
  className,
}: StarRatingProps) {
  const displayRating = value ?? rating;
  const stars = 5;
  const normalized = (displayRating / maxRating) * stars;

  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center gap-0.5" role={interactive ? "radiogroup" : undefined} aria-label={`Rating: ${formatRating(displayRating)} out of ${maxRating}`}>
        {Array.from({ length: stars }).map((_, i) => {
          const filled = normalized >= i + 1;
          const partial = !filled && normalized > i;

          return (
            <button
              key={i}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onChange?.(((i + 1) / stars) * maxRating)}
              className={cn(
                interactive && "cursor-pointer hover:scale-110 transition-transform",
                !interactive && "cursor-default"
              )}
              aria-label={interactive ? `Rate ${i + 1} stars` : undefined}
            >
              <Star
                className={cn(
                  sizeClasses[size],
                  filled || partial ? "fill-brand-gold text-brand-gold" : "text-brand-muted"
                )}
              />
            </button>
          );
        })}
      </div>
      <span className="text-sm text-brand-text-primary">
        <span className="font-semibold text-brand-gold">{formatRating(displayRating)}</span>
        <span className="text-brand-text-secondary"> / {maxRating}</span>
        {count !== undefined && (
          <span className="ml-1 text-brand-muted">({count.toLocaleString()} votes)</span>
        )}
      </span>
    </div>
  );
}
