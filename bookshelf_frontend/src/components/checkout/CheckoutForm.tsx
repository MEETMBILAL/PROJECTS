"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Banknote, CreditCard, Smartphone } from "lucide-react";
import toast from "react-hot-toast";

import { PriceDisplay } from "@/components/common/PriceDisplay";
import { PROVINCES } from "@/constants/config";
import { ROUTES } from "@/constants/routes";
import { ordersApi } from "@/lib/api/orders";
import { ApiError } from "@/lib/api/client";
import { checkoutSchema, type CheckoutInput } from "@/lib/validations";
import { cn, formatPrice } from "@/lib/utils";
import type { Cart } from "@/types/cart";
import type { PaymentMethod } from "@/types/order";

const PAYMENT_METHODS: { value: PaymentMethod; label: string; icon: typeof Banknote }[] = [
  { value: "cod", label: "Cash on Delivery", icon: Banknote },
  { value: "jazzcash", label: "JazzCash", icon: Smartphone },
  { value: "stripe", label: "Credit / Debit Card", icon: CreditCard },
];

export function CheckoutForm({ cart }: { cart: Cart }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { payment_method: "cod", country: "Pakistan" },
  });

  const paymentMethod = watch("payment_method");

  const onSubmit = async (values: CheckoutInput) => {
    setSubmitting(true);
    try {
      const order = await ordersApi.create({
        shipping_address: {
          recipient_name: values.recipient_name,
          phone: values.phone,
          email: values.email,
          street: values.street,
          city: values.city,
          province: values.province,
          postal_code: values.postal_code,
          country: values.country,
        },
        payment_method: values.payment_method,
        notes: values.notes,
      });
      toast.success("Order placed successfully!");
      router.push(ROUTES.order(order.order_number));
    } catch (error) {
      toast.error((error as ApiError).message);
    } finally {
      setSubmitting(false);
    }
  };

  const subtotal = parseFloat(cart.subtotal);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-8">
        <section className="card p-6">
          <h2 className="font-display text-xl font-semibold">Shipping Address</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Full Name" error={errors.recipient_name?.message}>
              <input className="input" {...register("recipient_name")} />
            </Field>
            <Field label="Phone" error={errors.phone?.message}>
              <input className="input" placeholder="03XX-XXXXXXX" {...register("phone")} />
            </Field>
            <Field label="Email" error={errors.email?.message} full>
              <input className="input" type="email" {...register("email")} />
            </Field>
            <Field label="Street Address" error={errors.street?.message} full>
              <textarea className="input" rows={2} {...register("street")} />
            </Field>
            <Field label="City" error={errors.city?.message}>
              <input className="input" {...register("city")} />
            </Field>
            <Field label="Province" error={errors.province?.message}>
              <select className="input" {...register("province")}>
                <option value="">Select province</option>
                {PROVINCES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Postal Code (optional)" error={errors.postal_code?.message}>
              <input className="input" {...register("postal_code")} />
            </Field>
            <Field label="Country" error={errors.country?.message}>
              <input className="input" {...register("country")} defaultValue="Pakistan" />
            </Field>
          </div>
        </section>

        <section className="card p-6">
          <h2 className="font-display text-xl font-semibold">Payment Method</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {PAYMENT_METHODS.map((method) => (
              <button
                key={method.value}
                type="button"
                onClick={() => setValue("payment_method", method.value)}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-sm font-medium transition-colors",
                  paymentMethod === method.value
                    ? "border-primary bg-accent text-primary"
                    : "border-bsborder text-text-secondary hover:border-primary/40",
                )}
              >
                <method.icon size={22} />
                {method.label}
              </button>
            ))}
          </div>
        </section>

        <section className="card p-6">
          <h2 className="font-display text-xl font-semibold">Order Notes (optional)</h2>
          <textarea
            className="input mt-4"
            rows={3}
            placeholder="Any special instructions for your order?"
            {...register("notes")}
          />
        </section>
      </div>

      <div className="card sticky top-24 h-fit p-6">
        <h2 className="font-display text-lg font-semibold">Order Review</h2>
        <div className="mt-4 max-h-64 space-y-3 overflow-y-auto">
          {cart.items.map((item) => (
            <div key={item.id} className="flex justify-between gap-2 text-sm">
              <span className="line-clamp-1 text-text-secondary">
                {item.quantity} × {item.book.title}
              </span>
              <span className="shrink-0">{formatPrice(item.total_price)}</span>
            </div>
          ))}
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-bsborder pt-4">
          <span className="font-semibold">Subtotal</span>
          <PriceDisplay price={subtotal} />
        </div>
        <button type="submit" disabled={submitting} className="btn-primary mt-5 w-full">
          {submitting ? "Placing order…" : "Place Order"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  children,
  full,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div className={full ? "sm:col-span-2" : undefined}>
      <label className="label">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-error">{error}</p>}
    </div>
  );
}
