"use client";

import Image from "next/image";
import Link from "next/link";

import { PriceDisplay } from "@/components/common/PriceDisplay";
import { StarRating } from "@/components/common/StarRating";
import { ROUTES } from "@/constants/routes";
import { useCart } from "@/hooks/useCart";
import { truncate } from "@/lib/utils";
import type { Book } from "@/types";

const PLACEHOLDER = "/images/placeholder-book.png";

export function BookList({ books }: { books: Book[] }) {
  const { addToCart } = useCart();

  return (
    <div className="flex flex-col gap-4">
      {books.map((book) => (
        <div key={book.id} className="card-bs flex gap-4 p-4">
          <Link
            href={ROUTES.book(book.slug)}
            className="relative h-40 w-28 shrink-0 overflow-hidden rounded-lg bg-surface-alt"
          >
            <Image
              src={book.cover_image || PLACEHOLDER}
              alt={book.title}
              fill
              sizes="112px"
              className="object-cover"
            />
          </Link>
          <div className="flex flex-1 flex-col">
            <Link href={ROUTES.book(book.slug)}>
              <h3 className="font-display text-lg text-text-primary hover:text-primary">
                {book.title}
              </h3>
            </Link>
            <p className="text-sm text-text-secondary">
              {book.authors.map((a) => a.name).join(", ")}
            </p>
            {book.review_count > 0 && (
              <StarRating
                rating={book.average_rating}
                count={book.review_count}
                size={14}
                className="mt-1"
              />
            )}
            {book.short_description && (
              <p className="mt-2 text-sm text-text-secondary">
                {truncate(book.short_description, 160)}
              </p>
            )}
            <div className="mt-auto flex items-center justify-between pt-3">
              <PriceDisplay
                price={book.effective_price}
                originalPrice={book.sale_price ? book.original_price : null}
                currency={book.currency}
              />
              <button
                type="button"
                onClick={() => addToCart(book)}
                disabled={!book.in_stock}
                className="btn-primary px-4 py-2 text-sm disabled:opacity-40"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
