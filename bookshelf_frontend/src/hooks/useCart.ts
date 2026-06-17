"use client";

import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { cartApi } from "@/lib/api/cart";
import { ApiError } from "@/lib/api/client";
import { queryKeys } from "@/constants/queryKeys";
import { useCartStore } from "@/store/cartStore";
import { useUIStore } from "@/store/uiStore";

export function useCart() {
  const setCart = useCartStore((s) => s.setCart);
  const query = useQuery({
    queryKey: queryKeys.cart(),
    queryFn: cartApi.get,
  });

  useEffect(() => {
    if (query.data) setCart(query.data);
  }, [query.data, setCart]);

  return query;
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  const openCartDrawer = useUIStore((s) => s.openCartDrawer);

  return useMutation({
    mutationFn: ({ bookId, quantity }: { bookId: number; quantity?: number }) =>
      cartApi.add(bookId, quantity ?? 1),
    onSuccess: (cart) => {
      queryClient.setQueryData(queryKeys.cart(), cart);
      toast.success("Added to cart");
      openCartDrawer();
    },
    onError: (error: ApiError) => toast.error(error.message),
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: number; quantity: number }) =>
      cartApi.update(itemId, quantity),
    onSuccess: (cart) => queryClient.setQueryData(queryKeys.cart(), cart),
    onError: (error: ApiError) => toast.error(error.message),
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemId: number) => cartApi.remove(itemId),
    onSuccess: (cart) => {
      queryClient.setQueryData(queryKeys.cart(), cart);
      toast.success("Removed from cart");
    },
    onError: (error: ApiError) => toast.error(error.message),
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cartApi.clear,
    onSuccess: (cart) => queryClient.setQueryData(queryKeys.cart(), cart),
  });
}
