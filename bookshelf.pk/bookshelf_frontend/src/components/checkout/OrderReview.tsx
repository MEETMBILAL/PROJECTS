"use client";

import { formatPrice } from "@/lib/utils";
import type { AddressInput } from "@/lib/validations";
import type { Cart } from "@/types/cart";
import type { PaymentMethod } from "@/types/order";

interface OrderReviewProps {
  cart: Cart;
  address: AddressInput;
  paymentMethod: PaymentMethod;
}

const paymentLabels: Record<PaymentMethod, string> = {
  cod: "Cash on Delivery",
  jazzcash: "JazzCash",
  stripe: "Credit / Debit Card",
};

export function OrderReview({
  cart,
  address,
  paymentMethod,
}: OrderReviewProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="card p-4">
        <h4 className="mb-2 font-semibold text-ink">Shipping to</h4>
        <p className="text-sm text-ink-secondary">
          {address.recipient_name} · {address.recipient_phone}
          <br />
          {address.street}, {address.city}, {address.province}
          <br />
          {address.country}
        </p>
      </div>

      <div className="card p-4">
        <h4 className="mb-2 font-semibold text-ink">Payment</h4>
        <p className="text-sm text-ink-secondary">
          {paymentLabels[paymentMethod]}
        </p>
      </div>

      <div className="card p-4">
        <h4 className="mb-2 font-semibold text-ink">Items</h4>
        <ul className="divide-y divide-border">
          {cart.items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between py-2 text-sm"
            >
              <span className="text-ink">
                {item.book.title} × {item.quantity}
              </span>
              <span className="font-medium text-ink">
                {formatPrice(item.total_price)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
