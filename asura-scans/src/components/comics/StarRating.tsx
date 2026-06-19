import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  className?: string;
}

export function StarRating({
  rating,
  maxRating = 10,
  size = "sm",
  showValue = true,
  className,
}: StarRatingProps) {
  const normalized = (rating / maxRating) * 5;
  const sizeClass = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  }[size];

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex" aria-label={`Rating: ${rating} out of ${maxRating}`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              sizeClass,
              i < Math.floor(normalized)
                ? "fill-brand-gold text-brand-gold"
                : i < normalized
                  ? "fill-brand-gold/50 text-brand-gold"
                  : "fill-none text-brand-muted"
            )}
          />
        ))}
      </div>
      {showValue && (
        <span className="text-sm font-semibold text-brand-gold">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

interface InteractiveStarRatingProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function InteractiveStarRating({
  value,
  onChange,
  disabled,
}: InteractiveStarRatingProps) {
  return (
    <div className="flex items-center gap-1" role="group" aria-label="Rate this comic">
      {Array.from({ length: 10 }).map((_, i) => {
        const score = i + 1;
        return (
          <button
            key={score}
            type="button"
            disabled={disabled}
            onClick={() => onChange(score)}
            className="transition-colors duration-150 ease-in-out hover:scale-110 disabled:opacity-50"
            aria-label={`Rate ${score} out of 10`}
          >
            <Star
              className={cn(
                "h-5 w-5",
                score <= value
                  ? "fill-brand-gold text-brand-gold"
                  : "fill-none text-brand-muted hover:text-brand-gold"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
