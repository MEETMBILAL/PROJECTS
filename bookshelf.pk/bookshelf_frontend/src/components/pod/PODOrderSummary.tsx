"use client";

import { formatPrice } from "@/lib/utils";

interface PODOrderSummaryProps {
  pages: number;
  copies: number;
  total: number | null;
  isCalculating?: boolean;
  onSubmit: () => void;
  canSubmit: boolean;
  isSubmitting?: boolean;
}

export function PODOrderSummary({
  pages,
  copies,
  total,
  isCalculating,
  onSubmit,
  canSubmit,
  isSubmitting,
}: PODOrderSummaryProps) {
  return (
    <div className="card flex flex-col gap-3 p-5">
      <h3 className="font-display text-lg text-ink">Print Summary</h3>
      <dl className="flex flex-col gap-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-ink-secondary">Pages</dt>
          <dd className="text-ink">{pages}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-ink-secondary">Copies</dt>
          <dd className="text-ink">{copies}</dd>
        </div>
        <div className="my-1 border-t border-border" />
        <div className="flex justify-between">
          <dt className="font-semibold text-ink">Estimated Total</dt>
          <dd className="text-lg font-semibold text-primary">
            {isCalculating
              ? "…"
              : total != null
                ? formatPrice(total)
                : "—"}
          </dd>
        </div>
      </dl>
      <button
        type="button"
        onClick={onSubmit}
        disabled={!canSubmit || isSubmitting}
        className="btn-primary w-full"
      >
        {isSubmitting ? "Placing order…" : "Place Print Order"}
      </button>
    </div>
  );
}
