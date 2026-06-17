"use client";

import { BookGrid } from "@/components/books/BookGrid";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { SectionHeader } from "@/components/common/SectionHeader";
import { ROUTES } from "@/constants/routes";
import { useNewArrivals } from "@/hooks/useBooks";

export function NewArrivals() {
  const { data: books, isLoading } = useNewArrivals();

  if (!isLoading && (!books || books.length === 0)) return null;

  return (
    <section className="bg-surface-alt">
      <div className="container-bs py-14">
        <SectionHeader
          title="New Arrivals"
          subtitle="Fresh off the press"
          viewAllHref={`${ROUTES.books}?is_new_arrival=true`}
        />
        {isLoading ? <LoadingSpinner /> : <BookGrid books={(books ?? []).slice(0, 8)} />}
      </div>
    </section>
  );
}
