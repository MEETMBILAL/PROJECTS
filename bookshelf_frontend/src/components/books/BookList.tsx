"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import { PriceDisplay } from "@/components/common/PriceDisplay";
import { StarRating } from "@/components/common/StarRating";
import { ROUTES } from "@/constants/routes";
import { useAddToCart } from "@/hooks/useCart";
import { truncate } from "@/lib/utils";
import type { BookListItem } from "@/types/book";

export function BookList({ books }: { books: BookListItem[] }) {
  const addToCart = useAddToCart();

  return (
    <div className="flex flex-col gap-4">
      {books.map((book) => (
        <div
          key={book.id}
          className="flex gap-4 rounded-xl border border-bsborder bg-white p-4 shadow-card"
        >
          <Link
            href={ROUTES.book(book.slug)}
            className="relative h-40 w-28 shrink-0 overflow-hidden rounded-lg bg-surface-alt"
          >
            <Image
              src={book.cover_image}
              alt={book.title}
              fill
              sizes="112px"
              className="object-cover"
            />
          </Link>
          <div className="flex flex-1 flex-col">
            <p className="text-xs text-text-muted">
              {book.authors.map((a) => a.name).join(", ")}
            </p>
            <Link href={ROUTES.book(book.slug)}>
              <h3 className="font-display text-lg font-semibold text-text-primary hover:text-primary">
                {book.title}
              </h3>
            </Link>
            <StarRating rating={book.average_rating} size={14} className="my-1.5" />
            <p className="hidden text-sm text-text-secondary sm:block">
              {truncate(book.short_description, 160)}
            </p>
            <div className="mt-auto flex items-center justify-between pt-3">
              <PriceDisplay
                price={book.effective_price}
                originalPrice={book.is_on_sale ? book.original_price : null}
                currency={book.currency}
              />
              <button
                type="button"
                disabled={!book.in_stock}
                onClick={() => addToCart.mutate({ bookId: book.id })}
                className="btn-primary"
              >
                <ShoppingCart size={16} />
                Add
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
