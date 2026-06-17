"use client";

import { useQuery } from "@tanstack/react-query";

import { BookGrid } from "@/components/books/BookGrid";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { queryKeys } from "@/constants/queryKeys";
import { ROUTES } from "@/constants/routes";
import { booksApi } from "@/lib/api/books";
import { useBooks } from "@/hooks/useBooks";

export default function AuthorDetailPage({ params }: { params: { slug: string } }) {
  const { data: author, isLoading: authorLoading } = useQuery({
    queryKey: queryKeys.author(params.slug),
    queryFn: () => booksApi.author(params.slug),
  });
  const { data: books, isLoading: booksLoading } = useBooks({ author: params.slug });

  if (authorLoading) return <LoadingSpinner className="min-h-[50vh]" />;
  if (!author) {
    return (
      <div className="container-bs py-16">
        <EmptyState title="Author not found" actionLabel="Browse books" actionHref={ROUTES.books} />
      </div>
    );
  }

  return (
    <div className="container-bs py-8">
      <Breadcrumb
        items={[
          { label: "Authors", href: ROUTES.authors },
          { label: author.name },
        ]}
      />
      <div className="mt-6 flex flex-col gap-2">
        <h1 className="text-4xl text-primary">{author.name}</h1>
        {author.bio && <p className="max-w-2xl text-text-secondary">{author.bio}</p>}
      </div>

      <h2 className="mt-10 text-2xl text-primary">Books by {author.name}</h2>
      <div className="mt-4">
        {booksLoading ? (
          <LoadingSpinner />
        ) : books && books.results.length > 0 ? (
          <BookGrid books={books.results} />
        ) : (
          <EmptyState title="No books found for this author" />
        )}
      </div>
    </div>
  );
}
