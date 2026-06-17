"use client";

import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { useUIStore } from "@/store/uiStore";

export function CartIcon() {
  const items = useCartStore((s) => s.items);
  const openCartDrawer = useUIStore((s) => s.openCartDrawer);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <button
      type="button"
      onClick={openCartDrawer}
      className="relative grid h-10 w-10 place-items-center rounded-lg text-text-primary transition-colors hover:bg-surface-alt"
      aria-label="Open cart"
    >
      <ShoppingBag className="h-5 w-5" />
      {mounted && count > 0 ? (
        <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-secondary px-1 text-xs font-semibold text-primary-dark">
          {count}
        </span>
      ) : null}
    </button>
  );
}
