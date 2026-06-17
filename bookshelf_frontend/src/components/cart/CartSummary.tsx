"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

import { ROUTES } from "@/constants/routes";
import { cartApi } from "@/lib/api/cart";
import { ApiError } from "@/lib/api/client";
import { formatPrice } from "@/lib/utils";
import type { Cart, CouponResult } from "@/types/cart";

const FREE_SHIPPING_THRESHOLD = 3000;
const SHIPPING_FEE = 250;

export function CartSummary({ cart, showCheckout = true }: { cart: Cart; showCheckout?: boolean }) {
  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState<CouponResult | null>(null);
  const [applying, setApplying] = useState(false);

  const subtotal = parseFloat(cart.subtotal);
  const discount = applied ? parseFloat(applied.discount) : 0;
  const shipping =
    subtotal - discount >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FEE;
  const total = subtotal - discount + shipping;

  const applyCoupon = async () => {
    if (!coupon.trim()) return;
    setApplying(true);
    try {
      const result = await cartApi.applyCoupon(coupon.trim());
      setApplied(result);
      toast.success("Coupon applied!");
    } catch (error) {
      setApplied(null);
      toast.error((error as ApiError).message);
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="card sticky top-24 p-5">
      <h3 className="font-display text-lg font-semibold">Order Summary</h3>

      <div className="mt-4 flex gap-2">
        <input
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
          placeholder="Coupon code"
          className="input py-2 text-sm uppercase"
        />
        <button
          type="button"
          onClick={applyCoupon}
          disabled={applying}
          className="btn-outline shrink-0 px-4 py-2 text-sm"
        >
          Apply
        </button>
      </div>

      <dl className="mt-5 space-y-2.5 text-sm">
        <div className="flex justify-between">
          <dt className="text-text-secondary">Subtotal</dt>
          <dd>{formatPrice(subtotal)}</dd>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-success">
            <dt>Discount ({applied?.coupon_code})</dt>
            <dd>- {formatPrice(discount)}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt className="text-text-secondary">Shipping</dt>
          <dd>{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
        </div>
        {shipping > 0 && (
          <p className="text-xs text-text-muted">
            Add {formatPrice(FREE_SHIPPING_THRESHOLD - (subtotal - discount))} more for free
            shipping.
          </p>
        )}
        <div className="flex justify-between border-t border-bsborder pt-3 text-base font-semibold">
          <dt>Total</dt>
          <dd className="text-primary">{formatPrice(total)}</dd>
        </div>
      </dl>

      {showCheckout && (
        <Link
          href={ROUTES.checkout}
          className="btn-primary mt-5 w-full"
          aria-disabled={cart.total_items === 0}
        >
          Proceed to Checkout
        </Link>
      )}
    </div>
  );
}
