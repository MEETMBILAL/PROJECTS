"use client";

import { useFeaturedBooks } from "@/hooks/useBooks";
import { SectionHeader } from "@/components/common/SectionHeader";
import { BookCarousel } from "@/components/books/BookCarousel";
import { BookGridSkeleton } from "@/components/books/BookGrid";
import { ROUTES } from "@/constants/routes";

export function FeaturedBooks() {
  const { data, isLoading } = useFeaturedBooks();

  return (
    <section className="bg-surface-alt py-14">
      <div className="container-page">
        <SectionHeader
          title="Editor's Picks"
          subtitle="Handpicked titles our team is loving right now"
          viewAllHref={`${ROUTES.books}?featured=true`}
        />
        {isLoading ? (
          <BookGridSkeleton count={5} />
        ) : data && data.length > 0 ? (
          <BookCarousel books={data} />
        ) : (
          <p className="text-text-secondary">No featured books yet.</p>
        )}
      </div>
    </section>
  );
}
