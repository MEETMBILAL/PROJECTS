"use client";

import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

export function RatingStars({ value, interactive = false, onRate }: { value: number; interactive?: boolean; onRate?: (rating: number) => void }) {
  const full = Math.round(value / 2);
  return (
    <div className="flex items-center gap-1" aria-label={`Rating ${value} out of 10`}>
      {Array.from({ length: 5 }).map((_, index) => {
        const active = index < full;
        return (
          <button
            key={index}
            type="button"
            disabled={!interactive}
            onClick={() => onRate?.((index + 1) * 2)}
            className={cn("rounded-sm", interactive && "hover:scale-110")}
            aria-label={interactive ? `Rate ${(index + 1) * 2} out of 10` : undefined}
          >
            <Star className={cn("h-4 w-4", active ? "fill-brand-gold text-brand-gold" : "text-brand-muted")} />
          </button>
        );
      })}
      <span className="ml-1 text-xs font-semibold text-white">{value.toFixed(1)}</span>
    </div>
  );
}
