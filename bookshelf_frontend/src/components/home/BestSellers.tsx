"use client";

import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/common/Badge";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { PriceDisplay } from "@/components/common/PriceDisplay";
import { SectionHeader } from "@/components/common/SectionHeader";
import { StarRating } from "@/components/common/StarRating";
import { ROUTES } from "@/constants/routes";
import { useBestsellers } from "@/hooks/useBooks";

export function BestSellers() {
  const { data, isLoading } = useBestsellers();

  return (
    <section className="container-bs py-14">
      <SectionHeader
        title="Best Sellers"
        subtitle="What Pakistan is reading right now"
        href={`${ROUTES.books}?is_bestseller=true`}
      />
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data?.slice(0, 6).map((book, index) => (
            <Link
              key={book.id}
              href={ROUTES.book(book.slug)}
              className="flex gap-4 rounded-xl border border-bsborder bg-white p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              <span className="font-display text-4xl font-bold text-bsborder">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="relative h-24 w-16 shrink-0 overflow-hidden rounded-lg bg-surface-alt">
                <Image
                  src={book.cover_image}
                  alt={book.title}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col">
                <h3 className="line-clamp-2 text-sm font-semibold text-text-primary">
                  {book.title}
                </h3>
                <StarRating rating={book.average_rating} size={13} className="my-1" />
                <div className="mt-auto flex items-center justify-between">
                  <PriceDisplay price={book.effective_price} size="sm" />
                  {book.is_on_sale && (
                    <Badge variant="error">-{book.discount_percentage}%</Badge>
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
