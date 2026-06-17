"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, Minus, Plus, ShoppingCart, Truck } from "lucide-react";

import { Badge } from "@/components/common/Badge";
import { PriceDisplay } from "@/components/common/PriceDisplay";
import { StarRating } from "@/components/common/StarRating";
import { useAddToCart } from "@/hooks/useCart";
import { useToggleWishlist, useWishlist } from "@/hooks/useWishlist";
import { cn } from "@/lib/utils";
import type { Book } from "@/types/book";

export function BookDetailHero({ book }: { book: Book }) {
  const images = [book.cover_image, ...(book.additional_images ?? [])];
  const [active, setActive] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const addToCart = useAddToCart();
  const { data: wishlist } = useWishlist();
  const toggleWishlist = useToggleWishlist();
  const inWishlist = wishlist?.some((entry) => entry.book.id === book.id) ?? false;

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div className="flex gap-4">
        {images.length > 1 && (
          <div className="flex flex-col gap-3">
            {images.map((image, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActive(index)}
                className={cn(
                  "relative h-20 w-14 overflow-hidden rounded-lg border-2 bg-surface-alt",
                  active === index ? "border-primary" : "border-bsborder",
                )}
              >
                <Image src={image} alt="" fill sizes="56px" className="object-cover" />
              </button>
            ))}
          </div>
        )}
        <div className="relative aspect-[2/3] flex-1 overflow-hidden rounded-2xl border border-bsborder bg-surface-alt">
          <Image
            src={images[active]}
            alt={book.title}
            fill
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="object-cover"
            priority
          />
          {book.is_on_sale && (
            <Badge variant="error" className="absolute left-4 top-4">
              -{book.discount_percentage}% OFF
            </Badge>
          )}
        </div>
      </div>

      <div>
        <div className="flex flex-wrap gap-2">
          {book.category_detail && <Badge variant="muted">{book.category_detail.name}</Badge>}
          {book.is_bestseller && <Badge variant="primary">Bestseller</Badge>}
          {book.is_new_arrival && <Badge variant="secondary">New Arrival</Badge>}
        </div>

        <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-text-primary lg:text-4xl">
          {book.title}
        </h1>
        <p className="mt-2 text-text-secondary">
          by{" "}
          <span className="font-medium text-primary">
            {book.authors.map((a) => a.name).join(", ")}
          </span>
          {book.publisher && <span> · {book.publisher.name}</span>}
        </p>

        <div className="mt-3 flex items-center gap-2">
          <StarRating rating={book.average_rating} showValue />
          <span className="text-sm text-text-muted">
            ({book.review_count} review{book.review_count === 1 ? "" : "s"})
          </span>
        </div>

        <div className="mt-5">
          <PriceDisplay
            price={book.effective_price}
            originalPrice={book.is_on_sale ? book.original_price : null}
            currency={book.currency}
            size="lg"
          />
        </div>

        <p className="mt-4 text-text-secondary">{book.short_description || book.description}</p>

        <div className="mt-5">
          {book.in_stock ? (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-success">
              <span className="h-2 w-2 rounded-full bg-success" /> In stock ({book.stock} available)
            </span>
          ) : (
            <span className="text-sm font-medium text-error">Out of stock</span>
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <div className="flex items-center rounded-xl border border-bsborder">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="grid h-11 w-11 place-items-center text-text-secondary hover:text-primary"
              aria-label="Decrease"
            >
              <Minus size={16} />
            </button>
            <span className="w-10 text-center font-medium">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(book.stock, q + 1))}
              className="grid h-11 w-11 place-items-center text-text-secondary hover:text-primary"
              aria-label="Increase"
            >
              <Plus size={16} />
            </button>
          </div>

          <button
            type="button"
            disabled={!book.in_stock || addToCart.isPending}
            onClick={() => addToCart.mutate({ bookId: book.id, quantity })}
            className="btn-primary flex-1 px-8 py-3 text-base sm:flex-none"
          >
            <ShoppingCart size={18} /> Add to Cart
          </button>

          <button
            type="button"
            onClick={() => toggleWishlist.mutate({ bookId: book.id, inList: inWishlist })}
            className="grid h-12 w-12 place-items-center rounded-xl border border-bsborder text-text-secondary hover:border-error hover:text-error"
            aria-label="Wishlist"
          >
            <Heart size={20} className={cn(inWishlist && "fill-error text-error")} />
          </button>
        </div>

        <div className="mt-6 flex items-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm text-primary">
          <Truck size={18} />
          Free delivery on orders over PKR 3,000 across Pakistan.
        </div>
      </div>
    </div>
  );
}
