"use client";

import Link from "next/link";

import { ROUTES } from "@/constants/routes";
import { formatPrice } from "@/lib/utils";

interface CartSummaryProps {
  subtotal: number;
  discount?: number;
  shippingFee?: number;
  showCheckoutButton?: boolean;
}

const FREE_SHIPPING_THRESHOLD = 3000;
const DEFAULT_SHIPPING = 200;

export function CartSummary({
  subtotal,
  discount = 0,
  shippingFee,
  showCheckoutButton = true,
}: CartSummaryProps) {
  const computedShipping =
    shippingFee ?? (subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : DEFAULT_SHIPPING);
  const total = Math.max(subtotal + computedShipping - discount, 0);

  return (
    <div className="card-bs flex flex-col gap-3 p-5">
      <h3 className="font-display text-lg text-primary">Order Summary</h3>
      <Row label="Subtotal" value={formatPrice(subtotal)} />
      <Row
        label="Shipping"
        value={computedShipping === 0 ? "Free" : formatPrice(computedShipping)}
      />
      {discount > 0 && <Row label="Discount" value={`- ${formatPrice(discount)}`} />}
      <div className="border-t border-bsborder pt-3">
        <Row label="Total" value={formatPrice(total)} bold />
      </div>
      {subtotal > 0 && subtotal < FREE_SHIPPING_THRESHOLD && (
        <p className="text-xs text-text-muted">
          Add {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping.
        </p>
      )}
      {showCheckoutButton && (
        <Link
          href={ROUTES.checkout}
          className="btn-primary mt-2 w-full aria-disabled:opacity-40"
          aria-disabled={subtotal === 0}
        >
          Proceed to Checkout
        </Link>
      )}
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
