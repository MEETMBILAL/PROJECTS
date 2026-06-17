"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { CreditCard, Banknote, Wallet } from "lucide-react";
import { checkoutSchema, type CheckoutInput } from "@/lib/validations";
import { PROVINCES } from "@/constants/config";
import { ROUTES } from "@/constants/routes";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { cartApi } from "@/lib/api/cart";
import { ordersApi } from "@/lib/api/orders";
import { CartSummary } from "@/components/cart/CartSummary";
import { EmptyState } from "@/components/common/EmptyState";

const PAYMENT_METHODS = [
  { value: "cod", label: "Cash on Delivery", icon: Banknote },
  { value: "jazzcash", label: "JazzCash", icon: Wallet },
  { value: "stripe", label: "Credit / Debit Card", icon: CreditCard },
] as const;

export function CheckoutForm() {
  const router = useRouter();
  const { items, subtotal, clear } = useCart();
  const { isAuthenticated } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { country: "Pakistan", payment_method: "cod" },
  });

  const paymentMethod = watch("payment_method");

  const onSubmit = async (data: CheckoutInput) => {
    if (!isAuthenticated) {
      toast.error("Please log in to place your order.");
      router.push(`${ROUTES.login}?redirect=${ROUTES.checkout}`);
      return;
    }
    try {
      // Sync the local cart to the server cart, then create the order.
      await cartApi.clear().catch(() => undefined);
      for (const item of items) {
        await cartApi.add(item.book.id, item.quantity);
      }
      const order = await ordersApi.create(data);
      clear();
      toast.success(`Order ${order.order_number} placed!`);
      router.push(ROUTES.order(order.order_number));
    } catch (err) {
      toast.error((err as Error).message || "Could not place order.");
    }
  };

  if (items.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        description="Add some books before checking out."
        actionLabel="Browse Books"
        actionHref={ROUTES.books}
      />
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-8 lg:grid-cols-[1fr_360px]"
    >
      <div className="space-y-8">
        <section className="card p-6">
          <h2 className="mb-4 font-display text-xl text-text-primary">
            Shipping Address
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full Name" error={errors.recipient_name?.message}>
              <input {...register("recipient_name")} className="input" />
            </Field>
            <Field label="Phone" error={errors.phone?.message}>
              <input {...register("phone")} className="input" />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Street Address" error={errors.street?.message}>
                <input {...register("street")} className="input" />
              </Field>
            </div>
            <Field label="City" error={errors.city?.message}>
              <input {...register("city")} className="input" />
            </Field>
            <Field label="Province" error={errors.province?.message}>
              <select {...register("province")} className="input">
                <option value="">Select province</option>
                {PROVINCES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Postal Code">
              <input {...register("postal_code")} className="input" />
            </Field>
            <Field label="Country">
              <input {...register("country")} className="input" readOnly />
            </Field>
          </div>
        </section>

        <section className="card p-6">
          <h2 className="mb-4 font-display text-xl text-text-primary">
            Payment Method
          </h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {PAYMENT_METHODS.map((m) => {
              const active = paymentMethod === m.value;
              return (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setValue("payment_method", m.value)}
                  className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-sm transition-colors ${
                    active
                      ? "border-primary bg-accent text-primary"
                      : "border-bordercolor text-text-secondary hover:border-primary"
                  }`}
                >
                  <m.icon className="h-6 w-6" />
                  {m.label}
                </button>
              );
            })}
          </div>
        </section>

        <section className="card p-6">
          <h2 className="mb-4 font-display text-xl text-text-primary">
            Order Notes
          </h2>
          <textarea
            {...register("notes")}
            rows={3}
            placeholder="Any special instructions for your order…"
            className="input resize-none"
          />
        </section>
      </div>

      <div className="space-y-4">
        <CartSummary subtotal={subtotal} />
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full"
        >
          {isSubmitting ? "Placing order…" : "Place Order"}
        </button>
        <p className="text-center text-xs text-text-muted">
          By placing your order you agree to our terms & conditions.
        </p>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-text-secondary">{label}</span>
      {children}
      {error ? <span className="mt-1 block text-xs text-error">{error}</span> : null}
    </label>
  );
}
