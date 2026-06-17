"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { BOOK_FORMATS, LANGUAGES } from "@/constants/config";
import { useCategories } from "@/hooks/useBooks";
import { cn } from "@/lib/utils";

export function BookFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: categories } = useCategories();

  const setParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  const activeCategory = searchParams.get("category") ?? "";
  const activeFormat = searchParams.get("format") ?? "";
  const activeLanguage = searchParams.get("language") ?? "";
  const inStock = searchParams.get("in_stock") === "true";

  return (
    <aside className="space-y-7">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold">Filters</h3>
        <button
          type="button"
          className="text-xs text-primary hover:underline"
          onClick={() => router.push(pathname)}
        >
          Clear all
        </button>
      </div>

      <FilterGroup title="Category">
        <FilterOption
          label="All Categories"
          active={!activeCategory}
          onClick={() => setParam("category", null)}
        />
        {categories?.map((category) => (
          <FilterOption
            key={category.id}
            label={`${category.name} (${category.book_count})`}
            active={activeCategory === category.slug}
            onClick={() => setParam("category", category.slug)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Price (PKR)">
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            defaultValue={searchParams.get("min_price") ?? ""}
            className="input py-1.5 text-sm"
            onBlur={(e) => setParam("min_price", e.target.value)}
          />
          <span className="text-text-muted">–</span>
          <input
            type="number"
            placeholder="Max"
            defaultValue={searchParams.get("max_price") ?? ""}
            className="input py-1.5 text-sm"
            onBlur={(e) => setParam("max_price", e.target.value)}
          />
        </div>
      </FilterGroup>

      <FilterGroup title="Format">
        <FilterOption
          label="All Formats"
          active={!activeFormat}
          onClick={() => setParam("format", null)}
        />
        {BOOK_FORMATS.map((format) => (
          <FilterOption
            key={format.value}
            label={format.label}
            active={activeFormat === format.value}
            onClick={() => setParam("format", format.value)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Language">
        <FilterOption
          label="All Languages"
          active={!activeLanguage}
          onClick={() => setParam("language", null)}
        />
        {LANGUAGES.map((language) => (
          <FilterOption
            key={language}
            label={language}
            active={activeLanguage === language}
            onClick={() => setParam("language", language)}
          />
        ))}
      </FilterGroup>

      <label className="flex cursor-pointer items-center gap-2.5 text-sm text-text-primary">
        <input
          type="checkbox"
          checked={inStock}
          onChange={(e) => setParam("in_stock", e.target.checked ? "true" : null)}
          className="h-4 w-4 rounded border-bsborder accent-primary"
        />
        In stock only
      </label>
    </aside>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-2.5 text-sm font-semibold text-text-primary">{title}</h4>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function FilterOption({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "block w-full rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors",
        active
          ? "bg-accent font-medium text-primary"
          : "text-text-secondary hover:bg-surface-alt",
      )}
    >
      {label}
    </button>
  );
}
