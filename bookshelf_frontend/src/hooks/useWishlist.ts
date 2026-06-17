"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

import { apiClient, unwrap } from "@/lib/api/client";
import { queryKeys } from "@/constants/queryKeys";
import type { BookListItem } from "@/types/book";

interface WishlistEntry {
  id: number;
  book: BookListItem;
  created_at: string;
}

const wishlistApi = {
  list: () => unwrap<WishlistEntry[]>(apiClient.get("/wishlist/")),
  add: (bookId: number) =>
    unwrap<WishlistEntry>(apiClient.post("/wishlist/add/", { book_id: bookId })),
  remove: (bookId: number) => apiClient.delete(`/wishlist/remove/${bookId}/`),
};

export function useWishlist() {
  const { status } = useSession();
  return useQuery({
    queryKey: queryKeys.wishlist(),
    queryFn: wishlistApi.list,
    enabled: status === "authenticated",
  });
}

export function useToggleWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ bookId, inList }: { bookId: number; inList: boolean }) => {
      if (inList) await wishlistApi.remove(bookId);
      else await wishlistApi.add(bookId);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist() });
      toast.success(variables.inList ? "Removed from wishlist" : "Added to wishlist");
    },
    onError: () => toast.error("Please sign in to use your wishlist"),
  });
}
