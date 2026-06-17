"use client";

import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { PODSpecification } from "@/types";

interface PODSpecSelectorProps {
  specifications: PODSpecification[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export function PODSpecSelector({
  specifications,
  selectedId,
  onSelect,
}: PODSpecSelectorProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {specifications.map((spec) => (
        <button
          key={spec.id}
          type="button"
          onClick={() => onSelect(spec.id)}
          className={cn(
            "card-bs flex flex-col gap-1 p-4 text-left transition",
            selectedId === spec.id
              ? "border-primary ring-2 ring-primary/20"
              : "hover:border-primary",
          )}
        >
          <span className="font-medium text-text-primary">{spec.name}</span>
          <span className="text-sm text-text-secondary">
            {spec.paper_size} · {spec.binding} · {spec.cover_type} · {spec.color_mode}
          </span>
          <span className="mt-1 text-sm text-secondary">
            {formatPrice(spec.price_per_page)} / page + {formatPrice(spec.setup_fee)} setup
          </span>
        </button>
      ))}
    </div>
  );
}
