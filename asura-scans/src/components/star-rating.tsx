import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  showValue?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  interactive?: boolean;
  onRate?: (rating: number) => void;
}

export function StarRating({
  rating,
  maxRating = 10,
  showValue = true,
  size = "sm",
  className,
  interactive = false,
  onRate,
}: StarRatingProps) {
  const normalized = Math.min(rating / (maxRating / 5), 5);
  const sizeClass = { sm: "h-3 w-3", md: "h-4 w-4", lg: "h-5 w-5" }[size];

  return (
    <div className={cn("flex items-center gap-1", className)} aria-label={`Rating: ${rating} out of ${maxRating}`}>
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRate?.(((i + 1) / 5) * maxRating)}
            className={cn(interactive && "cursor-pointer hover:scale-110 transition-transform")}
            aria-label={interactive ? `Rate ${i + 1} stars` : undefined}
          >
            <Star
              className={cn(
                sizeClass,
                i < Math.floor(normalized)
                  ? "fill-brand-gold text-brand-gold"
                  : i < normalized
                    ? "fill-brand-gold/50 text-brand-gold"
                    : "fill-none text-brand-muted"
              )}
            />
          </button>
        ))}
      </div>
      {showValue && (
        <span className="text-sm font-medium text-brand-gold">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
