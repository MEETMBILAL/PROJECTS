"use client";

import { BookCarousel } from "@/components/books/BookGrid";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { SectionHeader } from "@/components/common/SectionHeader";
import { ROUTES } from "@/constants/routes";
import { useNewArrivals } from "@/hooks/useBooks";

export function NewArrivals() {
  const { data, isLoading } = useNewArrivals();

  return (
    <section className="section-alt">
      <div className="container-bs py-14">
        <SectionHeader
          title="New Arrivals"
          subtitle="Fresh off the press"
          href={`${ROUTES.books}?is_new_arrival=true`}
        />
        {isLoading ? (
          <LoadingSpinner />
        ) : data && data.length > 0 ? (
          <BookCarousel books={data} />
        ) : (
          <p className="text-text-secondary">No new arrivals yet.</p>
        )}
      </div>
    </section>
  );
}
