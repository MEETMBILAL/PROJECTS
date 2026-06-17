"use client";

import { cn, formatPrice } from "@/lib/utils";
import type { PODSpecification } from "@/types/pod";

interface PODSpecSelectorProps {
  specs: PODSpecification[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export function PODSpecSelector({
  specs,
  selectedId,
  onSelect,
}: PODSpecSelectorProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {specs.map((spec) => (
        <button
          key={spec.id}
          type="button"
          onClick={() => onSelect(spec.id)}
          className={cn(
            "flex flex-col gap-1 rounded-xl border p-4 text-left transition",
            selectedId === spec.id
              ? "border-primary bg-accent"
              : "border-border bg-white hover:border-primary",
          )}
        >
          <span className="font-medium text-ink">{spec.name}</span>
          <span className="text-xs text-ink-secondary">
            {spec.paper_size} · {spec.binding} · {spec.color_mode} ·{" "}
            {spec.cover_type}
          </span>
          <span className="mt-1 text-sm font-semibold text-primary">
            {formatPrice(spec.price_per_page)}/page
            {parseFloat(spec.setup_fee) > 0 &&
              ` + ${formatPrice(spec.setup_fee)} setup`}
          </span>
        </button>
      ))}
    </div>
  );
}
