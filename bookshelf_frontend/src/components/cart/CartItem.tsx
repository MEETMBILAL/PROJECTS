"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";

import { ROUTES } from "@/constants/routes";
import { useRemoveCartItem, useUpdateCartItem } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import type { CartItem as CartItemType } from "@/types/cart";

export function CartItem({ item, compact = false }: { item: CartItemType; compact?: boolean }) {
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();

  const setQty = (qty: number) => {
    if (qty < 1) return;
    updateItem.mutate({ itemId: item.id, quantity: qty });
  };

  return (
    <div className="flex gap-3 py-4">
      <Link
        href={ROUTES.book(item.book.slug)}
        className="relative h-24 w-16 shrink-0 overflow-hidden rounded-lg bg-surface-alt"
      >
        <Image
          src={item.book.cover_image}
          alt={item.book.title}
          fill
          sizes="64px"
          className="object-cover"
        />
      </Link>
      <div className="flex flex-1 flex-col">
        <Link href={ROUTES.book(item.book.slug)}>
          <h4 className="line-clamp-2 text-sm font-medium text-text-primary hover:text-primary">
            {item.book.title}
          </h4>
        </Link>
        <p className="mt-0.5 text-xs text-text-muted">
          {formatPrice(item.unit_price, item.book.currency)} each
        </p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-center rounded-lg border border-bsborder">
            <button
              type="button"
              onClick={() => setQty(item.quantity - 1)}
              className="grid h-7 w-7 place-items-center text-text-secondary hover:text-primary"
              aria-label="Decrease quantity"
            >
              <Minus size={14} />
            </button>
            <span className="w-8 text-center text-sm">{item.quantity}</span>
            <button
              type="button"
              onClick={() => setQty(item.quantity + 1)}
              className="grid h-7 w-7 place-items-center text-text-secondary hover:text-primary"
              aria-label="Increase quantity"
            >
              <Plus size={14} />
            </button>
          </div>
          {!compact && (
            <span className="text-sm font-semibold text-primary">
              {formatPrice(item.total_price, item.book.currency)}
            </span>
          )}
          <button
            type="button"
            onClick={() => removeItem.mutate(item.id)}
            className="text-text-muted transition-colors hover:text-error"
            aria-label="Remove item"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
