import { Star } from "lucide-react";
import { cn, formatRating } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  count?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  className?: string;
}

export function RatingStars({
  rating,
  count,
  size = "md",
  showValue = true,
  className,
}: RatingStarsProps) {
  const sizeClasses = {
    sm: "h-3 w-3 text-xs",
    md: "h-4 w-4 text-sm",
    lg: "h-5 w-5 text-base",
  };

  return (
    <div className={cn("flex items-center gap-1", className)} aria-label={`Rating: ${rating} out of 10`}>
      <Star className={cn(sizeClasses[size], "fill-brand-gold text-brand-gold")} />
      {showValue && (
        <span className={cn("font-semibold text-brand-gold", sizeClasses[size])}>
          {formatRating(rating)}
        </span>
      )}
      {count !== undefined && (
        <span className="text-brand-text-muted text-xs">({count.toLocaleString()})</span>
      )}
    </div>
  );
}
