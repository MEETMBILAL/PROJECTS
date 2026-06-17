import Link from "next/link";
import type { Metadata } from "next";

import { Breadcrumb } from "@/components/common/Breadcrumb";
import { EmptyState } from "@/components/common/EmptyState";
import { ROUTES } from "@/constants/routes";
import { serverApi } from "@/lib/api/server";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse books by category at Bookshelf.pk.",
};

export default async function CategoriesPage() {
  const categories = (await serverApi.categories()) ?? [];

  return (
    <div className="container-bs py-8">
      <Breadcrumb items={[{ label: "Categories" }]} />
      <h1 className="mt-3 text-4xl text-primary">Browse Categories</h1>

      {categories.length === 0 ? (
        <EmptyState title="No categories yet" description="Check back soon." />
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={ROUTES.category(category.slug)}
              className="card-bs flex flex-col gap-2 p-6 transition hover:border-primary hover:shadow-card-hover"
            >
              <h3 className="font-display text-xl text-primary">{category.name}</h3>
              {category.description && (
                <p className="line-clamp-2 text-sm text-text-secondary">
                  {category.description}
                </p>
              )}
              <span className="mt-2 text-sm text-secondary">
                {category.book_count ?? 0} books
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
