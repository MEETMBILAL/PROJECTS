"use client";

import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { ComicGrid } from "@/components/comics/ComicGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ComicListItem } from "@/types";
import type { ComicStatus, ComicType } from "@prisma/client";

interface Genre {
  id: string;
  name: string;
  slug: string;
}

interface BrowseContentProps {
  genres: Genre[];
  searchParams: {
    genres?: string;
    status?: string;
    type?: string;
    sort?: string;
    page?: string;
  };
  initialComics: ComicListItem[];
  initialHasMore: boolean;
}

const STATUS_OPTIONS: { value: ComicStatus; label: string }[] = [
  { value: "ONGOING", label: "Ongoing" },
  { value: "COMPLETED", label: "Completed" },
  { value: "HIATUS", label: "Hiatus" },
];

const TYPE_OPTIONS: { value: ComicType; label: string }[] = [
  { value: "MANGA", label: "Manga" },
  { value: "MANHWA", label: "Manhwa" },
  { value: "MANHUA", label: "Manhua" },
];

const SORT_OPTIONS = [
  { value: "latest", label: "Latest" },
  { value: "az", label: "A-Z" },
  { value: "rating", label: "Rating" },
  { value: "views", label: "Views" },
];

export function BrowseContent({
  genres,
  searchParams,
  initialComics,
  initialHasMore,
}: BrowseContentProps) {
  const router = useRouter();
  const params = useSearchParams();

  const selectedGenres = useMemo(
    () => (searchParams.genres ?? params.get("genres") ?? "").split(",").filter(Boolean),
    [searchParams.genres, params]
  );
  const selectedStatus = useMemo(
    () => (searchParams.status ?? params.get("status") ?? "").split(",").filter(Boolean) as ComicStatus[],
    [searchParams.status, params]
  );
  const selectedType = useMemo(
    () => (searchParams.type ?? params.get("type") ?? "").split(",").filter(Boolean) as ComicType[],
    [searchParams.type, params]
  );
  const sort = searchParams.sort ?? params.get("sort") ?? "latest";

  const updateParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const newParams = new URLSearchParams(params.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) newParams.set(key, value);
        else newParams.delete(key);
      });
      newParams.delete("page");
      router.push(`/browse?${newParams.toString()}`);
    },
    [params, router]
  );

  const toggleGenre = (slug: string) => {
    const next = selectedGenres.includes(slug)
      ? selectedGenres.filter((g) => g !== slug)
      : [...selectedGenres, slug];
    updateParams({ genres: next.join(",") || undefined });
  };

  const toggleStatus = (status: ComicStatus) => {
    const next = selectedStatus.includes(status)
      ? selectedStatus.filter((s) => s !== status)
      : [...selectedStatus, status];
    updateParams({ status: next.join(",") || undefined });
  };

  const toggleType = (type: ComicType) => {
    const next = selectedType.includes(type)
      ? selectedType.filter((t) => t !== type)
      : [...selectedType, type];
    updateParams({ type: next.join(",") || undefined });
  };

  const activeChips = [
    ...selectedGenres.map((slug) => ({
      key: `genre-${slug}`,
      label: genres.find((g) => g.slug === slug)?.name ?? slug,
      remove: () => toggleGenre(slug),
    })),
    ...selectedStatus.map((s) => ({
      key: `status-${s}`,
      label: STATUS_OPTIONS.find((o) => o.value === s)?.label ?? s,
      remove: () => toggleStatus(s),
    })),
    ...selectedType.map((t) => ({
      key: `type-${t}`,
      label: TYPE_OPTIONS.find((o) => o.value === t)?.label ?? t,
      remove: () => toggleType(t),
    })),
  ];

  const fetchUrl = useMemo(() => {
    const q = new URLSearchParams();
    if (selectedGenres.length) q.set("genres", selectedGenres.join(","));
    if (selectedStatus.length) q.set("status", selectedStatus.join(","));
    if (selectedType.length) q.set("type", selectedType.join(","));
    if (sort) q.set("sort", sort);
    return `/api/comics?${q.toString()}`;
  }, [selectedGenres, selectedStatus, selectedType, sort]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      <SectionHeading title="Browse Comics" />

      <div className="mb-6 rounded-modal border border-brand-surface bg-brand-card p-4">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="mb-3 text-sm font-medium text-brand-text-primary">Genre</p>
            <div className="flex max-h-40 flex-wrap gap-2 overflow-y-auto scrollbar-thin">
              {genres.map((genre) => (
                <label
                  key={genre.id}
                  className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 text-sm text-brand-text-secondary hover:bg-brand-card-hover"
                >
                  <Checkbox
                    checked={selectedGenres.includes(genre.slug)}
                    onCheckedChange={() => toggleGenre(genre.slug)}
                  />
                  {genre.name}
                </label>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-medium text-brand-text-primary">Status</p>
            <div className="space-y-2">
              {STATUS_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className="flex cursor-pointer items-center gap-2 text-sm text-brand-text-secondary"
                >
                  <Checkbox
                    checked={selectedStatus.includes(opt.value)}
                    onCheckedChange={() => toggleStatus(opt.value)}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-medium text-brand-text-primary">Type</p>
            <div className="space-y-2">
              {TYPE_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className="flex cursor-pointer items-center gap-2 text-sm text-brand-text-secondary"
                >
                  <Checkbox
                    checked={selectedType.includes(opt.value)}
                    onCheckedChange={() => toggleType(opt.value)}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-medium text-brand-text-primary">Sort by</p>
            <Select value={sort} onValueChange={(v) => updateParams({ sort: v })}>
              <SelectTrigger className="border-brand-surface bg-brand-dark">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-brand-card border-brand-surface">
                {SORT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {activeChips.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {activeChips.map((chip) => (
            <button
              key={chip.key}
              onClick={chip.remove}
              className="inline-flex items-center gap-1 rounded-full border border-brand-purple/50 bg-brand-purple/10 px-3 py-1 text-xs text-brand-purple-light transition-colors hover:bg-brand-purple/20"
            >
              {chip.label}
              <X className="h-3 w-3" />
            </button>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/browse")}
            className="text-brand-muted hover:text-brand-text-primary"
          >
            Clear all
          </Button>
        </div>
      )}

      <ComicGrid
        initialComics={initialComics}
        initialHasMore={initialHasMore}
        fetchUrl={fetchUrl}
      />
    </div>
  );
}
