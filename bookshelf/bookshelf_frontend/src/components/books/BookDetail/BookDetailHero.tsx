"use client";

import Image from "next/image";
import { useState } from "react";
import { Heart, Minus, Plus, ShoppingCart, Check } from "lucide-react";
import type { BookDetail } from "@/types/book";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { PriceDisplay } from "@/components/common/PriceDisplay";
import { StarRating } from "@/components/common/StarRating";
import { Badge } from "@/components/common/Badge";
import { cn } from "@/lib/utils";

export function BookDetailHero({ book }: { book: BookDetail }) {
  const { addToCart } = useCart();
  const { toggle, has } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(book.cover_image);

  const gallery = [book.cover_image, ...(book.additional_images ?? [])];
  const inWishlist = has(book.id);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="flex gap-4">
        {gallery.length > 1 ? (
          <div className="flex flex-col gap-2">
            {gallery.slice(0, 5).map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveImage(img)}
                className={cn(
                  "relative h-20 w-14 overflow-hidden rounded-lg border bg-surface-alt",
                  activeImage === img
                    ? "border-primary"
                    : "border-bordercolor",
                )}
              >
                <Image
                  src={img}
                  alt={`${book.title} ${i}`}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        ) : null}
        <div className="relative aspect-[2/3] flex-1 overflow-hidden rounded-xl border border-bordercolor bg-surface-alt">
          <Image
            src={activeImage}
            alt={book.title}
            fill
            sizes="(max-width:768px) 100vw, 40vw"
            className="object-cover"
            priority
          />
        </div>
      </div>

      <div>
        <div className="flex flex-wrap gap-2">
          {book.is_bestseller ? (
            <Badge variant="secondary">Bestseller</Badge>
          ) : null}
          {book.is_new_arrival ? <Badge variant="success">New</Badge> : null}
          {book.discount_percentage > 0 ? (
            <Badge variant="error">-{book.discount_percentage}% off</Badge>
          ) : null}
        </div>

        <h1 className="mt-3 font-display text-3xl text-text-primary lg:text-4xl">
          {book.title}
        </h1>
        <p className="mt-2 text-text-secondary">
          by{" "}
          <span className="font-medium text-primary">
            {book.authors.map((a) => a.name).join(", ") || "Unknown"}
          </span>
          {book.publisher ? ` · ${book.publisher.name}` : ""}
        </p>

        <div className="mt-3">
          <StarRating
            value={parseFloat(book.rating_average)}
            count={book.rating_count}
            size={18}
          />
        </div>

        <div className="mt-5">
          <PriceDisplay
            price={book.effective_price}
            originalPrice={book.sale_price ? book.original_price : null}
            size="lg"
          />
        </div>

        <p className="mt-4 text-text-secondary">
          {book.short_description || book.description.slice(0, 200)}
        </p>

        <div className="mt-5">
          {book.in_stock ? (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-success">
              <Check className="h-4 w-4" /> In stock ({book.stock} available)
            </span>
          ) : (
            <span className="text-sm font-medium text-error">
              Out of stock
            </span>
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="flex items-center rounded-xl border border-bordercolor">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="grid h-11 w-11 place-items-center text-text-secondary hover:text-primary"
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-10 text-center font-medium">{quantity}</span>
            <button
              type="button"
              onClick={() =>
                setQuantity((q) => Math.min(book.stock || 99, q + 1))
              }
              className="grid h-11 w-11 place-items-center text-text-secondary hover:text-primary"
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => addToCart(book, quantity)}
            disabled={!book.in_stock}
            className="btn-primary flex-1 sm:flex-none"
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </button>

          <button
            type="button"
            onClick={() => toggle(book)}
            className={cn(
              "btn-outline",
              inWishlist && "border-error text-error hover:bg-error",
            )}
          >
            <Heart className={cn("h-4 w-4", inWishlist && "fill-error")} />
            {inWishlist ? "Saved" : "Wishlist"}
          </button>
        </div>
      </div>
    </div>
  );
}
