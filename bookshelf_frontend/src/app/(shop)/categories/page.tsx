"use client";

import Link from "next/link";
import * as Icons from "lucide-react";
import { BookOpen } from "lucide-react";

import { Breadcrumb } from "@/components/common/Breadcrumb";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ROUTES } from "@/constants/routes";
import { useCategories } from "@/hooks/useBooks";

export default function CategoriesPage() {
  const { data: categories, isLoading } = useCategories();

  return (
    <div className="container-bs py-8">
      <Breadcrumb items={[{ label: "Categories" }]} />
      <h1 className="mt-4 font-display text-3xl font-bold text-text-primary">
        Browse Categories
      </h1>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories?.map((category) => {
            const Icon =
              (Icons as unknown as Record<string, React.ComponentType<{ size?: number }>>)[
                category.icon
              ] ?? BookOpen;
            return (
              <Link
                key={category.id}
                href={ROUTES.category(category.slug)}
                className="group flex items-center gap-4 rounded-xl border border-bsborder bg-white p-6 shadow-card transition-all hover:-translate-y-1 hover:border-primary"
              >
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-accent text-primary transition-colors group-hover:bg-primary group-hover:text-surface">
                  <Icon size={26} />
                </span>
                <div>
                  <h2 className="font-display text-lg font-semibold text-text-primary">
                    {category.name}
                  </h2>
                  <p className="text-sm text-text-muted">{category.book_count} books</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
