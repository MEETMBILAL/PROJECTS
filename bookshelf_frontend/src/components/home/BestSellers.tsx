"use client";

import Image from "next/image";
import Link from "next/link";

import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { PriceDisplay } from "@/components/common/PriceDisplay";
import { SectionHeader } from "@/components/common/SectionHeader";
import { StarRating } from "@/components/common/StarRating";
import { ROUTES } from "@/constants/routes";
import { useBestsellers } from "@/hooks/useBooks";

const PLACEHOLDER = "/images/placeholder-book.png";

export function BestSellers() {
  const { data: books, isLoading } = useBestsellers();

  return (
    <section className="container-bs py-14">
      <SectionHeader
        title="Best Sellers"
        subtitle="The titles everyone's reading"
        viewAllHref={`${ROUTES.books}?is_bestseller=true&ordering=-sale_count`}
      />
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {books?.slice(0, 6).map((book, index) => (
            <Link
              key={book.id}
              href={ROUTES.book(book.slug)}
              className="card-bs flex items-center gap-4 p-3 transition hover:shadow-card-hover"
            >
              <span className="w-6 shrink-0 text-center font-display text-2xl font-bold text-secondary">
                {index + 1}
              </span>
              <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-lg bg-surface-alt">
                <Image
                  src={book.cover_image || PLACEHOLDER}
                  alt={book.title}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="truncate font-medium text-text-primary">{book.title}</h4>
                <p className="truncate text-sm text-text-muted">
                  {book.authors.map((a) => a.name).join(", ")}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <PriceDisplay
                    price={book.effective_price}
                    currency={book.currency}
                    size="sm"
                  />
                  {book.review_count > 0 && (
                    <StarRating rating={book.average_rating} size={12} />
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
