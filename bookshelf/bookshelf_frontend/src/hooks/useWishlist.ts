"use client";

import toast from "react-hot-toast";
import { useWishlistStore } from "@/store/wishlistStore";
import type { Book } from "@/types/book";

export function useWishlist() {
  const store = useWishlistStore();

  const toggle = (book: Book) => {
    const wasIn = store.has(book.id);
    store.toggle(book);
    toast.success(
      wasIn ? "Removed from wishlist" : "Added to wishlist",
    );
  };

  return {
    items: store.items,
    toggle,
    remove: store.remove,
    has: store.has,
  };
}
