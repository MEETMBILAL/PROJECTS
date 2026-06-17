"use client";

import { ShoppingBag } from "lucide-react";

import { useCart } from "@/hooks/useCart";
import { useUIStore } from "@/store/uiStore";

export function CartIcon() {
  const { data: cart } = useCart();
  const openCartDrawer = useUIStore((s) => s.openCartDrawer);
  const count = cart?.total_items ?? 0;

  return (
    <button
      type="button"
      onClick={openCartDrawer}
      className="relative grid h-10 w-10 place-items-center rounded-full text-text-primary transition-colors hover:bg-surface-alt"
      aria-label="Open cart"
    >
      <ShoppingBag size={20} />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-secondary px-1 text-xs font-bold text-primary-dark">
          {count}
        </span>
      )}
    </button>
  );
}
