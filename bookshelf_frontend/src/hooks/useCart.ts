"use client";

import { useCallback } from "react";
import toast from "react-hot-toast";

import { useCartStore } from "@/store/cartStore";
import { useUIStore } from "@/store/uiStore";
import type { Book } from "@/types";

export function useCart() {
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clear = useCartStore((state) => state.clear);
  const subtotal = useCartStore((state) => state.subtotal);
  const itemCount = useCartStore((state) => state.itemCount);
  const openCartDrawer = useUIStore((state) => state.openCartDrawer);

  const addToCart = useCallback(
    (book: Book, quantity = 1) => {
      addItem(book, quantity);
      toast.success(`${book.title} added to cart`);
      openCartDrawer();
    },
    [addItem, openCartDrawer],
  );

  return {
    items,
    addToCart,
    removeItem,
    updateQuantity,
    clear,
    subtotal: subtotal(),
    itemCount: itemCount(),
  };
}
