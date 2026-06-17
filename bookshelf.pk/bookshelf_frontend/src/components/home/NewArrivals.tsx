"use client";

import { useQuery } from "@tanstack/react-query";

import { BookGrid } from "@/components/books/BookGrid";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { SectionHeader } from "@/components/common/SectionHeader";
import { booksApi } from "@/lib/api/books";
import { queryKeys } from "@/constants/queryKeys";
import { ROUTES } from "@/constants/routes";

export function NewArrivals() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.newArrivals(),
    queryFn: booksApi.newArrivals,
  });

  const books = (data?.results ?? []).slice(0, 8);

  return (
    <section className="container-bs py-16">
      <SectionHeader
        title="New Arrivals"
        subtitle="Fresh off the press"
        viewAllHref={`${ROUTES.books}?sort=newest`}
      />
      {isLoading ? <LoadingSpinner /> : <BookGrid books={books} />}
    </section>
  );
}
