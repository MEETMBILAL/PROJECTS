"use client";

import { cn, formatPrice } from "@/lib/utils";
import type { PODSpecification } from "@/types/pod";

interface PODSpecSelectorProps {
  specs: PODSpecification[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export function PODSpecSelector({ specs, selectedId, onSelect }: PODSpecSelectorProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {specs.map((spec) => (
        <button
          key={spec.id}
          type="button"
          onClick={() => onSelect(spec.id)}
          className={cn(
            "rounded-xl border-2 p-4 text-left transition-colors",
            selectedId === spec.id
              ? "border-primary bg-accent"
              : "border-bsborder bg-white hover:border-primary/40",
          )}
        >
          <p className="font-medium text-text-primary">{spec.name}</p>
          <p className="mt-1 text-xs text-text-muted">
            {spec.paper_size} · {spec.binding} · {spec.cover_type} · {spec.color_mode}
          </p>
          <p className="mt-2 text-sm text-primary">
            {formatPrice(spec.price_per_page)} / page + {formatPrice(spec.setup_fee)} setup
          </p>
        </button>
      ))}
    </div>
  );
}
