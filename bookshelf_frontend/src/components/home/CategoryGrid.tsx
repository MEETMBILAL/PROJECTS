"use client";

import Link from "next/link";
import * as Icons from "lucide-react";
import { BookOpen } from "lucide-react";

import { SectionHeader } from "@/components/common/SectionHeader";
import { ROUTES } from "@/constants/routes";
import { useCategories } from "@/hooks/useBooks";

export function CategoryGrid() {
  const { data: categories } = useCategories();

  if (!categories || categories.length === 0) return null;

  return (
    <section className="container-bs py-14">
      <SectionHeader
        title="Browse by Category"
        subtitle="Find your next read across our curated collections"
        href={ROUTES.categories}
      />
      <div className="no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:px-0 lg:grid-cols-6">
        {categories.slice(0, 6).map((category) => {
          const Icon =
            (Icons as unknown as Record<string, React.ComponentType<{ size?: number }>>)[
              category.icon
            ] ?? BookOpen;
          return (
            <Link
              key={category.id}
              href={ROUTES.category(category.slug)}
              className="group flex w-36 shrink-0 flex-col items-center gap-3 rounded-xl border border-bsborder bg-white p-5 text-center shadow-card transition-all hover:-translate-y-1 hover:border-primary sm:w-auto"
            >
              <span className="grid h-12 w-12 place-items-center rounded-full bg-accent text-primary transition-colors group-hover:bg-primary group-hover:text-surface">
                <Icon size={22} />
              </span>
              <span className="text-sm font-medium text-text-primary">{category.name}</span>
              <span className="text-xs text-text-muted">{category.book_count} books</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
