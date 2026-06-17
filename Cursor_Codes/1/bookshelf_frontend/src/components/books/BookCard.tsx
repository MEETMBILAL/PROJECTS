"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import type { Book } from "@/types/book";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { Badge } from "@/components/common/Badge";
import { PriceDisplay } from "@/components/common/PriceDisplay";
import { StarRating } from "@/components/common/StarRating";

export function BookCard({ book }: { book: Book }) {
  const { addToCart } = useCart();
  const { toggle, has } = useWishlist();
  const inWishlist = has(book.id);
  const authorNames = book.authors.map((a) => a.name).join(", ");

  return (
    <div className="group card flex flex-col overflow-hidden transition-transform duration-200 hover:-translate-y-1 hover:shadow-card-hover">
      <div className="relative aspect-[2/3] overflow-hidden bg-surface-alt">
        <Link href={ROUTES.book(book.slug)}>
          <Image
            src={book.cover_image}
            alt={book.title}
            fill
            sizes="(max-width: 768px) 50vw, 20vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          />
        </Link>
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {book.discount_percentage > 0 ? (
            <Badge variant="error">-{book.discount_percentage}%</Badge>
          ) : null}
          {book.is_bestseller ? (
            <Badge variant="secondary">Bestseller</Badge>
          ) : null}
          {book.is_new_arrival ? <Badge variant="success">New</Badge> : null}
        </div>
        <button
          type="button"
          onClick={() => toggle(book)}
          aria-label="Toggle wishlist"
          className="absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-text-secondary shadow-sm backdrop-blur transition-colors hover:text-error"
        >
          <Heart
            className={cn(
              "h-4 w-4",
              inWishlist && "fill-error text-error",
            )}
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <Link
          href={ROUTES.book(book.slug)}
          className="line-clamp-2 font-medium text-text-primary transition-colors hover:text-primary"
        >
          {book.title}
        </Link>
        {authorNames ? (
          <p className="mt-1 line-clamp-1 text-sm text-text-secondary">
            {authorNames}
          </p>
        ) : null}
        <div className="mt-2">
          <StarRating
            value={parseFloat(book.rating_average)}
            count={book.rating_count}
          />
        </div>
        <div className="mt-auto flex items-center justify-between pt-3">
          <PriceDisplay
            price={book.effective_price}
            originalPrice={book.sale_price ? book.original_price : null}
            currency={book.currency}
            size="sm"
          />
          <button
            type="button"
            onClick={() => addToCart(book)}
            disabled={!book.in_stock}
            className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-surface transition-colors hover:bg-secondary hover:text-primary-dark disabled:opacity-40"
            aria-label="Add to cart"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
        {!book.in_stock ? (
          <p className="mt-2 text-xs font-medium text-error">Out of stock</p>
        ) : null}
      </div>
    </div>
  );
}
