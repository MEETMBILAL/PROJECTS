"use client";

import { ShoppingCart } from "lucide-react";

import { useCartStore } from "@/store/cartStore";
import { useUIStore } from "@/store/uiStore";

export function CartIcon() {
  const itemCount = useCartStore((state) => state.itemCount());
  const openCartDrawer = useUIStore((state) => state.openCartDrawer);

  return (
    <button
      type="button"
      onClick={openCartDrawer}
      className="relative flex h-10 w-10 items-center justify-center rounded-xl text-text-primary hover:text-primary"
      aria-label="Open cart"
    >
      <ShoppingCart size={22} />
      {itemCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-secondary px-1 text-xs font-medium text-surface">
          {itemCount}
        </span>
      )}
    </button>
  );
}
