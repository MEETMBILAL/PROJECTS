"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { User } from "lucide-react";

import { Breadcrumb } from "@/components/common/Breadcrumb";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { queryKeys } from "@/constants/queryKeys";
import { ROUTES } from "@/constants/routes";
import { booksApi } from "@/lib/api/books";

export default function AuthorsPage() {
  const { data: authors, isLoading } = useQuery({
    queryKey: queryKeys.authors(),
    queryFn: booksApi.authors,
  });

  return (
    <div className="container-bs py-8">
      <Breadcrumb items={[{ label: "Authors" }]} />
      <h1 className="mt-3 text-4xl text-primary">Authors</h1>

      {isLoading ? (
        <LoadingSpinner />
      ) : !authors || authors.length === 0 ? (
        <EmptyState title="No authors yet" description="Check back soon." />
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {authors.map((author) => (
            <Link
              key={author.id}
              href={ROUTES.author(author.slug)}
              className="card-bs flex items-center gap-4 p-5 transition hover:border-primary hover:shadow-card-hover"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-primary">
                <User size={22} />
              </span>
              <div>
                <h3 className="font-medium text-text-primary">{author.name}</h3>
                <p className="text-sm text-text-muted">{author.book_count ?? 0} books</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
