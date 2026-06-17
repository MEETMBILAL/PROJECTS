"use client";

import Link from "next/link";
import { ShoppingBag, X } from "lucide-react";

import { CartItem } from "./CartItem";
import { ROUTES } from "@/constants/routes";
import { useCart } from "@/hooks/useCart";
import { useUIStore } from "@/store/uiStore";
import { cn, formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const open = useUIStore((state) => state.cartDrawerOpen);
  const closeCartDrawer = useUIStore((state) => state.closeCartDrawer);
  const { cart } = useCart();

  const items = cart?.items ?? [];
  const subtotal = parseFloat(cart?.subtotal ?? "0");

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-ink/40 transition-opacity",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={closeCartDrawer}
      />
      <aside
        className={cn(
          "fixed right-0 top-0 z-50 flex h-full w-full max-w-md transform flex-col bg-white shadow-xl transition-transform",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-border p-4">
          <h3 className="font-display text-lg text-ink">
            Your Cart ({cart?.total_items ?? 0})
          </h3>
          <button type="button" onClick={closeCartDrawer} aria-label="Close cart">
            <X className="h-5 w-5 text-ink-secondary" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
            <ShoppingBag className="h-12 w-12 text-ink-muted" />
            <p className="text-ink-secondary">Your cart is empty.</p>
            <Link
              href={ROUTES.books}
              onClick={closeCartDrawer}
              className="btn-primary"
            >
              Browse Books
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 divide-y divide-border overflow-y-auto px-4">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
            <div className="border-t border-border p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-ink-secondary">Subtotal</span>
                <span className="text-lg font-semibold text-primary">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href={ROUTES.cart}
                  onClick={closeCartDrawer}
                  className="btn-outline w-full"
                >
                  View Cart
                </Link>
                <Link
                  href={ROUTES.checkout}
                  onClick={closeCartDrawer}
                  className="btn-primary w-full"
                >
                  Checkout
                </Link>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
