import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  count?: number;
  size?: number;
  className?: string;
  onChange?: (value: number) => void;
}

export function StarRating({
  value,
  count,
  size = 16,
  className,
  onChange,
}: StarRatingProps) {
  const rounded = Math.round(value);
  const interactive = Boolean(onChange);

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i < rounded;
          const Wrapper = interactive ? "button" : "span";
          return (
            <Wrapper
              key={i}
              type={interactive ? "button" : undefined}
              onClick={interactive ? () => onChange?.(i + 1) : undefined}
              className={interactive ? "cursor-pointer" : undefined}
              aria-label={`${i + 1} star`}
            >
              <Star
                width={size}
                height={size}
                className={
                  filled
                    ? "fill-secondary text-secondary"
                    : "text-bordercolor"
                }
              />
            </Wrapper>
          );
        })}
      </div>
      {typeof count === "number" ? (
        <span className="text-xs text-text-muted">({count})</span>
      ) : null}
    </div>
  );
}
