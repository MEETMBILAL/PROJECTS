import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";

interface PriceDisplayProps {
  price: string | number;
  originalPrice?: string | number | null;
  currency?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "text-base",
  md: "text-lg",
  lg: "text-2xl",
};

export function PriceDisplay({
  price,
  originalPrice,
  currency = "PKR",
  className,
  size = "md",
}: PriceDisplayProps) {
  const showOriginal =
    originalPrice != null && parseFloat(String(originalPrice)) > parseFloat(String(price));

  return (
    <div className={cn("flex items-baseline gap-2", className)}>
      <span className={cn("font-semibold text-primary", sizeClasses[size])}>
        {formatPrice(price, currency)}
      </span>
      {showOriginal && (
        <span className="text-sm text-text-muted line-through">
          {formatPrice(originalPrice as string, currency)}
        </span>
      )}
    </div>
  );
}
