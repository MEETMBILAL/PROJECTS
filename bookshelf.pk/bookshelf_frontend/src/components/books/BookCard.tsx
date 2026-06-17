"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";

import { Badge } from "@/components/common/Badge";
import { PriceDisplay } from "@/components/common/PriceDisplay";
import { StarRating } from "@/components/common/StarRating";
import { ROUTES } from "@/constants/routes";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useWishlistStore } from "@/store/wishlistStore";
import { cn } from "@/lib/utils";
import type { Book } from "@/types/book";

export function BookCard({ book }: { book: Book }) {
  const { addItem, isAdding } = useCart();
  const { toggle } = useWishlist();
  const isSaved = useWishlistStore((state) => state.bookIds.has(book.id));

  return (
    <div className="group card overflow-hidden transition-transform duration-200 hover:scale-[1.02] hover:shadow-card">
      <div className="relative">
        <Link href={ROUTES.book(book.slug)} className="block">
          <div className="relative aspect-[2/3] overflow-hidden bg-surface-alt">
            <Image
              src={book.cover_image}
              alt={book.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 200px"
              className="object-cover"
            />
          </div>
        </Link>

        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {book.is_on_sale && (
            <Badge variant="error">-{book.discount_percentage}%</Badge>
          )}
          {book.is_bestseller && <Badge variant="secondary">Bestseller</Badge>}
          {book.is_new_arrival && !book.is_bestseller && (
            <Badge variant="primary">New</Badge>
          )}
        </div>

        <button
          type="button"
          onClick={() => toggle(book.id, isSaved)}
          aria-label="Toggle wishlist"
          className="absolute right-2 top-2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink-secondary shadow-sm transition hover:text-error"
        >
          <Heart
            className={cn("h-4 w-4", isSaved && "fill-error text-error")}
          />
        </button>
      </div>

      <div className="flex flex-col gap-2 p-3">
        {book.category_name && (
          <span className="text-xs font-medium uppercase tracking-wide text-ink-muted">
            {book.category_name}
          </span>
        )}
        <Link href={ROUTES.book(book.slug)}>
          <h3 className="line-clamp-2 font-display text-base leading-tight text-ink transition-colors group-hover:text-primary">
            {book.title}
          </h3>
        </Link>
        <p className="line-clamp-1 text-xs text-ink-secondary">
          {book.authors.map((author) => author.name).join(", ")}
        </p>
        <StarRating
          rating={book.average_rating}
          reviewCount={book.review_count}
          showvalue
          size={14}
        />
        <div className="mt-1 flex items-center justify-between">
          <PriceDisplay
            price={book.effective_price}
            originalPrice={book.is_on_sale ? book.original_price : null}
            currency={book.currency}
            size="sm"
          />
          <button
            type="button"
            onClick={() => addItem({ bookId: book.id })}
            disabled={!book.in_stock || isAdding}
            aria-label="Add to cart"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
        {!book.in_stock && (
          <span className="text-xs font-medium text-error">Out of stock</span>
        )}
      </div>
    </div>
  );
}
