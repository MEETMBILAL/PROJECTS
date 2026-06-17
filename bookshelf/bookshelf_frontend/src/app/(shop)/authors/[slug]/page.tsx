"use client";

import { useQuery } from "@tanstack/react-query";
import { booksApi } from "@/lib/api/books";
import { useBooks } from "@/hooks/useBooks";
import { queryKeys } from "@/constants/queryKeys";
import { BookGrid, BookGridSkeleton } from "@/components/books/BookGrid";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { EmptyState } from "@/components/common/EmptyState";
import { getInitials } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";

export default function AuthorDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const { data: author } = useQuery({
    queryKey: queryKeys.author(params.slug),
    queryFn: () => booksApi.author(params.slug),
  });
  const { data, isLoading } = useBooks({ author: params.slug });

  return (
    <div className="container-page py-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Authors", href: ROUTES.authors },
          { label: author?.name ?? params.slug },
        ]}
      />
      <div className="mb-8 flex items-center gap-4">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-primary text-lg font-semibold text-surface">
          {getInitials(author?.name ?? "A")}
        </span>
        <div>
          <h1 className="font-display text-3xl text-text-primary">
            {author?.name ?? "Author"}
          </h1>
          {author?.bio ? (
            <p className="mt-1 max-w-2xl text-sm text-text-secondary">
              {author.bio}
            </p>
          ) : null}
        </div>
      </div>

      {isLoading ? (
        <BookGridSkeleton />
      ) : data && data.results.length > 0 ? (
        <BookGrid books={data.results} />
      ) : (
        <EmptyState
          title="No books by this author yet"
          actionLabel="Browse all books"
          actionHref={ROUTES.books}
        />
      )}
    </div>
  );
}
