"use client";

import * as React from "react";
import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

interface StarRatingProps {
  /** Rating value on a 0-10 scale. */
  value: number;
  /** If provided, the component becomes interactive and reports the chosen 1-10 value. */
  onRate?: (value: number) => void;
  size?: number;
  className?: string;
  showValue?: boolean;
}

/**
 * 5-star display (0-10 scale, so each star = 2 points) with optional interactive
 * mode for submitting a rating.
 */
export function StarRating({
  value,
  onRate,
  size = 16,
  className,
  showValue = false,
}: StarRatingProps) {
  const [hover, setHover] = React.useState<number | null>(null);
  const interactive = Boolean(onRate);
  const displayed = hover ?? value;
  const fraction = displayed / 2; // 0-5

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div
        className="flex items-center"
        role={interactive ? "radiogroup" : undefined}
        aria-label={interactive ? "Rate this comic" : `Rating ${value} out of 10`}
      >
        {Array.from({ length: 5 }).map((_, i) => {
          const fillPct = Math.max(0, Math.min(1, fraction - i)) * 100;
          return (
            <button
              key={i}
              type="button"
              disabled={!interactive}
              aria-label={`${(i + 1) * 2} out of 10`}
              className={cn(
                "relative",
                interactive ? "cursor-pointer" : "cursor-default"
              )}
              onMouseEnter={() => interactive && setHover((i + 1) * 2)}
              onMouseLeave={() => interactive && setHover(null)}
              onClick={() => onRate?.((i + 1) * 2)}
            >
              <Star
                style={{ width: size, height: size }}
                className="text-brand-surface"
              />
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fillPct}%` }}
              >
                <Star
                  style={{ width: size, height: size }}
                  className="fill-brand-gold text-brand-gold"
                />
              </span>
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className="text-xs font-semibold text-brand-gold">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
}
