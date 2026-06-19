"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  /** Rating value on a 0-10 scale. */
  value: number;
  /** When true, the user can click stars to set a value (0-10). */
  interactive?: boolean;
  onRate?: (value: number) => void;
  size?: number;
  className?: string;
}

/**
 * Displays a 5-star rating from a 0-10 value (each star = 2 points).
 * When interactive, clicking a star half submits a 0-10 rating.
 */
export function RatingStars({
  value,
  interactive = false,
  onRate,
  size = 16,
  className,
}: RatingStarsProps) {
  const [hover, setHover] = useState<number | null>(null);
  const display = hover ?? value;
  const filledStars = display / 2;

  return (
    <div
      className={cn("flex items-center gap-0.5", className)}
      role={interactive ? "slider" : "img"}
      aria-label={`Rating ${value.toFixed(1)} out of 10`}
      aria-valuenow={interactive ? value : undefined}
      aria-valuemin={interactive ? 0 : undefined}
      aria-valuemax={interactive ? 10 : undefined}
    >
      {Array.from({ length: 5 }).map((_, i) => {
        const fillPct = Math.max(0, Math.min(1, filledStars - i)) * 100;
        return (
          <span
            key={i}
            className="relative inline-block"
            style={{ width: size, height: size }}
            onMouseEnter={interactive ? () => setHover((i + 1) * 2) : undefined}
            onMouseLeave={interactive ? () => setHover(null) : undefined}
            onClick={interactive ? () => onRate?.((i + 1) * 2) : undefined}
            role={interactive ? "button" : undefined}
            tabIndex={interactive ? 0 : undefined}
            onKeyDown={
              interactive
                ? (e) => {
                    if (e.key === "Enter" || e.key === " ") onRate?.((i + 1) * 2);
                  }
                : undefined
            }
          >
            <Star
              className="absolute inset-0 text-brand-surface"
              style={{ width: size, height: size }}
              strokeWidth={1.5}
            />
            <span
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fillPct}%` }}
            >
              <Star
                className="text-brand-gold"
                fill="#FFD700"
                style={{ width: size, height: size }}
                strokeWidth={1.5}
              />
            </span>
          </span>
        );
      })}
    </div>
  );
}
