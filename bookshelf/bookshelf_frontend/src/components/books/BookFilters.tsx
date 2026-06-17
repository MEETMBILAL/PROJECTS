"use client";

import { useCategories } from "@/hooks/useBooks";
import { BOOK_FORMATS, LANGUAGES } from "@/constants/config";

export interface FilterValues {
  category: string;
  min_price: string;
  max_price: string;
  language: string;
  format: string;
  in_stock: boolean;
}

interface BookFiltersProps {
  values: FilterValues;
  onChange: (patch: Partial<FilterValues>) => void;
  onReset: () => void;
}

export function BookFilters({ values, onChange, onReset }: BookFiltersProps) {
  const { data: categories } = useCategories();

  return (
    <aside className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg text-text-primary">Filters</h3>
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-medium text-primary hover:underline"
        >
          Reset
        </button>
      </div>

      <div>
        <h4 className="mb-2 text-sm font-medium text-text-primary">
          Category
        </h4>
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-sm text-text-secondary">
            <input
              type="radio"
              name="category"
              checked={values.category === ""}
              onChange={() => onChange({ category: "" })}
            />
            All
          </label>
          {categories?.map((cat) => (
            <label
              key={cat.id}
              className="flex items-center gap-2 text-sm text-text-secondary"
            >
              <input
                type="radio"
                name="category"
                checked={values.category === cat.slug}
                onChange={() => onChange({ category: cat.slug })}
              />
              {cat.name}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-2 text-sm font-medium text-text-primary">
          Price (PKR)
        </h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={values.min_price}
            onChange={(e) => onChange({ min_price: e.target.value })}
            className="input py-2"
          />
          <span className="text-text-muted">–</span>
          <input
            type="number"
            placeholder="Max"
            value={values.max_price}
            onChange={(e) => onChange({ max_price: e.target.value })}
            className="input py-2"
          />
        </div>
      </div>

      <div>
        <h4 className="mb-2 text-sm font-medium text-text-primary">Format</h4>
        <select
          value={values.format}
          onChange={(e) => onChange({ format: e.target.value })}
          className="input"
        >
          <option value="">Any format</option>
          {BOOK_FORMATS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h4 className="mb-2 text-sm font-medium text-text-primary">
          Language
        </h4>
        <select
          value={values.language}
          onChange={(e) => onChange({ language: e.target.value })}
          className="input"
        >
          <option value="">Any language</option>
          {LANGUAGES.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>

      <label className="flex items-center gap-2 text-sm text-text-secondary">
        <input
          type="checkbox"
          checked={values.in_stock}
          onChange={(e) => onChange({ in_stock: e.target.checked })}
        />
        In stock only
      </label>
    </aside>
  );
}
