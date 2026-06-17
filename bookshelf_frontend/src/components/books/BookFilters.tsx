"use client";

import { useCategories } from "@/hooks/useBooks";

export interface BookFilterValues {
  category: string;
  min_price: string;
  max_price: string;
  language: string;
  format: string;
  in_stock: boolean;
  min_rating: string;
}

interface BookFiltersProps {
  values: BookFilterValues;
  onChange: (partial: Partial<BookFilterValues>) => void;
  onReset: () => void;
}

const LANGUAGES = ["English", "Urdu"];
const FORMATS = [
  { value: "paperback", label: "Paperback" },
  { value: "hardcover", label: "Hardcover" },
  { value: "ebook", label: "E-Book" },
];

export function BookFilters({ values, onChange, onReset }: BookFiltersProps) {
  const { data: categories } = useCategories();

  return (
    <aside className="card-bs flex flex-col gap-6 p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg text-primary">Filters</h3>
        <button
          type="button"
          onClick={onReset}
          className="text-xs text-secondary hover:underline"
        >
          Reset
        </button>
      </div>

      <FilterGroup title="Category">
        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="category"
              checked={values.category === ""}
              onChange={() => onChange({ category: "" })}
            />
            All categories
          </label>
          {categories?.map((cat) => (
            <label key={cat.id} className="flex items-center gap-2 text-sm">
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
      </FilterGroup>

      <FilterGroup title="Price range (PKR)">
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={values.min_price}
            onChange={(e) => onChange({ min_price: e.target.value })}
            className="input-bs py-1.5 text-sm"
          />
          <span className="text-text-muted">–</span>
          <input
            type="number"
            placeholder="Max"
            value={values.max_price}
            onChange={(e) => onChange({ max_price: e.target.value })}
            className="input-bs py-1.5 text-sm"
          />
        </div>
      </FilterGroup>

      <FilterGroup title="Language">
        <select
          value={values.language}
          onChange={(e) => onChange({ language: e.target.value })}
          className="input-bs py-2 text-sm"
        >
          <option value="">Any language</option>
          {LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </FilterGroup>

      <FilterGroup title="Format">
        <div className="flex flex-col gap-1.5">
          {FORMATS.map((fmt) => (
            <label key={fmt.value} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="format"
                checked={values.format === fmt.value}
                onChange={() => onChange({ format: fmt.value })}
              />
              {fmt.label}
            </label>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Rating">
        <select
          value={values.min_rating}
          onChange={(e) => onChange({ min_rating: e.target.value })}
          className="input-bs py-2 text-sm"
        >
          <option value="">Any rating</option>
          <option value="4">4 stars & up</option>
          <option value="3">3 stars & up</option>
          <option value="2">2 stars & up</option>
        </select>
      </FilterGroup>

      <label className="flex items-center gap-2 text-sm">
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

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-bsborder pt-4 first:border-t-0 first:pt-0">
      <p className="mb-2 text-sm font-medium text-text-primary">{title}</p>
      {children}
    </div>
  );
}
