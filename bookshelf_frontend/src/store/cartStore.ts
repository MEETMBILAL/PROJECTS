import { create } from "zustand";

import type { Cart } from "@/types/cart";

interface CartState {
  cart: Cart | null;
  setCart: (cart: Cart | null) => void;
}

export const useCartStore = create<CartState>((set) => ({
  cart: null,
  setCart: (cart) => set({ cart }),
}));

export const selectTotalItems = (state: CartState): number =>
  state.cart?.total_items ?? 0;
