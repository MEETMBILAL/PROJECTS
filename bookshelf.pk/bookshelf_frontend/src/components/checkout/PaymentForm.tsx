"use client";

import { Banknote, CreditCard, Wallet } from "lucide-react";

import { cn } from "@/lib/utils";
import type { PaymentMethod } from "@/types/order";

const methods: {
  value: PaymentMethod;
  label: string;
  description: string;
  icon: typeof Banknote;
}[] = [
  {
    value: "cod",
    label: "Cash on Delivery",
    description: "Pay in cash when your order arrives",
    icon: Banknote,
  },
  {
    value: "jazzcash",
    label: "JazzCash",
    description: "Pay securely with your JazzCash wallet",
    icon: Wallet,
  },
  {
    value: "stripe",
    label: "Credit / Debit Card",
    description: "Visa, Mastercard via Stripe",
    icon: CreditCard,
  },
];

interface PaymentFormProps {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

export function PaymentForm({ value, onChange }: PaymentFormProps) {
  return (
    <div className="flex flex-col gap-3">
      {methods.map((method) => (
        <button
          key={method.value}
          type="button"
          onClick={() => onChange(method.value)}
          className={cn(
            "flex items-center gap-4 rounded-xl border p-4 text-left transition",
            value === method.value
              ? "border-primary bg-accent"
              : "border-border bg-white hover:border-primary",
          )}
        >
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-primary shadow-sm">
            <method.icon className="h-5 w-5" />
          </span>
          <div className="flex-1">
            <p className="font-medium text-ink">{method.label}</p>
            <p className="text-sm text-ink-secondary">{method.description}</p>
          </div>
          <span
            className={cn(
              "h-5 w-5 rounded-full border-2",
              value === method.value
                ? "border-primary bg-primary"
                : "border-border",
            )}
          />
        </button>
      ))}
    </div>
  );
}
