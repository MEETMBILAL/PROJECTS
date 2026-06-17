"use client";

import { formatPrice } from "@/lib/utils";
import type { PODSpecification } from "@/types/pod";

interface PODOrderSummaryProps {
  spec: PODSpecification | null;
  pageCount: number;
  copies: number;
}

export function PODOrderSummary({ spec, pageCount, copies }: PODOrderSummaryProps) {
  if (!spec) {
    return (
      <div className="card p-6 text-sm text-text-secondary">
        Select a print specification to see your price.
      </div>
    );
  }

  const setup = parseFloat(spec.setup_fee);
  const perPage = parseFloat(spec.price_per_page);
  const printCost = perPage * pageCount;
  const perCopy = setup + printCost;
  const total = perCopy * copies;

  return (
    <div className="card sticky top-24 p-6">
      <h3 className="font-display text-lg font-semibold">Price Estimate</h3>
      <dl className="mt-4 space-y-2.5 text-sm">
        <Row label="Specification" value={spec.name} />
        <Row label="Pages" value={String(pageCount)} />
        <Row label="Setup fee" value={formatPrice(setup)} />
        <Row label="Printing per copy" value={formatPrice(printCost)} />
        <Row label="Copies" value={`× ${copies}`} />
        <div className="flex justify-between border-t border-bsborder pt-3 text-base font-semibold">
          <dt>Total</dt>
          <dd className="text-primary">{formatPrice(total)}</dd>
        </div>
      </dl>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-text-secondary">{label}</dt>
      <dd className="font-medium text-text-primary">{value}</dd>
    </div>
  );
}
