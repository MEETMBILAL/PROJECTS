"use client";

import { useCallback } from "react";
import toast from "react-hot-toast";

import { useWishlistStore } from "@/store/wishlistStore";
import type { Book } from "@/types";

export function useWishlist() {
  const items = useWishlistStore((state) => state.items);
  const toggle = useWishlistStore((state) => state.toggle);
  const has = useWishlistStore((state) => state.has);
  const remove = useWishlistStore((state) => state.remove);

  const toggleWishlist = useCallback(
    (book: Book) => {
      const wasAdded = !has(book.id);
      toggle(book);
      toast.success(wasAdded ? "Added to wishlist" : "Removed from wishlist");
    },
    [has, toggle],
  );

  return { items, toggleWishlist, has, remove };
}
