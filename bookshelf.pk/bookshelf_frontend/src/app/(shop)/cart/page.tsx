"use client";

import { ShoppingBag } from "lucide-react";

import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ROUTES } from "@/constants/routes";
import { useCart } from "@/hooks/useCart";

export default function CartPage() {
  const { cart, isLoading } = useCart();

  const items = cart?.items ?? [];
  const subtotal = parseFloat(cart?.subtotal ?? "0");

  return (
    <div className="container-bs py-8">
      <Breadcrumb
        items={[{ label: "Home", href: ROUTES.home }, { label: "Cart" }]}
        className="mb-6"
      />
      <h1 className="mb-6 font-display text-4xl text-ink">Your Cart</h1>

      {isLoading ? (
        <LoadingSpinner />
      ) : items.length === 0 ? (
        <EmptyState
          title="Your cart is empty"
          description="Looks like you haven't added any books yet."
          icon={<ShoppingBag className="h-12 w-12" />}
          actionLabel="Browse Books"
          actionHref={ROUTES.books}
        />
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="card divide-y divide-border px-5">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
          <CartSummary subtotal={subtotal} />
        </div>
      )}
    </div>
  );
}
