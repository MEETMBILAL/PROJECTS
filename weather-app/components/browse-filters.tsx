"use client";

import { X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ComicStatus, ComicType } from "@/lib/mock-data";

const statuses: (ComicStatus | "ALL")[] = ["ALL", "ONGOING", "COMPLETED", "HIATUS"];
const types: (ComicType | "ALL")[] = ["ALL", "MANGA", "MANHWA", "MANHUA"];
const sorts = [
  { value: "latest", label: "Latest" },
  { value: "az", label: "A-Z" },
  { value: "rating", label: "Rating" },
  { value: "views", label: "Views" },
];

export function BrowseFilters({ genres }: { genres: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedGenre = searchParams.get("genre") ?? "";
  const selectedStatus = searchParams.get("status") ?? "ALL";
  const selectedType = searchParams.get("type") ?? "ALL";
  const selectedSort = searchParams.get("sort") ?? "latest";

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === "ALL") params.delete(key);
    else params.set(key, value);
    params.delete("page");
    router.push(`/browse?${params.toString()}`);
  };

  const clearParam = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    router.push(`/browse?${params.toString()}`);
  };

  const activeChips = [
    selectedGenre ? { key: "genre", label: selectedGenre } : null,
    selectedStatus !== "ALL" ? { key: "status", label: selectedStatus } : null,
    selectedType !== "ALL" ? { key: "type", label: selectedType } : null,
    selectedSort !== "latest" ? { key: "sort", label: sorts.find((sort) => sort.value === selectedSort)?.label ?? selectedSort } : null,
  ].filter(Boolean) as { key: string; label: string }[];

  return (
    <div className="rounded-xl border border-brand-surface bg-brand-card p-4">
      <div className="grid gap-3 md:grid-cols-4">
        <label className="space-y-2 text-sm font-semibold text-brand-textSecondary">
          Genre
          <select value={selectedGenre} onChange={(event) => setParam("genre", event.target.value)} className="h-10 w-full rounded-md border border-brand-surface bg-brand-background px-3 text-white">
            <option value="">All genres</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 text-sm font-semibold text-brand-textSecondary">
          Status
          <select value={selectedStatus} onChange={(event) => setParam("status", event.target.value)} className="h-10 w-full rounded-md border border-brand-surface bg-brand-background px-3 text-white">
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 text-sm font-semibold text-brand-textSecondary">
          Type
          <select value={selectedType} onChange={(event) => setParam("type", event.target.value)} className="h-10 w-full rounded-md border border-brand-surface bg-brand-background px-3 text-white">
            {types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 text-sm font-semibold text-brand-textSecondary">
          Sort by
          <select value={selectedSort} onChange={(event) => setParam("sort", event.target.value)} className="h-10 w-full rounded-md border border-brand-surface bg-brand-background px-3 text-white">
            {sorts.map((sort) => (
              <option key={sort.value} value={sort.value}>
                {sort.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {activeChips.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {activeChips.map((chip) => (
            <Badge key={chip.key} variant="outline" className="gap-1">
              {chip.label}
              <Button variant="ghost" size="icon" className="h-4 w-4" onClick={() => clearParam(chip.key)} aria-label={`Remove ${chip.label}`}>
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
