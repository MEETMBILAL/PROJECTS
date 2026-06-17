"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";

import { Badge } from "@/components/common/Badge";
import { PriceDisplay } from "@/components/common/PriceDisplay";
import { StarRating } from "@/components/common/StarRating";
import { ROUTES } from "@/constants/routes";
import { useAddToCart } from "@/hooks/useCart";
import { useWishlist, useToggleWishlist } from "@/hooks/useWishlist";
import { cn } from "@/lib/utils";
import type { BookListItem } from "@/types/book";

export function BookCard({ book }: { book: BookListItem }) {
  const addToCart = useAddToCart();
  const { data: wishlist } = useWishlist();
  const toggleWishlist = useToggleWishlist();
  const inWishlist = wishlist?.some((entry) => entry.book.id === book.id) ?? false;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-bsborder bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
      <Link href={ROUTES.book(book.slug)} className="relative block overflow-hidden">
        <div className="relative aspect-[2/3] w-full bg-surface-alt">
          <Image
            src={book.cover_image}
            alt={book.title}
            fill
            sizes="(max-width: 768px) 50vw, 20vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </div>
        <div className="absolute left-2 top-2 flex flex-col gap-1.5">
          {book.is_on_sale && (
            <Badge variant="error">-{book.discount_percentage}%</Badge>
          )}
          {book.is_new_arrival && <Badge variant="secondary">New</Badge>}
          {book.is_bestseller && <Badge variant="primary">Bestseller</Badge>}
        </div>
      </Link>

      <button
        type="button"
        onClick={() => toggleWishlist.mutate({ bookId: book.id, inList: inWishlist })}
        className="absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-text-secondary shadow-sm backdrop-blur transition-colors hover:text-error"
        aria-label="Toggle wishlist"
      >
        <Heart size={18} className={cn(inWishlist && "fill-error text-error")} />
      </button>

      <div className="flex flex-1 flex-col p-3.5">
        <p className="mb-1 line-clamp-1 text-xs text-text-muted">
          {book.authors.map((a) => a.name).join(", ") || "Unknown author"}
        </p>
        <Link href={ROUTES.book(book.slug)}>
          <h3 className="line-clamp-2 font-display text-base font-semibold leading-snug text-text-primary group-hover:text-primary">
            {book.title}
          </h3>
        </Link>

        <div className="mt-1.5 flex items-center gap-1.5">
          <StarRating rating={book.average_rating} size={14} />
          {book.review_count > 0 && (
            <span className="text-xs text-text-muted">({book.review_count})</span>
          )}
        </div>

        <div className="mt-auto pt-3">
          <PriceDisplay
            price={book.effective_price}
            originalPrice={book.is_on_sale ? book.original_price : null}
            currency={book.currency}
            size="sm"
          />
          <button
            type="button"
            disabled={!book.in_stock || addToCart.isPending}
            onClick={() => addToCart.mutate({ bookId: book.id })}
            className="btn-primary mt-2.5 w-full text-sm"
          >
            <ShoppingCart size={16} />
            {book.in_stock ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>
    </div>
  );
}
