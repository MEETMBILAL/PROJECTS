import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number | string;
  size?: number;
  showvalue?: boolean;
  reviewCount?: number;
  className?: string;
}

export function StarRating({
  rating,
  size = 16,
  showvalue = false,
  reviewCount,
  className,
}: StarRatingProps) {
  const value = typeof rating === "string" ? parseFloat(rating) : rating;
  const rounded = Math.round(value);

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            width={size}
            height={size}
            className={cn(
              index < rounded
                ? "fill-secondary text-secondary"
                : "fill-transparent text-border",
            )}
          />
        ))}
      </div>
      {showvalue && (
        <span className="text-sm text-ink-secondary">
          {value.toFixed(1)}
          {typeof reviewCount === "number" && ` (${reviewCount})`}
        </span>
      )}
    </div>
  );
}
