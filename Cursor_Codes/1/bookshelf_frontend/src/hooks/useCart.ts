"use client";

import toast from "react-hot-toast";
import { useCartStore } from "@/store/cartStore";
import { useUIStore } from "@/store/uiStore";
import type { Book } from "@/types/book";

/**
 * Thin convenience wrapper around the persisted cart store that also handles
 * user feedback (toasts) and opening the cart drawer on add.
 */
export function useCart() {
  const store = useCartStore();
  const openCartDrawer = useUIStore((s) => s.openCartDrawer);

  const addToCart = (book: Book, quantity = 1) => {
    store.addItem(book, quantity);
    toast.success(`Added “${book.title}” to cart`);
    openCartDrawer();
  };

  return {
    items: store.items,
    addToCart,
    removeItem: store.removeItem,
    updateQuantity: store.updateQuantity,
    clear: store.clear,
    totalItems: store.totalItems(),
    subtotal: store.subtotal(),
  };
}
