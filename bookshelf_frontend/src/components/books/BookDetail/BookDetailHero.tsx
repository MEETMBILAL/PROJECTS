"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Minus, Plus, ShoppingCart } from "lucide-react";

import { Badge } from "@/components/common/Badge";
import { PriceDisplay } from "@/components/common/PriceDisplay";
import { StarRating } from "@/components/common/StarRating";
import { ROUTES } from "@/constants/routes";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { cn } from "@/lib/utils";
import type { BookDetail } from "@/types";

const PLACEHOLDER = "/images/placeholder-book.svg";

export function BookDetailHero({ book }: { book: BookDetail }) {
  const { addToCart } = useCart();
  const { toggleWishlist, has } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const images = [book.cover_image, ...(book.additional_images ?? [])].filter(Boolean);
  const [activeImage, setActiveImage] = useState(images[0] || PLACEHOLDER);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="flex gap-4">
        {images.length > 1 && (
          <div className="flex flex-col gap-2">
            {images.map((img) => (
              <button
                key={img}
                type="button"
                onClick={() => setActiveImage(img)}
                className={cn(
                  "relative h-20 w-14 overflow-hidden rounded-lg border bg-surface-alt",
                  activeImage === img ? "border-primary" : "border-bsborder",
                )}
              >
                <Image src={img} alt={book.title} fill sizes="56px" className="object-cover" />
              </button>
            ))}
          </div>
        )}
        <div className="relative aspect-[2/3] flex-1 overflow-hidden rounded-xl bg-surface-alt">
          <Image
            src={activeImage}
            alt={book.title}
            fill
            sizes="(max-width: 1024px) 100vw, 500px"
            className="object-cover"
            priority
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {book.is_bestseller && <Badge variant="secondary">Bestseller</Badge>}
          {book.is_new_arrival && <Badge variant="success">New Arrival</Badge>}
          {book.discount_percentage > 0 && (
            <Badge variant="error">-{book.discount_percentage}% OFF</Badge>
          )}
        </div>
        <h1 className="text-4xl text-primary">{book.title}</h1>
        <p className="text-text-secondary">
          by{" "}
          {book.authors.map((author, idx) => (
            <span key={author.id}>
              <Link href={ROUTES.author(author.slug)} className="text-secondary hover:underline">
                {author.name}
              </Link>
              {idx < book.authors.length - 1 ? ", " : ""}
            </span>
          ))}
          {book.publisher && (
            <span className="text-text-muted"> · {book.publisher.name}</span>
          )}
        </p>

        {book.review_count > 0 && (
          <StarRating rating={book.average_rating} count={book.review_count} size={18} />
        )}

        <PriceDisplay
          price={book.effective_price}
          originalPrice={book.sale_price ? book.original_price : null}
          currency={book.currency}
          size="lg"
        />

        {book.short_description && (
          <p className="text-text-secondary">{book.short_description}</p>
        )}

        <p className={cn("text-sm font-medium", book.in_stock ? "text-success" : "text-error")}>
          {book.in_stock ? `In stock (${book.stock} available)` : "Out of stock"}
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <div className="flex items-center rounded-xl border border-bsborder">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="px-3 py-2.5 text-text-secondary hover:text-primary"
              aria-label="Decrease quantity"
            >
              <Minus size={16} />
            </button>
            <span className="w-10 text-center">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(book.stock || 99, q + 1))}
              className="px-3 py-2.5 text-text-secondary hover:text-primary"
              aria-label="Increase quantity"
            >
              <Plus size={16} />
            </button>
          </div>
          <button
            type="button"
            onClick={() => addToCart(book, quantity)}
            disabled={!book.in_stock}
            className="btn-primary flex-1 disabled:opacity-40"
          >
            <ShoppingCart size={18} /> Add to Cart
          </button>
          <button
            type="button"
            onClick={() => toggleWishlist(book)}
            className="btn-outline px-4"
            aria-label="Add to wishlist"
          >
            <Heart size={18} className={cn(has(book.id) && "fill-error text-error")} />
          </button>
        </div>
      </div>
    </div>
  );
}
