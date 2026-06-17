"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { BookGrid } from "@/components/books/BookGrid";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { booksApi } from "@/lib/api/books";
import { queryKeys } from "@/constants/queryKeys";
import { ROUTES } from "@/constants/routes";
import { getInitials } from "@/lib/utils";

export default function AuthorDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const authorQuery = useQuery({
    queryKey: queryKeys.author(slug),
    queryFn: () => booksApi.author(slug),
  });

  const booksQuery = useQuery({
    queryKey: [...queryKeys.author(slug), "books"],
    queryFn: () => booksApi.authorBooks(slug),
  });

  const author = authorQuery.data;
  const books = booksQuery.data?.results ?? [];

  return (
    <div className="container-bs py-8">
      <Breadcrumb
        items={[
          { label: "Home", href: ROUTES.home },
          { label: "Authors", href: ROUTES.authors },
          { label: author?.name ?? slug },
        ]}
        className="mb-6"
      />

      <div className="flex items-center gap-4">
        <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-accent text-2xl font-semibold text-primary">
          {getInitials(author?.name ?? "")}
        </span>
        <div>
          <h1 className="font-display text-4xl text-ink">
            {author?.name ?? "Author"}
          </h1>
          {author?.bio && (
            <p className="mt-1 max-w-2xl text-ink-secondary">{author.bio}</p>
          )}
        </div>
      </div>

      <div className="mt-8">
        {booksQuery.isLoading ? (
          <LoadingSpinner />
        ) : books.length === 0 ? (
          <EmptyState
            title="No books by this author yet"
            actionLabel="Browse all books"
            actionHref={ROUTES.books}
          />
        ) : (
          <BookGrid books={books} />
        )}
      </div>
    </div>
  );
}
