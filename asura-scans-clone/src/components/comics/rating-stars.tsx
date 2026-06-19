"use client";

import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  /** Rating on a 0-10 scale. */
  value: number;
  /** Number of star icons to render. */
  count?: number;
  size?: number;
  className?: string;
  interactive?: boolean;
  onRate?: (value10: number) => void;
}

/** Renders 5 stars representing a 0-10 score (each star = 2 points). */
export function RatingStars({
  value,
  count = 5,
  size = 16,
  className,
  interactive = false,
  onRate,
}: RatingStarsProps) {
  const [hover, setHover] = React.useState<number | null>(null);
  const scale10 = hover ?? value;
  const perStar = 10 / count;

  return (
    <div
      className={cn("flex items-center", className)}
      role={interactive ? "radiogroup" : "img"}
      aria-label={`Rating: ${value.toFixed(1)} out of 10`}
    >
      {Array.from({ length: count }).map((_, i) => {
        const starValue10 = (i + 1) * perStar;
        const fillPct = Math.round(
          Math.min(1, Math.max(0, (scale10 - i * perStar) / perStar)) * 100
        );
        const StarIcon = (
          <span
            className="relative inline-block"
            style={{ width: size, height: size }}
          >
            <Star
              className="absolute inset-0 text-brand-text-muted"
              style={{ width: size, height: size }}
              strokeWidth={1.5}
            />
            <span
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fillPct}%` }}
            >
              <Star
                className="text-brand-gold"
                style={{ width: size, height: size }}
                fill="currentColor"
                strokeWidth={1.5}
              />
            </span>
          </span>
        );

        if (!interactive) return <span key={i}>{StarIcon}</span>;

        return (
          <button
            key={i}
            type="button"
            role="radio"
            aria-checked={value >= starValue10}
            aria-label={`Rate ${starValue10} out of 10`}
            className="transition-transform duration-150 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple rounded"
            onMouseEnter={() => setHover(starValue10)}
            onMouseLeave={() => setHover(null)}
            onClick={() => onRate?.(starValue10)}
          >
            {StarIcon}
          </button>
        );
      })}
    </div>
  );
}
