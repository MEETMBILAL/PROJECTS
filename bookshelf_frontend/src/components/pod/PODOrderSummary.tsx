"use client";

import { formatPrice } from "@/lib/utils";
import type { PODSpecification } from "@/types";

interface PODOrderSummaryProps {
  spec: PODSpecification | null;
  pageCount: number;
  copies: number;
  totalPrice: string | null;
  onSubmit: () => void;
  submitting: boolean;
  canSubmit: boolean;
}

export function PODOrderSummary({
  spec,
  pageCount,
  copies,
  totalPrice,
  onSubmit,
  submitting,
  canSubmit,
}: PODOrderSummaryProps) {
  return (
    <div className="card-bs flex flex-col gap-3 p-5">
      <h3 className="font-display text-lg text-primary">Print Summary</h3>
      <Row label="Specification" value={spec?.name ?? "—"} />
      <Row label="Pages" value={String(pageCount || 0)} />
      <Row label="Copies" value={String(copies)} />
      {spec && (
        <>
          <Row label="Price per page" value={formatPrice(spec.price_per_page)} />
          <Row label="Setup fee" value={formatPrice(spec.setup_fee)} />
        </>
      )}
      <div className="border-t border-bsborder pt-3">
        <Row label="Estimated total" value={totalPrice ? formatPrice(totalPrice) : "—"} bold />
      </div>
      <button
        type="button"
        onClick={onSubmit}
        disabled={!canSubmit || submitting}
        className="btn-primary mt-2 w-full disabled:opacity-40"
      >
        {submitting ? "Submitting..." : "Submit Print Order"}
      </button>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className={bold ? "font-semibold text-text-primary" : "text-text-secondary"}>
        {label}
      </span>
      <span className={bold ? "text-lg font-semibold text-primary" : "text-text-primary"}>
        {value}
      </span>
    </div>
  );
}
