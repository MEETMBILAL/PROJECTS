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
  const { data: cart, isLoading } = useCart();

  return (
    <div className="container-bs py-8">
      <Breadcrumb items={[{ label: "Cart" }]} />
      <h1 className="mt-4 font-display text-3xl font-bold text-text-primary">
        Shopping Cart
      </h1>

      {isLoading ? (
        <LoadingSpinner className="min-h-[40vh]" />
      ) : !cart || cart.items.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="Your cart is empty"
            description="Looks like you haven't added any books yet."
            icon={<ShoppingBag size={48} strokeWidth={1.5} />}
            actionLabel="Browse Books"
            actionHref={ROUTES.books}
          />
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="card divide-y divide-bsborder px-5">
            {cart.items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
          <CartSummary cart={cart} />
        </div>
      )}
    </div>
  );
}
