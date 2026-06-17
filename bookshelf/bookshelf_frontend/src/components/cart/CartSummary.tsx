"use client";

import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { formatPrice } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";
import { apiClient } from "@/lib/api/client";

interface CartSummaryProps {
  subtotal: number;
  showCheckoutButton?: boolean;
  onDiscountChange?: (discount: number, code: string) => void;
}

const FREE_SHIPPING_THRESHOLD = 3000;
const SHIPPING_FEE = 250;

export function CartSummary({
  subtotal,
  showCheckoutButton,
  onDiscountChange,
}: CartSummaryProps) {
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [applying, setApplying] = useState(false);

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0
    ? 0
    : SHIPPING_FEE;
  const total = Math.max(0, subtotal + shipping - discount);

  const applyCoupon = async () => {
    if (!code.trim()) return;
    setApplying(true);
    try {
      const res = await apiClient.post("/coupons/validate/", {
        code,
        subtotal,
      });
      const data = res.data.data;
      if (data.valid) {
        const value = parseFloat(data.discount);
        setDiscount(value);
        onDiscountChange?.(value, code);
        toast.success("Coupon applied!");
      } else {
        setDiscount(0);
        toast.error(data.message || "Invalid coupon.");
      }
    } catch {
      toast.error("Could not validate coupon.");
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="card h-fit space-y-4 p-6">
      <h2 className="font-display text-xl text-text-primary">Order Summary</h2>

      <div className="flex gap-2">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Coupon code"
          className="input"
        />
        <button
          type="button"
          onClick={applyCoupon}
          disabled={applying}
          className="btn-outline shrink-0"
        >
          Apply
        </button>
      </div>

      <div className="space-y-2 border-t border-bordercolor pt-4 text-sm">
        <div className="flex justify-between">
          <span className="text-text-secondary">Subtotal</span>
          <span className="text-text-primary">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-secondary">Shipping</span>
          <span className="text-text-primary">
            {shipping === 0 ? "Free" : formatPrice(shipping)}
          </span>
        </div>
        {discount > 0 ? (
          <div className="flex justify-between text-success">
            <span>Discount</span>
            <span>- {formatPrice(discount)}</span>
          </div>
        ) : null}
      </div>

      <div className="flex justify-between border-t border-bordercolor pt-4">
        <span className="font-medium text-text-primary">Total</span>
        <span className="font-display text-xl font-bold text-primary">
          {formatPrice(total)}
        </span>
      </div>

      {subtotal > 0 && subtotal < FREE_SHIPPING_THRESHOLD ? (
        <p className="text-xs text-text-muted">
          Add {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more for free
          shipping.
        </p>
      ) : null}

      {showCheckoutButton ? (
        <Link href={ROUTES.checkout} className="btn-primary w-full">
          Proceed to Checkout
        </Link>
      ) : null}
    </div>
  );
}
