"use client";

import Image from "next/image";
import { useState } from "react";
import { Heart, Minus, Plus, ShoppingCart } from "lucide-react";

import { Badge } from "@/components/common/Badge";
import { PriceDisplay } from "@/components/common/PriceDisplay";
import { StarRating } from "@/components/common/StarRating";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useWishlistStore } from "@/store/wishlistStore";
import { cn } from "@/lib/utils";
import type { BookDetail } from "@/types/book";

export function BookDetailHero({ book }: { book: BookDetail }) {
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(book.cover_image);
  const { addItem, isAdding } = useCart();
  const { toggle } = useWishlist();
  const isSaved = useWishlistStore((state) => state.bookIds.has(book.id));

  const gallery = [book.cover_image, ...(book.additional_images ?? [])];

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="flex gap-4">
        {gallery.length > 1 && (
          <div className="flex flex-col gap-2">
            {gallery.slice(0, 4).map((image) => (
              <button
                key={image}
                type="button"
                onClick={() => setActiveImage(image)}
                className={cn(
                  "relative h-20 w-16 overflow-hidden rounded-lg border bg-surface-alt",
                  activeImage === image
                    ? "border-primary"
                    : "border-border",
                )}
              >
                <Image src={image} alt={book.title} fill sizes="64px" className="object-cover" />
              </button>
            ))}
          </div>
        )}
        <div className="relative aspect-[2/3] flex-1 overflow-hidden rounded-2xl border border-border bg-surface-alt">
          <Image
            src={activeImage}
            alt={book.title}
            fill
            sizes="(max-width: 1024px) 90vw, 400px"
            className="object-cover"
            priority
          />
          {book.is_on_sale && (
            <Badge variant="error" className="absolute left-3 top-3">
              -{book.discount_percentage}% OFF
            </Badge>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {book.category && (
          <span className="text-sm font-medium uppercase tracking-wide text-secondary">
            {book.category.name}
          </span>
        )}
        <h1 className="font-display text-4xl leading-tight text-ink">
          {book.title}
        </h1>
        <p className="text-ink-secondary">
          by{" "}
          <span className="font-medium text-ink">
            {book.authors.map((author) => author.name).join(", ")}
          </span>
          {book.publisher && <> · {book.publisher.name}</>}
        </p>

        <StarRating
          rating={book.average_rating}
          reviewCount={book.review_count}
          showvalue
          size={18}
        />

        <PriceDisplay
          price={book.effective_price}
          originalPrice={book.is_on_sale ? book.original_price : null}
          currency={book.currency}
          size="lg"
        />

        {book.short_description && (
          <p className="text-ink-secondary">{book.short_description}</p>
        )}

        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-ink">Availability:</span>
          {book.in_stock ? (
            <span className="text-success">In stock ({book.stock} left)</span>
          ) : (
            <span className="text-error">Out of stock</span>
          )}
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-3">
          <div className="flex items-center rounded-xl border border-border">
            <button
              type="button"
              onClick={() => setQuantity((value) => Math.max(1, value - 1))}
              className="px-3 py-2.5 text-ink-secondary hover:text-primary"
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-10 text-center font-medium">{quantity}</span>
            <button
              type="button"
              onClick={() =>
                setQuantity((value) => Math.min(book.stock, value + 1))
              }
              className="px-3 py-2.5 text-ink-secondary hover:text-primary"
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => addItem({ bookId: book.id, quantity })}
            disabled={!book.in_stock || isAdding}
            className="btn-primary flex-1 sm:flex-none"
          >
            <ShoppingCart className="h-4 w-4" /> Add to Cart
          </button>

          <button
            type="button"
            onClick={() => toggle(book.id, isSaved)}
            className="btn-outline"
            aria-label="Toggle wishlist"
          >
            <Heart className={cn("h-4 w-4", isSaved && "fill-error text-error")} />
          </button>
        </div>
      </div>
    </div>
  );
}
