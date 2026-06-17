"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useUIStore } from "@/store/uiStore";
import { useCart } from "@/hooks/useCart";
import { cn, formatPrice } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";

export function CartDrawer() {
  const open = useUIStore((s) => s.cartDrawerOpen);
  const close = useUIStore((s) => s.closeCartDrawer);
  const { items, updateQuantity, removeItem, subtotal } = useCart();

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-50 bg-text-primary/40 transition-opacity",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={close}
      />
      <aside
        className={cn(
          "fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-surface shadow-2xl transition-transform",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-bordercolor p-4">
          <h2 className="flex items-center gap-2 font-display text-xl text-text-primary">
            <ShoppingBag className="h-5 w-5 text-primary" />
            Your Cart
          </h2>
          <button
            type="button"
            onClick={close}
            className="grid h-9 w-9 place-items-center rounded-lg hover:bg-surface-alt"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
            <ShoppingBag className="h-12 w-12 text-text-muted" />
            <p className="text-text-secondary">Your cart is empty.</p>
            <Link href={ROUTES.books} onClick={close} className="btn-primary">
              Browse Books
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              {items.map((item) => (
                <div key={item.book.id} className="flex gap-3">
                  <div className="relative h-24 w-16 shrink-0 overflow-hidden rounded-lg bg-surface-alt">
                    <Image
                      src={item.book.cover_image}
                      alt={item.book.title}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <Link
                      href={ROUTES.book(item.book.slug)}
                      onClick={close}
                      className="line-clamp-2 text-sm font-medium text-text-primary hover:text-primary"
                    >
                      {item.book.title}
                    </Link>
                    <span className="mt-0.5 text-sm text-primary">
                      {formatPrice(item.book.effective_price)}
                    </span>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center rounded-lg border border-bordercolor">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.book.id, item.quantity - 1)
                          }
                          className="grid h-7 w-7 place-items-center text-text-secondary hover:text-primary"
                          aria-label="Decrease"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.book.id, item.quantity + 1)
                          }
                          className="grid h-7 w-7 place-items-center text-text-secondary hover:text-primary"
                          aria-label="Increase"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.book.id)}
                        className="text-text-muted hover:text-error"
                        aria-label="Remove"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-bordercolor p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-text-secondary">Subtotal</span>
                <span className="font-semibold text-primary">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <Link
                href={ROUTES.checkout}
                onClick={close}
                className="btn-primary w-full"
              >
                Checkout
              </Link>
              <Link
                href={ROUTES.cart}
                onClick={close}
                className="btn-ghost mt-2 w-full"
              >
                View Cart
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
