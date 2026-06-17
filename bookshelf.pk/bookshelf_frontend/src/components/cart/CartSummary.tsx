"use client";

import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

import { ROUTES } from "@/constants/routes";
import {
  DEFAULT_SHIPPING_FEE,
  FREE_SHIPPING_THRESHOLD,
} from "@/constants/config";
import { cartApi } from "@/lib/api/cart";
import { formatPrice } from "@/lib/utils";

interface CartSummaryProps {
  subtotal: number;
  showCheckoutButton?: boolean;
  onDiscountApplied?: (discount: number, code: string) => void;
}

export function CartSummary({
  subtotal,
  showCheckoutButton = true,
  onDiscountApplied,
}: CartSummaryProps) {
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [applying, setApplying] = useState(false);

  const shipping =
    subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0
      ? 0
      : DEFAULT_SHIPPING_FEE;
  const total = Math.max(0, subtotal - discount + shipping);

  const applyCoupon = async () => {
    if (!code.trim()) return;
    setApplying(true);
    try {
      const result = await cartApi.applyCoupon(code.trim());
      const value = parseFloat(result.discount);
      setDiscount(value);
      onDiscountApplied?.(value, result.code);
      toast.success(`Coupon ${result.code} applied`);
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="card flex flex-col gap-4 p-5">
      <h3 className="font-display text-lg text-ink">Order Summary</h3>

      <div className="flex gap-2">
        <input
          value={code}
          onChange={(event) => setCode(event.target.value.toUpperCase())}
          placeholder="Coupon code"
          className="input-bs"
        />
        <button
          type="button"
          onClick={applyCoupon}
          disabled={applying}
          className="btn-outline px-4 py-2"
        >
          Apply
        </button>
      </div>

      <dl className="flex flex-col gap-2 text-sm">
        <Row label="Subtotal" value={formatPrice(subtotal)} />
        {discount > 0 && (
          <Row label="Discount" value={`- ${formatPrice(discount)}`} accent />
        )}
        <Row
          label="Shipping"
          value={shipping === 0 ? "Free" : formatPrice(shipping)}
        />
        <div className="my-1 border-t border-border" />
        <Row label="Total" value={formatPrice(total)} bold />
      </dl>

      {showCheckoutButton && (
        <Link
          href={ROUTES.checkout}
          className="btn-primary w-full"
          aria-disabled={subtotal === 0}
        >
          Proceed to Checkout
        </Link>
      )}
    </div>
  );
}

function Row({
  label,
  value,
  bold,
  accent,
}: {
  label: string;
  value: string;
  bold?: boolean;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <dt className={bold ? "font-semibold text-ink" : "text-ink-secondary"}>
        {label}
      </dt>
      <dd
        className={
          bold
            ? "text-lg font-semibold text-primary"
            : accent
              ? "font-medium text-success"
              : "text-ink"
        }
      >
        {value}
      </dd>
    </div>
  );
}
