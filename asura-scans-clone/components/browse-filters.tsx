"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { genres } from "@/lib/mock-data";

const statusOptions = ["ONGOING", "COMPLETED", "HIATUS"];
const typeOptions = ["MANGA", "MANHWA", "MANHUA"];
const sortOptions = [
  { value: "latest", label: "Latest" },
  { value: "az", label: "A-Z" },
  { value: "rating", label: "Rating" },
  { value: "views", label: "Views" }
];

export function BrowseFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams.toString());
    if (!value) {
      next.delete(key);
    } else if (key === "genre") {
      const current = new Set(next.getAll("genre"));
      current.has(value) ? current.delete(value) : current.add(value);
      next.delete("genre");
      current.forEach((item) => next.append("genre", item));
    } else {
      next.set(key, value);
    }
    next.delete("page");
    router.push(`/browse?${next.toString()}`);
  }

  function removeParam(key: string, value?: string) {
    const next = new URLSearchParams(searchParams.toString());
    if (value && key === "genre") {
      const remaining = next.getAll("genre").filter((item) => item !== value);
      next.delete("genre");
      remaining.forEach((item) => next.append("genre", item));
    } else {
      next.delete(key);
    }
    router.push(`/browse?${next.toString()}`);
  }

  const selectedGenres = searchParams.getAll("genre");
  const chips = [
    ...selectedGenres.map((slug) => ({ key: "genre", value: slug, label: genres.find((genre) => genre.slug === slug)?.name ?? slug })),
    ...(["status", "type", "sort"] as const)
      .map((key) => ({ key, value: searchParams.get(key), label: searchParams.get(key) }))
      .filter((chip): chip is { key: "status" | "type" | "sort"; value: string; label: string } => Boolean(chip.value))
  ];

  return (
    <div className="space-y-4 rounded-xl border border-brand-surface bg-brand-card p-4">
      <div className="grid gap-3 md:grid-cols-4">
        <Select value={searchParams.get("status") ?? ""} onChange={(event) => setParam("status", event.target.value)} aria-label="Status filter">
          <option value="">All statuses</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </Select>
        <Select value={searchParams.get("type") ?? ""} onChange={(event) => setParam("type", event.target.value)} aria-label="Type filter">
          <option value="">All types</option>
          {typeOptions.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </Select>
        <Select value={searchParams.get("sort") ?? "latest"} onChange={(event) => setParam("sort", event.target.value)} aria-label="Sort comics">
          {sortOptions.map((sort) => (
            <option key={sort.value} value={sort.value}>
              {sort.label}
            </option>
          ))}
        </Select>
        <Select value="" onChange={(event) => setParam("genre", event.target.value)} aria-label="Genre filter">
          <option value="">Add genre</option>
          {genres.map((genre) => (
            <option key={genre.slug} value={genre.slug}>
              {selectedGenres.includes(genre.slug) ? "✓ " : ""}
              {genre.name}
            </option>
          ))}
        </Select>
      </div>

      {chips.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {chips.map((chip) => (
            <button
              key={`${chip.key}-${chip.value}`}
              type="button"
              onClick={() => removeParam(chip.key, chip.value)}
              className="inline-flex items-center gap-1 rounded-full border border-brand-primary/50 bg-brand-primary/10 px-3 py-1 text-xs font-semibold text-brand-accent"
            >
              {chip.label}
              <X className="h-3 w-3" aria-hidden />
            </button>
          ))}
          <Button variant="ghost" size="sm" onClick={() => router.push("/browse")}>
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
