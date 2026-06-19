"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SORT_OPTIONS, STATUS_OPTIONS, TYPE_OPTIONS } from "@/lib/constants";
import type { Genre } from "@/lib/types";
import { cn } from "@/lib/utils";

interface FilterBarProps {
  genres: Genre[];
}

export function FilterBar({ genres }: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedGenres = (searchParams.get("genres") ?? "")
    .split(",")
    .filter(Boolean);
  const status = searchParams.get("status") ?? "ALL";
  const type = searchParams.get("type") ?? "ALL";
  const sort = searchParams.get("sort") ?? "latest";

  const update = React.useCallback(
    (next: Record<string, string | string[] | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(next)) {
        if (value === null || value === "" || (Array.isArray(value) && value.length === 0)) {
          params.delete(key);
        } else {
          params.set(key, Array.isArray(value) ? value.join(",") : value);
        }
      }
      params.delete("page");
      router.push(`/browse?${params.toString()}`);
    },
    [router, searchParams]
  );

  const toggleGenre = (slug: string) => {
    const next = selectedGenres.includes(slug)
      ? selectedGenres.filter((g) => g !== slug)
      : [...selectedGenres, slug];
    update({ genres: next });
  };

  const clearAll = () => router.push("/browse");

  const genreNames = new Map(genres.map((g) => [g.slug, g.name]));
  const hasActiveFilters =
    selectedGenres.length > 0 || status !== "ALL" || type !== "ALL";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-brand-border bg-brand-card p-3">
        {/* Genres multi-select */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="sm">
              Genres
              {selectedGenres.length > 0 && (
                <span className="ml-1 rounded-full bg-brand-purple px-1.5 text-[10px] font-bold text-white">
                  {selectedGenres.length}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="max-h-72 w-56 overflow-y-auto">
            <div className="grid grid-cols-1 gap-0.5 p-1">
              {genres.map((g) => (
                <label
                  key={g.id}
                  className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-brand-card-hover"
                >
                  <Checkbox
                    checked={selectedGenres.includes(g.slug)}
                    onCheckedChange={() => toggleGenre(g.slug)}
                  />
                  <span>{g.name}</span>
                </label>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Status */}
        <Select value={status} onValueChange={(v) => update({ status: v })}>
          <SelectTrigger className="h-8 w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Type */}
        <Select value={type} onValueChange={(v) => update({ type: v })}>
          <SelectTrigger className="h-8 w-[130px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TYPE_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort */}
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-brand-text-muted">Sort by</span>
          <Select value={sort} onValueChange={(v) => update({ sort: v })}>
            <SelectTrigger className="h-8 w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active filter chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          {selectedGenres.map((slug) => (
            <FilterChip
              key={slug}
              label={genreNames.get(slug) ?? slug}
              onRemove={() => toggleGenre(slug)}
            />
          ))}
          {status !== "ALL" && (
            <FilterChip
              label={STATUS_OPTIONS.find((s) => s.value === status)?.label ?? status}
              onRemove={() => update({ status: null })}
            />
          )}
          {type !== "ALL" && (
            <FilterChip
              label={TYPE_OPTIONS.find((t) => t.value === type)?.label ?? type}
              onRemove={() => update({ type: null })}
            />
          )}
          <button
            onClick={clearAll}
            className="text-xs font-medium text-brand-purple-light hover:underline"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}

function FilterChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <Badge
      variant="outline"
      className={cn("gap-1 py-1 pl-3 pr-1.5")}
    >
      {label}
      <button
        onClick={onRemove}
        aria-label={`Remove ${label} filter`}
        className="rounded-full p-0.5 hover:bg-brand-purple/20"
      >
        <X className="h-3 w-3" />
      </button>
    </Badge>
  );
}
