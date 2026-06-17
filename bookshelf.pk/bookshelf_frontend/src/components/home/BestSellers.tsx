"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { Badge } from "@/components/common/Badge";
import { PriceDisplay } from "@/components/common/PriceDisplay";
import { StarRating } from "@/components/common/StarRating";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { SectionHeader } from "@/components/common/SectionHeader";
import { booksApi } from "@/lib/api/books";
import { queryKeys } from "@/constants/queryKeys";
import { ROUTES } from "@/constants/routes";

export function BestSellers() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.bestsellers(),
    queryFn: booksApi.bestsellers,
  });

  const books = (data?.results ?? []).slice(0, 6);

  return (
    <section className="bg-surface-alt py-16">
      <div className="container-bs">
        <SectionHeader
          title="Best Sellers"
          subtitle="What everyone is reading right now"
          viewAllHref={`${ROUTES.books}?sort=bestseller`}
        />
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book, index) => (
              <Link
                key={book.id}
                href={ROUTES.book(book.slug)}
                className="card flex items-center gap-4 p-3 transition hover:border-primary"
              >
                <span className="font-display text-3xl font-bold text-border">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="relative aspect-[2/3] w-16 flex-shrink-0 overflow-hidden rounded-lg bg-surface">
                  <Image
                    src={book.cover_image}
                    alt={book.title}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate font-medium text-ink">
                      {book.title}
                    </h3>
                    {book.is_on_sale && (
                      <Badge variant="error">-{book.discount_percentage}%</Badge>
                    )}
                  </div>
                  <p className="truncate text-xs text-ink-secondary">
                    {book.authors.map((author) => author.name).join(", ")}
                  </p>
                  <StarRating rating={book.average_rating} size={12} />
                  <PriceDisplay
                    price={book.effective_price}
                    originalPrice={book.is_on_sale ? book.original_price : null}
                    currency={book.currency}
                    size="sm"
                  />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
