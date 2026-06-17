"use client";

import Link from "next/link";
import {
  Baby,
  BookOpen,
  Briefcase,
  Feather,
  GraduationCap,
  type LucideIcon,
  Sparkles,
} from "lucide-react";

import { SectionHeader } from "@/components/common/SectionHeader";
import { ROUTES } from "@/constants/routes";
import { useCategories } from "@/hooks/useBooks";

const iconMap: Record<string, LucideIcon> = {
  "book-open": BookOpen,
  briefcase: Briefcase,
  sparkles: Sparkles,
  feather: Feather,
  "graduation-cap": GraduationCap,
  baby: Baby,
};

export function CategoryGrid() {
  const { data: categories } = useCategories();

  if (!categories || categories.length === 0) return null;

  return (
    <section className="container-bs py-16">
      <SectionHeader
        title="Browse by Category"
        subtitle="Find your next read across our curated collections"
        viewAllHref={ROUTES.categories}
      />
      <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible lg:grid-cols-6">
        {categories.slice(0, 6).map((category) => {
          const Icon = iconMap[category.icon ?? ""] ?? BookOpen;
          return (
            <Link
              key={category.id}
              href={ROUTES.category(category.slug)}
              className="card flex min-w-[140px] flex-col items-center gap-3 p-6 text-center transition hover:border-primary hover:shadow-card"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent text-primary">
                <Icon className="h-6 w-6" />
              </span>
              <span className="font-medium text-ink">{category.name}</span>
              {typeof category.book_count === "number" && (
                <span className="text-xs text-ink-muted">
                  {category.book_count} books
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
