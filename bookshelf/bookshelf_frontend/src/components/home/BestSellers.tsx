"use client";

import Image from "next/image";
import Link from "next/link";
import { useBestsellers } from "@/hooks/useBooks";
import { SectionHeader } from "@/components/common/SectionHeader";
import { PriceDisplay } from "@/components/common/PriceDisplay";
import { StarRating } from "@/components/common/StarRating";
import { Badge } from "@/components/common/Badge";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ROUTES } from "@/constants/routes";

export function BestSellers() {
  const { data, isLoading } = useBestsellers();

  return (
    <section className="bg-surface-alt py-14">
      <div className="container-page">
        <SectionHeader
          title="Best Sellers"
          subtitle="The books everyone is reading"
          viewAllHref={`${ROUTES.books}?bestseller=true`}
        />
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {data?.slice(0, 6).map((book, i) => (
              <Link
                key={book.id}
                href={ROUTES.book(book.slug)}
                className="card group flex items-center gap-4 p-3 hover:border-primary"
              >
                <span className="font-display text-3xl font-bold text-bordercolor">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="relative h-24 w-16 shrink-0 overflow-hidden rounded-lg bg-surface">
                  <Image
                    src={book.cover_image}
                    alt={book.title}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="line-clamp-1 font-medium text-text-primary group-hover:text-primary">
                      {book.title}
                    </p>
                    {book.discount_percentage > 0 ? (
                      <Badge variant="error">
                        -{book.discount_percentage}%
                      </Badge>
                    ) : null}
                  </div>
                  <p className="line-clamp-1 text-sm text-text-secondary">
                    {book.authors.map((a) => a.name).join(", ")}
                  </p>
                  <div className="mt-1.5 flex items-center justify-between">
                    <StarRating
                      value={parseFloat(book.rating_average)}
                      count={book.rating_count}
                    />
                    <PriceDisplay price={book.effective_price} size="sm" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
