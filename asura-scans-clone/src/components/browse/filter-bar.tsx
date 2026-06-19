"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { X, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SORT_OPTIONS } from "@/lib/types";
import { STATUS_LABELS, TYPE_LABELS } from "@/lib/utils";

interface Genre {
  id: string;
  name: string;
  slug: string;
}

export function FilterBar({ genres }: { genres: Genre[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedGenres = (searchParams.get("genres") ?? "").split(",").filter(Boolean);
  const status = searchParams.get("status") ?? "ALL";
  const type = searchParams.get("type") ?? "ALL";
  const sort = searchParams.get("sort") ?? "latest";

  const update = React.useCallback(
    (next: Record<string, string | string[] | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(next)) {
        if (value === undefined || value === "" || value === "ALL" || (Array.isArray(value) && value.length === 0)) {
          params.delete(key);
        } else {
          params.set(key, Array.isArray(value) ? value.join(",") : value);
        }
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  function toggleGenre(slug: string) {
    const next = selectedGenres.includes(slug)
      ? selectedGenres.filter((g) => g !== slug)
      : [...selectedGenres, slug];
    update({ genres: next });
  }

  const genreNameBySlug = React.useMemo(
    () => Object.fromEntries(genres.map((g) => [g.slug, g.name])),
    [genres],
  );

  const hasFilters =
    selectedGenres.length > 0 || status !== "ALL" || type !== "ALL" || sort !== "latest";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* Genre multi-select */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="sm">
              <SlidersHorizontal className="h-4 w-4" />
              Genres
              {selectedGenres.length > 0 && (
                <Badge className="ml-1 h-5 px-1.5">{selectedGenres.length}</Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="max-h-80 w-64 overflow-y-auto p-2">
            <div className="grid grid-cols-1 gap-0.5">
              {genres.map((g) => (
                <label
                  key={g.id}
                  className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm text-brand-text-secondary hover:bg-brand-card-hover hover:text-white"
                >
                  <Checkbox
                    checked={selectedGenres.includes(g.slug)}
                    onCheckedChange={() => toggleGenre(g.slug)}
                  />
                  {g.name}
                </label>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Status */}
        <Select value={status} onValueChange={(v) => update({ status: v })}>
          <SelectTrigger className="h-9 w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Type */}
        <Select value={type} onValueChange={(v) => update({ type: v })}>
          <SelectTrigger className="h-9 w-36">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Types</SelectItem>
            {Object.entries(TYPE_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select value={sort} onValueChange={(v) => update({ sort: v })}>
          <SelectTrigger className="h-9 w-36">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.replace(pathname, { scroll: false })}
          >
            Clear all
          </Button>
        )}
      </div>

      {/* Active filter chips */}
      {(selectedGenres.length > 0 || status !== "ALL" || type !== "ALL") && (
        <div className="flex flex-wrap gap-2">
          {selectedGenres.map((slug) => (
            <FilterChip key={slug} label={genreNameBySlug[slug] ?? slug} onRemove={() => toggleGenre(slug)} />
          ))}
          {status !== "ALL" && (
            <FilterChip label={STATUS_LABELS[status]} onRemove={() => update({ status: "ALL" })} />
          )}
          {type !== "ALL" && (
            <FilterChip label={TYPE_LABELS[type]} onRemove={() => update({ type: "ALL" })} />
          )}
        </div>
      )}
    </div>
  );
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-brand-purple/50 bg-brand-purple/10 px-3 py-1 text-xs font-medium text-brand-purple-light">
      {label}
      <button onClick={onRemove} aria-label={`Remove ${label} filter`} className="hover:text-white">
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}
