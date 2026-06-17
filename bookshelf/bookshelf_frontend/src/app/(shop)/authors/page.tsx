"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { booksApi } from "@/lib/api/books";
import { queryKeys } from "@/constants/queryKeys";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { getInitials } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";

export default function AuthorsPage() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.authors,
    queryFn: booksApi.authors,
  });

  return (
    <div className="container-page py-8">
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Authors" }]}
      />
      <h1 className="mb-6 font-display text-3xl text-text-primary">Authors</h1>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {data?.results.map((author) => (
            <Link
              key={author.id}
              href={ROUTES.author(author.slug)}
              className="card group flex items-center gap-3 p-4 hover:border-primary"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary text-sm font-semibold text-surface">
                {getInitials(author.name)}
              </span>
              <div>
                <p className="font-medium text-text-primary group-hover:text-primary">
                  {author.name}
                </p>
                <p className="text-xs text-text-muted">
                  {author.book_count ?? 0} books
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
