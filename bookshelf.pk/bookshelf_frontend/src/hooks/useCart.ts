"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import toast from "react-hot-toast";

import { cartApi } from "@/lib/api/cart";
import { queryKeys } from "@/constants/queryKeys";
import { useCartStore } from "@/store/cartStore";
import { useUIStore } from "@/store/uiStore";

export function useCart() {
  const queryClient = useQueryClient();
  const setCart = useCartStore((state) => state.setCart);
  const openCartDrawer = useUIStore((state) => state.openCartDrawer);

  const cartQuery = useQuery({
    queryKey: queryKeys.cart(),
    queryFn: cartApi.get,
  });

  useEffect(() => {
    if (cartQuery.data) setCart(cartQuery.data);
  }, [cartQuery.data, setCart]);

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.cart() });

  const addMutation = useMutation({
    mutationFn: ({ bookId, quantity }: { bookId: number; quantity?: number }) =>
      cartApi.add(bookId, quantity ?? 1),
    onSuccess: (cart) => {
      setCart(cart);
      invalidate();
      toast.success("Added to cart");
      openCartDrawer();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: number; quantity: number }) =>
      cartApi.update(itemId, quantity),
    onSuccess: (cart) => {
      setCart(cart);
      invalidate();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const removeMutation = useMutation({
    mutationFn: (itemId: number) => cartApi.remove(itemId),
    onSuccess: (cart) => {
      setCart(cart);
      invalidate();
      toast.success("Removed from cart");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const clearMutation = useMutation({
    mutationFn: () => cartApi.clear(),
    onSuccess: (cart) => {
      setCart(cart);
      invalidate();
    },
  });

  return {
    cart: cartQuery.data,
    isLoading: cartQuery.isLoading,
    addItem: addMutation.mutate,
    isAdding: addMutation.isPending,
    updateItem: updateMutation.mutate,
    removeItem: removeMutation.mutate,
    clearCart: clearMutation.mutate,
  };
}
