"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import Link from "next/link";

import { AddressForm } from "./AddressForm";
import { PaymentForm } from "./PaymentForm";
import { OrderReview } from "./OrderReview";
import { CartSummary } from "@/components/cart/CartSummary";
import { ROUTES } from "@/constants/routes";
import { cartApi } from "@/lib/api/cart";
import { ordersApi } from "@/lib/api/orders";
import { paymentsApi } from "@/lib/api/payments";
import { checkoutSchema, type CheckoutInput } from "@/lib/validations";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";

const STEPS = ["Address", "Payment", "Review"] as const;

export function CheckoutForm() {
  const router = useRouter();
  const { status } = useSession();
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.subtotal());
  const clearCart = useCartStore((state) => state.clear);
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      address: { country: "Pakistan" },
      payment_method: "cod",
      coupon_code: "",
      notes: "",
    },
  });

  const next = async () => {
    if (step === 0) {
      const valid = await form.trigger("address");
      if (!valid) return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const back = () => setStep((s) => Math.max(s - 1, 0));

  const onSubmit = async (values: CheckoutInput) => {
    if (status !== "authenticated") {
      toast.error("Please sign in to place your order.");
      router.push(ROUTES.login);
      return;
    }
    setSubmitting(true);
    try {
      // Sync local cart to the server before creating the order.
      await cartApi.clear().catch(() => undefined);
      for (const item of items) {
        await cartApi.add(item.book.id, item.quantity);
      }
      const order = await ordersApi.create({
        shipping_address: {
          full_name: values.address.full_name,
          phone: values.address.phone,
          street: values.address.street,
          city: values.address.city,
          province: values.address.province,
          postal_code: values.address.postal_code,
          country: values.address.country,
        },
        coupon_code: values.coupon_code,
        notes: values.notes,
      });

      if (values.payment_method === "stripe") {
        await paymentsApi.createStripeIntent(order.order_number).catch(() => undefined);
      } else if (values.payment_method === "jazzcash") {
        await paymentsApi.initiateJazzCash(order.order_number).catch(() => undefined);
      }

      clearCart();
      toast.success("Order placed successfully!");
      router.push(ROUTES.order(order.order_number));
    } catch {
      toast.error("Could not place your order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="card-bs p-10 text-center">
        <p className="text-text-secondary">Your cart is empty.</p>
        <Link href={ROUTES.books} className="btn-primary mt-4">
          Browse Books
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          {STEPS.map((label, idx) => (
            <div key={label} className="flex flex-1 items-center gap-2">
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium",
                  idx <= step ? "bg-primary text-surface" : "bg-surface-alt text-text-muted",
                )}
              >
                {idx + 1}
              </span>
              <span
                className={cn(
                  "text-sm",
                  idx === step ? "font-medium text-text-primary" : "text-text-muted",
                )}
              >
                {label}
              </span>
              {idx < STEPS.length - 1 && (
                <span className="h-px flex-1 bg-bsborder" />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="card-bs p-6">
          {step === 0 && <AddressForm form={form} />}
          {step === 1 && <PaymentForm form={form} />}
          {step === 2 && <OrderReview items={items} values={form.getValues()} />}

          <div className="mt-6 flex justify-between">
            {step > 0 ? (
              <button type="button" onClick={back} className="btn-outline">
                Back
              </button>
            ) : (
              <span />
            )}
            {step < STEPS.length - 1 ? (
              <button type="button" onClick={next} className="btn-primary">
                Continue
              </button>
            ) : (
              <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-40">
                {submitting ? "Placing order…" : "Place Order"}
              </button>
            )}
          </div>
        </form>
      </div>

      <div>
        <CartSummary subtotal={subtotal} showCheckoutButton={false} />
      </div>
    </div>
  );
}
