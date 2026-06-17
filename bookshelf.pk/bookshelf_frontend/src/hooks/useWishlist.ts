"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

import { wishlistApi } from "@/lib/api/wishlist";
import { queryKeys } from "@/constants/queryKeys";
import { useWishlistStore } from "@/store/wishlistStore";

export function useWishlist() {
  const queryClient = useQueryClient();
  const { status } = useSession();
  const setBookIds = useWishlistStore((state) => state.setBookIds);

  const wishlistQuery = useQuery({
    queryKey: queryKeys.wishlist(),
    queryFn: wishlistApi.list,
    enabled: status === "authenticated",
  });

  useEffect(() => {
    if (wishlistQuery.data) {
      setBookIds(wishlistQuery.data.map((item) => item.book.id));
    }
  }, [wishlistQuery.data, setBookIds]);

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.wishlist() });

  const addMutation = useMutation({
    mutationFn: (bookId: number) => wishlistApi.add(bookId),
    onSuccess: () => {
      invalidate();
      toast.success("Saved to wishlist");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const removeMutation = useMutation({
    mutationFn: (bookId: number) => wishlistApi.remove(bookId),
    onSuccess: () => {
      invalidate();
      toast.success("Removed from wishlist");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const toggle = (bookId: number, isSaved: boolean) => {
    if (status !== "authenticated") {
      toast.error("Please log in to use your wishlist");
      return;
    }
    if (isSaved) {
      removeMutation.mutate(bookId);
    } else {
      addMutation.mutate(bookId);
    }
  };

  return {
    items: wishlistQuery.data ?? [],
    isLoading: wishlistQuery.isLoading,
    toggle,
    add: addMutation.mutate,
    remove: removeMutation.mutate,
  };
}
