import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  count?: number;
  size?: number;
  className?: string;
}

export function StarRating({ rating, count, size = 16, className }: StarRatingProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={cn(
              star <= Math.round(rating)
                ? "fill-secondary text-secondary"
                : "text-bsborder",
            )}
          />
        ))}
      </div>
      {typeof count === "number" && (
        <span className="text-sm text-text-secondary">({count})</span>
      )}
    </div>
  );
}
