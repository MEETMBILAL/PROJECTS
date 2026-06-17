"use client";

import Link from "next/link";
import { ShoppingBag, X } from "lucide-react";

import { ROUTES } from "@/constants/routes";
import { useCart } from "@/hooks/useCart";
import { useUIStore } from "@/store/uiStore";
import { cn, formatPrice } from "@/lib/utils";
import { CartItem } from "./CartItem";

export function CartDrawer() {
  const open = useUIStore((s) => s.cartDrawerOpen);
  const close = useUIStore((s) => s.closeCartDrawer);
  const { data: cart } = useCart();

  const items = cart?.items ?? [];

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/40 transition-opacity",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={close}
      />
      <aside
        className={cn(
          "fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-surface shadow-xl transition-transform",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-bsborder p-5">
          <h2 className="font-display text-xl font-semibold">
            Your Cart {cart ? `(${cart.total_items})` : ""}
          </h2>
          <button type="button" onClick={close} aria-label="Close cart">
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <ShoppingBag size={48} className="text-text-muted" strokeWidth={1.5} />
              <p className="mt-4 font-display text-lg">Your cart is empty</p>
              <p className="mt-1 text-sm text-text-secondary">
                Discover your next great read.
              </p>
              <Link href={ROUTES.books} onClick={close} className="btn-primary mt-5">
                Browse Books
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-bsborder">
              {items.map((item) => (
                <CartItem key={item.id} item={item} compact />
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && cart && (
          <div className="border-t border-bsborder p-5">
            <div className="mb-4 flex items-center justify-between text-base font-semibold">
              <span>Subtotal</span>
              <span className="text-primary">{formatPrice(cart.subtotal)}</span>
            </div>
            <div className="flex gap-3">
              <Link
                href={ROUTES.cart}
                onClick={close}
                className="btn-outline flex-1"
              >
                View Cart
              </Link>
              <Link
                href={ROUTES.checkout}
                onClick={close}
                className="btn-primary flex-1"
              >
                Checkout
              </Link>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
