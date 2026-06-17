"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";

import { PriceDisplay } from "@/components/common/PriceDisplay";
import { ROUTES } from "@/constants/routes";
import { useCart } from "@/hooks/useCart";
import type { CartItem as CartItemType } from "@/types/cart";

export function CartItem({
  item,
  compact = false,
}: {
  item: CartItemType;
  compact?: boolean;
}) {
  const { updateItem, removeItem } = useCart();

  return (
    <div className="flex gap-3 py-3">
      <Link
        href={ROUTES.book(item.book.slug)}
        className="relative aspect-[2/3] w-16 flex-shrink-0 overflow-hidden rounded-lg bg-surface-alt"
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
        <Link
          href={ROUTES.book(item.book.slug)}
          className="line-clamp-2 text-sm font-medium text-ink hover:text-primary"
        >
          {item.book.title}
        </Link>
        <p className="text-xs text-ink-secondary">
          {item.book.authors.map((author) => author.name).join(", ")}
        </p>

        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-center rounded-lg border border-border">
            <button
              type="button"
              onClick={() =>
                updateItem({
                  itemId: item.id,
                  quantity: Math.max(1, item.quantity - 1),
                })
              }
              className="px-2 py-1 text-ink-secondary hover:text-primary"
              aria-label="Decrease quantity"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-8 text-center text-sm">{item.quantity}</span>
            <button
              type="button"
              onClick={() =>
                updateItem({ itemId: item.id, quantity: item.quantity + 1 })
              }
              className="px-2 py-1 text-ink-secondary hover:text-primary"
              aria-label="Increase quantity"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {!compact && (
              <PriceDisplay
                price={item.total_price}
                currency={item.book.currency}
                size="sm"
              />
            )}
            <button
              type="button"
              onClick={() => removeItem(item.id)}
              className="text-ink-muted transition hover:text-error"
              aria-label="Remove item"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
