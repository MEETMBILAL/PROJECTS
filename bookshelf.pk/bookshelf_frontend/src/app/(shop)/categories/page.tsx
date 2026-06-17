"use client";

import Link from "next/link";

import { Breadcrumb } from "@/components/common/Breadcrumb";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { SectionHeader } from "@/components/common/SectionHeader";
import { ROUTES } from "@/constants/routes";
import { useCategories } from "@/hooks/useBooks";

export default function CategoriesPage() {
  const { data: categories, isLoading } = useCategories();

  return (
    <div className="container-bs py-8">
      <Breadcrumb
        items={[{ label: "Home", href: ROUTES.home }, { label: "Categories" }]}
        className="mb-6"
      />
      <SectionHeader title="All Categories" subtitle="Explore our collections" />
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories?.map((category) => (
            <Link
              key={category.id}
              href={ROUTES.category(category.slug)}
              className="card flex flex-col gap-2 p-6 transition hover:border-primary hover:shadow-card"
            >
              <h3 className="font-display text-xl text-ink">{category.name}</h3>
              {category.description && (
                <p className="text-sm text-ink-secondary">
                  {category.description}
                </p>
              )}
              {typeof category.book_count === "number" && (
                <span className="text-sm text-primary">
                  {category.book_count} books →
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
