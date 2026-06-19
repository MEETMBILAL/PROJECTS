"use client";

import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  /** Average rating on a 0-10 scale. */
  value: number;
  /** Number of stars rendered (default 5; maps 0-10 onto stars). */
  count?: number;
  size?: number;
  className?: string;
  interactive?: boolean;
  /** Called with a 1-10 value when interactive. */
  onRate?: (value: number) => void;
}

export function RatingStars({
  value,
  count = 5,
  size = 16,
  className,
  interactive = false,
  onRate,
}: RatingStarsProps) {
  const [hover, setHover] = React.useState<number | null>(null);
  const ratio = Math.max(0, Math.min(1, value / 10));
  const displayStars = hover !== null ? (hover / 10) * count : ratio * count;

  return (
    <div
      className={cn("inline-flex items-center gap-0.5", className)}
      role={interactive ? "radiogroup" : "img"}
      aria-label={`Rating ${value.toFixed(1)} out of 10`}
    >
      {Array.from({ length: count }).map((_, i) => {
        const fill = Math.max(0, Math.min(1, displayStars - i));
        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onMouseEnter={() => interactive && setHover(((i + 1) / count) * 10)}
            onMouseLeave={() => interactive && setHover(null)}
            onClick={() => interactive && onRate?.(Math.round(((i + 1) / count) * 10))}
            className={cn(
              "relative leading-none",
              interactive && "cursor-pointer transition-transform hover:scale-110",
              !interactive && "cursor-default",
            )}
            aria-label={`${i + 1} star`}
          >
            <Star size={size} className="text-brand-surface" />
            <span
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fill * 100}%` }}
            >
              <Star size={size} className="fill-brand-gold text-brand-gold" />
            </span>
          </button>
        );
      })}
    </div>
  );
}
