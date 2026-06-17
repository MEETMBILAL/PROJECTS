"use client";

import { formatPrice } from "@/lib/utils";
import type { CheckoutInput } from "@/lib/validations";
import type { LocalCartItem } from "@/store/cartStore";

interface OrderReviewProps {
  items: LocalCartItem[];
  values: CheckoutInput;
}

const METHOD_LABELS: Record<string, string> = {
  cod: "Cash on Delivery",
  jazzcash: "JazzCash",
  stripe: "Credit / Debit Card",
};

export function OrderReview({ items, values }: OrderReviewProps) {
  return (
    <div className="flex flex-col gap-5">
      <section>
        <h3 className="mb-2 font-medium text-text-primary">Shipping to</h3>
        <div className="rounded-xl border border-bsborder p-4 text-sm text-text-secondary">
          <p className="text-text-primary">{values.address.full_name}</p>
          <p>{values.address.phone}</p>
          <p>
            {values.address.street}, {values.address.city}, {values.address.province}
          </p>
          <p>{values.address.country}</p>
        </div>
      </section>

      <section>
        <h3 className="mb-2 font-medium text-text-primary">Payment method</h3>
        <div className="rounded-xl border border-bsborder p-4 text-sm text-text-secondary">
          {METHOD_LABELS[values.payment_method]}
        </div>
      </section>

      <section>
        <h3 className="mb-2 font-medium text-text-primary">Items</h3>
        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <div
              key={item.book.id}
              className="flex items-center justify-between rounded-xl border border-bsborder p-3 text-sm"
            >
              <span className="text-text-primary">
                {item.book.title} × {item.quantity}
              </span>
              <span className="text-text-secondary">
                {formatPrice(parseFloat(item.book.effective_price) * item.quantity)}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
