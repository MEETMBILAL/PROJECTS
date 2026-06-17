"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Check } from "lucide-react";

import { AddressForm } from "./AddressForm";
import { OrderReview } from "./OrderReview";
import { PaymentForm } from "./PaymentForm";
import { CartSummary } from "@/components/cart/CartSummary";
import { ROUTES } from "@/constants/routes";
import { useCart } from "@/hooks/useCart";
import { ordersApi } from "@/lib/api/orders";
import { addressSchema, type AddressInput } from "@/lib/validations";
import { cn } from "@/lib/utils";
import type { PaymentMethod } from "@/types/order";

const steps = ["Address", "Payment", "Review"] as const;

export function CheckoutForm() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const [step, setStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<AddressInput>({
    resolver: zodResolver(addressSchema),
    defaultValues: { country: "Pakistan" },
  });

  const subtotal = parseFloat(cart?.subtotal ?? "0");

  const next = async () => {
    if (step === 0) {
      const valid = await trigger();
      if (!valid) return;
    }
    setStep((value) => Math.min(steps.length - 1, value + 1));
  };

  const back = () => setStep((value) => Math.max(0, value - 1));

  const placeOrder = async () => {
    setSubmitting(true);
    try {
      const address = getValues();
      const order = await ordersApi.create({
        shipping_address: address,
        payment_method: paymentMethod,
      });
      clearCart();
      toast.success(`Order ${order.order_number} placed!`);
      router.push(ROUTES.order(order.order_number));
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div>
        <ol className="mb-8 flex items-center gap-2">
          {steps.map((label, index) => (
            <li key={label} className="flex flex-1 items-center gap-2">
              <span
                className={cn(
                  "inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold",
                  index < step
                    ? "bg-success text-white"
                    : index === step
                      ? "bg-primary text-white"
                      : "bg-surface-alt text-ink-muted",
                )}
              >
                {index < step ? <Check className="h-4 w-4" /> : index + 1}
              </span>
              <span
                className={cn(
                  "text-sm font-medium",
                  index === step ? "text-ink" : "text-ink-muted",
                )}
              >
                {label}
              </span>
              {index < steps.length - 1 && (
                <span className="h-px flex-1 bg-border" />
              )}
            </li>
          ))}
        </ol>

        <div className="card p-6">
          {step === 0 && <AddressForm register={register} errors={errors} />}
          {step === 1 && (
            <PaymentForm value={paymentMethod} onChange={setPaymentMethod} />
          )}
          {step === 2 && cart && (
            <OrderReview
              cart={cart}
              address={getValues()}
              paymentMethod={paymentMethod}
            />
          )}

          <div className="mt-6 flex items-center justify-between">
            {step > 0 ? (
              <button type="button" onClick={back} className="btn-outline">
                Back
              </button>
            ) : (
              <span />
            )}
            {step < steps.length - 1 ? (
              <button type="button" onClick={next} className="btn-primary">
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={placeOrder}
                disabled={submitting}
                className="btn-primary"
              >
                {submitting ? "Placing order…" : "Place Order"}
              </button>
            )}
          </div>
        </div>
      </div>

      <CartSummary subtotal={subtotal} showCheckoutButton={false} />
    </div>
  );
}
