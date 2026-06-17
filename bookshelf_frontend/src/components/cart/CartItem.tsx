"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";

import { ROUTES } from "@/constants/routes";
import { formatPrice } from "@/lib/utils";
import type { LocalCartItem } from "@/store/cartStore";
import { useCartStore } from "@/store/cartStore";

const PLACEHOLDER = "/images/placeholder-book.svg";

export function CartItem({ item, compact = false }: { item: LocalCartItem; compact?: boolean }) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const { book, quantity } = item;
  const lineTotal = parseFloat(book.effective_price) * quantity;

  return (
    <div className="flex gap-3">
      <Link
        href={ROUTES.book(book.slug)}
        className="relative h-24 w-16 shrink-0 overflow-hidden rounded-lg bg-surface-alt"
      >
        <Image
          src={book.cover_image || PLACEHOLDER}
          alt={book.title}
          fill
          sizes="64px"
          className="object-cover"
        />
      </Link>
      <div className="flex flex-1 flex-col">
        <Link href={ROUTES.book(book.slug)}>
          <h4 className="line-clamp-2 text-sm font-medium text-text-primary hover:text-primary">
            {book.title}
          </h4>
        </Link>
        <p className="text-xs text-text-muted">
          {book.authors.map((a) => a.name).join(", ")}
        </p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-center rounded-lg border border-bsborder">
            <button
              type="button"
              onClick={() => updateQuantity(book.id, quantity - 1)}
              className="px-2 py-1 text-text-secondary hover:text-primary"
              aria-label="Decrease"
            >
              <Minus size={14} />
            </button>
            <span className="w-8 text-center text-sm">{quantity}</span>
            <button
              type="button"
              onClick={() => updateQuantity(book.id, quantity + 1)}
              className="px-2 py-1 text-text-secondary hover:text-primary"
              aria-label="Increase"
            >
              <Plus size={14} />
            </button>
          </div>
          {!compact && (
            <span className="text-sm font-semibold text-primary">
              {formatPrice(lineTotal, book.currency)}
            </span>
          )}
          <button
            type="button"
            onClick={() => removeItem(book.id)}
            className="text-text-muted hover:text-error"
            aria-label="Remove item"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
