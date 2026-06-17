"use client";

import { useQuery } from "@tanstack/react-query";

import { BookGrid } from "@/components/books/BookGrid";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { queryKeys } from "@/constants/queryKeys";
import { ROUTES } from "@/constants/routes";
import { booksApi } from "@/lib/api/books";
import { getInitials } from "@/lib/utils";

export default function AuthorDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const author = useQuery({
    queryKey: queryKeys.author(slug),
    queryFn: () => booksApi.author(slug),
  });
  const books = useQuery({
    queryKey: [...queryKeys.author(slug), "books"],
    queryFn: () => booksApi.authorBooks(slug),
  });

  if (author.isLoading) return <LoadingSpinner className="min-h-[50vh]" />;

  return (
    <div className="container-bs py-8">
      <Breadcrumb
        items={[
          { label: "Authors", href: ROUTES.authors },
          { label: author.data?.name ?? slug },
        ]}
      />

      <div className="mt-6 flex items-center gap-5">
        <span className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-accent text-2xl font-semibold text-primary">
          {getInitials(author.data?.name ?? "?")}
        </span>
        <div>
          <h1 className="font-display text-3xl font-bold text-text-primary">
            {author.data?.name}
          </h1>
          {author.data?.bio && (
            <p className="mt-2 max-w-2xl text-text-secondary">{author.data.bio}</p>
          )}
        </div>
      </div>

      <div className="mt-10">
        <h2 className="mb-5 font-display text-xl font-semibold">Books by this author</h2>
        {books.isLoading ? (
          <LoadingSpinner />
        ) : books.data && books.data.length > 0 ? (
          <BookGrid books={books.data} />
        ) : (
          <EmptyState title="No books found for this author" />
        )}
      </div>
    </div>
  );
}
