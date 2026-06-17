"use client";

import { useNewArrivals } from "@/hooks/useBooks";
import { SectionHeader } from "@/components/common/SectionHeader";
import { BookCarousel } from "@/components/books/BookCarousel";
import { BookGridSkeleton } from "@/components/books/BookGrid";
import { ROUTES } from "@/constants/routes";

export function NewArrivals() {
  const { data, isLoading } = useNewArrivals();

  return (
    <section className="container-page py-14">
      <SectionHeader
        title="New Arrivals"
        subtitle="Fresh off the press and onto our shelves"
        viewAllHref={`${ROUTES.books}?new_arrival=true`}
      />
      {isLoading ? (
        <BookGridSkeleton count={5} />
      ) : data && data.length > 0 ? (
        <BookCarousel books={data} />
      ) : (
        <p className="text-text-secondary">No new arrivals yet.</p>
      )}
    </section>
  );
}
