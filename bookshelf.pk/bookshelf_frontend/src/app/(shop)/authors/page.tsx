"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { Breadcrumb } from "@/components/common/Breadcrumb";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { SectionHeader } from "@/components/common/SectionHeader";
import { booksApi } from "@/lib/api/books";
import { queryKeys } from "@/constants/queryKeys";
import { ROUTES } from "@/constants/routes";
import { getInitials } from "@/lib/utils";

export default function AuthorsPage() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.authors(),
    queryFn: booksApi.authors,
  });

  const authors = data?.results ?? [];

  return (
    <div className="container-bs py-8">
      <Breadcrumb
        items={[{ label: "Home", href: ROUTES.home }, { label: "Authors" }]}
        className="mb-6"
      />
      <SectionHeader title="Authors" subtitle="Discover writers you'll love" />
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {authors.map((author) => (
            <Link
              key={author.id}
              href={ROUTES.author(author.slug)}
              className="card flex flex-col items-center gap-3 p-6 text-center transition hover:border-primary"
            >
              <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-accent text-lg font-semibold text-primary">
                {getInitials(author.name)}
              </span>
              <span className="font-medium text-ink">{author.name}</span>
              {typeof author.book_count === "number" && (
                <span className="text-xs text-ink-muted">
                  {author.book_count} books
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
