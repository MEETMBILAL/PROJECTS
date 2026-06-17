"use client";

import { ShoppingCart } from "lucide-react";

import { useCartStore } from "@/store/cartStore";
import { useUIStore } from "@/store/uiStore";

export function CartIcon() {
  const count = useCartStore((state) => state.cart?.total_items ?? 0);
  const openCartDrawer = useUIStore((state) => state.openCartDrawer);

  return (
    <button
      type="button"
      onClick={openCartDrawer}
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-ink transition hover:bg-surface-alt"
      aria-label="Open cart"
    >
      <ShoppingCart className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-secondary px-1 text-xs font-bold text-white">
          {count}
        </span>
      )}
    </button>
  );
}
