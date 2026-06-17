"use client";

import { useCategories } from "@/hooks/useBooks";
import { BOOK_FORMATS } from "@/constants/config";
import { cn } from "@/lib/utils";

export interface BookFilterValues {
  category?: string;
  min_price?: string;
  max_price?: string;
  language?: string;
  format?: string;
  in_stock?: boolean;
}

interface BookFiltersProps {
  values: BookFilterValues;
  onChange: (next: BookFilterValues) => void;
  onReset: () => void;
}

const LANGUAGES = ["English", "Urdu"];

export function BookFilters({ values, onChange, onReset }: BookFiltersProps) {
  const { data: categories } = useCategories();

  const set = (patch: Partial<BookFilterValues>) =>
    onChange({ ...values, ...patch });

  return (
    <aside className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg text-ink">Filters</h3>
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-semibold text-primary hover:underline"
        >
          Clear all
        </button>
      </div>

      <FilterGroup label="Category">
        <div className="flex flex-col gap-1.5">
          {categories?.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() =>
                set({
                  category:
                    values.category === category.slug
                      ? undefined
                      : category.slug,
                })
              }
              className={cn(
                "flex items-center justify-between rounded-lg px-3 py-1.5 text-left text-sm transition",
                values.category === category.slug
                  ? "bg-accent font-semibold text-primary"
                  : "text-ink-secondary hover:bg-surface-alt",
              )}
            >
              <span>{category.name}</span>
              {typeof category.book_count === "number" && (
                <span className="text-xs text-ink-muted">
                  {category.book_count}
                </span>
              )}
            </button>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup label="Price range (PKR)">
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            placeholder="Min"
            value={values.min_price ?? ""}
            onChange={(event) =>
              set({ min_price: event.target.value || undefined })
            }
            className="input-bs"
          />
          <span className="text-ink-muted">–</span>
          <input
            type="number"
            min={0}
            placeholder="Max"
            value={values.max_price ?? ""}
            onChange={(event) =>
              set({ max_price: event.target.value || undefined })
            }
            className="input-bs"
          />
        </div>
      </FilterGroup>

      <FilterGroup label="Language">
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map((language) => (
            <button
              key={language}
              type="button"
              onClick={() =>
                set({
                  language:
                    values.language === language ? undefined : language,
                })
              }
              className={cn(
                "rounded-full border px-3 py-1 text-sm transition",
                values.language === language
                  ? "border-primary bg-primary text-white"
                  : "border-border text-ink-secondary hover:border-primary",
              )}
            >
              {language}
            </button>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup label="Format">
        <div className="flex flex-wrap gap-2">
          {BOOK_FORMATS.map((format) => (
            <button
              key={format.value}
              type="button"
              onClick={() =>
                set({
                  format:
                    values.format === format.value ? undefined : format.value,
                })
              }
              className={cn(
                "rounded-full border px-3 py-1 text-sm transition",
                values.format === format.value
                  ? "border-primary bg-primary text-white"
                  : "border-border text-ink-secondary hover:border-primary",
              )}
            >
              {format.label}
            </button>
          ))}
        </div>
      </FilterGroup>

      <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-secondary">
        <input
          type="checkbox"
          checked={Boolean(values.in_stock)}
          onChange={(event) =>
            set({ in_stock: event.target.checked || undefined })
          }
          className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
        />
        In stock only
      </label>
    </aside>
  );
}

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 border-b border-border pb-5 last:border-0">
      <span className="text-sm font-semibold text-ink">{label}</span>
      {children}
    </div>
  );
}
