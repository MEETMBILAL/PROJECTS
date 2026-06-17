"use client";

import Link from "next/link";
import { ShoppingBag, X } from "lucide-react";

import { CartItem } from "./CartItem";
import { ROUTES } from "@/constants/routes";
import { useCartStore } from "@/store/cartStore";
import { useUIStore } from "@/store/uiStore";
import { cn, formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const open = useUIStore((state) => state.cartDrawerOpen);
  const close = useUIStore((state) => state.closeCartDrawer);
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.subtotal());

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
          "fixed right-0 top-0 z-50 flex h-full w-full max-w-md transform flex-col bg-surface shadow-card-hover transition-transform",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-bsborder p-4">
          <h3 className="font-display text-lg text-primary">Your Cart ({items.length})</h3>
          <button type="button" onClick={close} aria-label="Close cart">
            <X size={22} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
            <ShoppingBag size={48} className="text-text-muted" />
            <p className="text-text-secondary">Your cart is empty.</p>
            <Link href={ROUTES.books} onClick={close} className="btn-primary">
              Start Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              {items.map((item) => (
                <CartItem key={item.book.id} item={item} />
              ))}
            </div>
            <div className="border-t border-bsborder p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-text-secondary">Subtotal</span>
                <span className="text-lg font-semibold text-primary">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <div className="flex gap-2">
                <Link href={ROUTES.cart} onClick={close} className="btn-outline flex-1">
                  View Cart
                </Link>
                <Link href={ROUTES.checkout} onClick={close} className="btn-primary flex-1">
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
