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
import { cn } from "@/lib/utils";
import type { Book } from "@/types";

const PLACEHOLDER = "/images/placeholder-book.png";

export function BookCard({ book }: { book: Book }) {
  const { addToCart } = useCart();
  const { toggleWishlist, has } = useWishlist();
  const isWishlisted = has(book.id);

  return (
    <div className="group card-bs flex flex-col overflow-hidden transition-transform duration-200 hover:scale-[1.02] hover:shadow-card-hover">
      <div className="relative aspect-[2/3] overflow-hidden bg-surface-alt">
        <Link href={ROUTES.book(book.slug)}>
          <Image
            src={book.cover_image || PLACEHOLDER}
            alt={book.title}
            fill
            sizes="(max-width: 768px) 50vw, 240px"
            className="object-cover"
          />
        </Link>
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {book.discount_percentage > 0 && (
            <Badge variant="error">-{book.discount_percentage}%</Badge>
          )}
          {book.is_bestseller && <Badge variant="secondary">Bestseller</Badge>}
          {book.is_new_arrival && <Badge variant="success">New</Badge>}
        </div>
        <button
          type="button"
          onClick={() => toggleWishlist(book)}
          aria-label="Toggle wishlist"
          className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-text-secondary shadow-card transition hover:text-error"
        >
          <Heart
            size={18}
            className={cn(isWishlisted && "fill-error text-error")}
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        {book.category && (
          <span className="text-xs uppercase tracking-wide text-text-muted">
            {typeof book.category === "string" ? book.category : book.category.name}
          </span>
        )}
        <Link href={ROUTES.book(book.slug)}>
          <h3 className="line-clamp-2 font-display text-base leading-snug text-text-primary hover:text-primary">
            {book.title}
          </h3>
        </Link>
        <p className="text-sm text-text-secondary">
          {book.authors.map((a) => a.name).join(", ") || "Unknown author"}
        </p>
        {book.review_count > 0 && (
          <StarRating rating={book.average_rating} count={book.review_count} size={14} />
        )}
        <div className="mt-auto flex items-center justify-between pt-2">
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
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-surface transition hover:bg-secondary disabled:opacity-40"
            aria-label="Add to cart"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
        {!book.in_stock && <span className="text-xs text-error">Out of stock</span>}
      </div>
    </div>
  );
}
