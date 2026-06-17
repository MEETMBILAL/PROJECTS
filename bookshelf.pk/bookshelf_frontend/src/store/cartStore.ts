import { create } from "zustand";

import type { Cart } from "@/types/cart";

interface CartState {
  cart: Cart | null;
  setCart: (cart: Cart | null) => void;
  itemCount: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: null,
  setCart: (cart) => set({ cart }),
  itemCount: () => get().cart?.total_items ?? 0,
  subtotal: () => parseFloat(get().cart?.subtotal ?? "0"),
}));
