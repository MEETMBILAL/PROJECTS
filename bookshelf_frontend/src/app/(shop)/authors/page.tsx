"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { Breadcrumb } from "@/components/common/Breadcrumb";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { queryKeys } from "@/constants/queryKeys";
import { ROUTES } from "@/constants/routes";
import { booksApi } from "@/lib/api/books";
import { getInitials } from "@/lib/utils";

export default function AuthorsPage() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.authors(),
    queryFn: booksApi.authors,
  });

  return (
    <div className="container-bs py-8">
      <Breadcrumb items={[{ label: "Authors" }]} />
      <h1 className="mt-4 font-display text-3xl font-bold text-text-primary">Authors</h1>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {data?.results.map((author) => (
            <Link
              key={author.id}
              href={ROUTES.author(author.slug)}
              className="flex flex-col items-center gap-3 rounded-xl border border-bsborder bg-white p-6 text-center shadow-card transition-all hover:-translate-y-1 hover:border-primary"
            >
              <span className="grid h-16 w-16 place-items-center rounded-full bg-accent text-lg font-semibold text-primary">
                {getInitials(author.name)}
              </span>
              <div>
                <h2 className="font-display text-base font-semibold text-text-primary">
                  {author.name}
                </h2>
                <p className="text-xs text-text-muted">{author.book_count} books</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
