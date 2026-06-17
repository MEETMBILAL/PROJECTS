"use client";

import Link from "next/link";
import {
  BookOpen,
  Briefcase,
  Feather,
  GraduationCap,
  Sparkles,
  Baby,
  type LucideIcon,
} from "lucide-react";
import { useCategories } from "@/hooks/useBooks";
import { SectionHeader } from "@/components/common/SectionHeader";
import { ROUTES } from "@/constants/routes";

const ICONS: Record<string, LucideIcon> = {
  "book-open": BookOpen,
  briefcase: Briefcase,
  sparkles: Sparkles,
  feather: Feather,
  "graduation-cap": GraduationCap,
  baby: Baby,
};

export function CategoryGrid() {
  const { data: categories, isLoading } = useCategories();

  return (
    <section className="container-page py-14">
      <SectionHeader
        title="Browse by Category"
        subtitle="Find your next read across our curated collections"
        viewAllHref={ROUTES.categories}
      />
      <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:overflow-visible lg:grid-cols-6">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-32 w-40 shrink-0 animate-pulse rounded-xl bg-surface-alt md:w-auto"
              />
            ))
          : categories?.slice(0, 6).map((cat) => {
              const Icon = ICONS[cat.icon ?? "book-open"] ?? BookOpen;
              return (
                <Link
                  key={cat.id}
                  href={ROUTES.category(cat.slug)}
                  className="card group flex w-40 shrink-0 flex-col items-center gap-3 p-6 text-center hover:border-primary md:w-auto"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-accent text-primary transition-colors group-hover:bg-primary group-hover:text-surface">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="text-sm font-medium text-text-primary">
                    {cat.name}
                  </span>
                  <span className="text-xs text-text-muted">
                    {cat.book_count ?? 0} books
                  </span>
                </Link>
              );
            })}
      </div>
    </section>
  );
}
