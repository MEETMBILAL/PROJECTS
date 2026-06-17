"use client";

import type { UseFormReturn } from "react-hook-form";
import { Banknote, CreditCard, Wallet } from "lucide-react";

import { cn } from "@/lib/utils";
import type { CheckoutInput } from "@/lib/validations";

const METHODS = [
  { value: "cod", label: "Cash on Delivery", desc: "Pay when your order arrives", icon: Banknote },
  { value: "jazzcash", label: "JazzCash", desc: "Pay with your JazzCash wallet", icon: Wallet },
  { value: "stripe", label: "Credit / Debit Card", desc: "Secure card payment via Stripe", icon: CreditCard },
] as const;

export function PaymentForm({ form }: { form: UseFormReturn<CheckoutInput> }) {
  const { watch, setValue } = form;
  const selected = watch("payment_method");

  return (
    <div className="flex flex-col gap-3">
      {METHODS.map((method) => (
        <button
          key={method.value}
          type="button"
          onClick={() => setValue("payment_method", method.value)}
          className={cn(
            "flex items-center gap-4 rounded-xl border p-4 text-left transition",
            selected === method.value
              ? "border-primary ring-2 ring-primary/20"
              : "border-bsborder hover:border-primary",
          )}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-primary">
            <method.icon size={20} />
          </span>
          <div>
            <p className="font-medium text-text-primary">{method.label}</p>
            <p className="text-sm text-text-muted">{method.desc}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
