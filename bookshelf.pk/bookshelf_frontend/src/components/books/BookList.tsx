"use client";

import Image from "next/image";
import Link from "next/link";

import { PriceDisplay } from "@/components/common/PriceDisplay";
import { StarRating } from "@/components/common/StarRating";
import { ROUTES } from "@/constants/routes";
import { useCart } from "@/hooks/useCart";
import { truncate } from "@/lib/utils";
import type { Book } from "@/types/book";

export function BookList({ books }: { books: Book[] }) {
  const { addItem, isAdding } = useCart();

  return (
    <div className="flex flex-col gap-4">
      {books.map((book) => (
        <div key={book.id} className="card flex gap-4 p-4">
          <Link
            href={ROUTES.book(book.slug)}
            className="relative aspect-[2/3] w-24 flex-shrink-0 overflow-hidden rounded-lg bg-surface-alt"
          >
            <Image
              src={book.cover_image}
              alt={book.title}
              fill
              sizes="96px"
              className="object-cover"
            />
          </Link>
          <div className="flex flex-1 flex-col">
            {book.category_name && (
              <span className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                {book.category_name}
              </span>
            )}
            <Link href={ROUTES.book(book.slug)}>
              <h3 className="font-display text-lg text-ink hover:text-primary">
                {book.title}
              </h3>
            </Link>
            <p className="text-sm text-ink-secondary">
              {book.authors.map((author) => author.name).join(", ")}
            </p>
            {book.short_description && (
              <p className="mt-1 hidden text-sm text-ink-secondary sm:block">
                {truncate(book.short_description, 140)}
              </p>
            )}
            <div className="mt-auto flex items-center justify-between pt-3">
              <div className="flex items-center gap-3">
                <PriceDisplay
                  price={book.effective_price}
                  originalPrice={book.is_on_sale ? book.original_price : null}
                  currency={book.currency}
                />
                <StarRating rating={book.average_rating} size={14} />
              </div>
              <button
                type="button"
                onClick={() => addItem({ bookId: book.id })}
                disabled={!book.in_stock || isAdding}
                className="btn-primary px-4 py-2"
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
