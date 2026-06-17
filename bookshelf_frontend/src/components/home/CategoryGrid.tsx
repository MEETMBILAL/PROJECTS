"use client";

import Link from "next/link";
import {
  Baby,
  BookOpen,
  Briefcase,
  Feather,
  GraduationCap,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import { SectionHeader } from "@/components/common/SectionHeader";
import { ROUTES } from "@/constants/routes";
import { useCategories } from "@/hooks/useBooks";

const ICONS: Record<string, LucideIcon> = {
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
    <section className="container-bs py-14">
      <SectionHeader
        title="Browse by Category"
        subtitle="Find your next read across our curated collections"
        viewAllHref={ROUTES.categories}
      />
      <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar sm:grid sm:grid-cols-3 sm:overflow-visible lg:grid-cols-6">
        {categories.slice(0, 6).map((category) => {
          const Icon = ICONS[category.icon ?? ""] ?? BookOpen;
          return (
            <Link
              key={category.id}
              href={ROUTES.category(category.slug)}
              className="card-bs flex min-w-36 flex-col items-center gap-3 p-6 text-center transition hover:border-primary hover:shadow-card-hover sm:min-w-0"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-primary">
                <Icon size={24} />
              </span>
              <span className="text-sm font-medium text-text-primary">{category.name}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
