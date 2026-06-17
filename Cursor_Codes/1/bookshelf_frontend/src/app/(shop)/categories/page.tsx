"use client";

import Link from "next/link";
import { useCategories } from "@/hooks/useBooks";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ROUTES } from "@/constants/routes";

export default function CategoriesPage() {
  const { data: categories, isLoading } = useCategories();

  return (
    <div className="container-page py-8">
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Categories" }]}
      />
      <h1 className="mb-6 font-display text-3xl text-text-primary">
        Categories
      </h1>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories?.map((cat) => (
            <Link
              key={cat.id}
              href={ROUTES.category(cat.slug)}
              className="card group p-6 hover:border-primary"
            >
              <h2 className="font-display text-xl text-text-primary group-hover:text-primary">
                {cat.name}
              </h2>
              <p className="mt-1 text-sm text-text-secondary">
                {cat.book_count ?? 0} books
              </p>
              {cat.description ? (
                <p className="mt-2 line-clamp-2 text-sm text-text-muted">
                  {cat.description}
                </p>
              ) : null}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
