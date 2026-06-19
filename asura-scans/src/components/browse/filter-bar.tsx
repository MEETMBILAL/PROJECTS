"use client";

import { useCallback, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronDown, X, SlidersHorizontal, Loader2 } from "lucide-react";
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
import { STATUS_OPTIONS, TYPE_OPTIONS, SORT_OPTIONS } from "@/lib/constants";
import type { GenreDTO } from "@/lib/types";

const ALL = "all";

export function FilterBar({ genres }: { genres: GenreDTO[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();

  const selectedGenres = (params.get("genres")?.split(",").filter(Boolean) ?? []) as string[];
  const status = params.get("status") ?? ALL;
  const type = params.get("type") ?? ALL;
  const sort = params.get("sort") ?? "latest";

  const update = useCallback(
    (mutate: (p: URLSearchParams) => void) => {
      const next = new URLSearchParams(params.toString());
      mutate(next);
      next.delete("page");
      startTransition(() => router.push(`${pathname}?${next.toString()}`, { scroll: false }));
    },
    [params, pathname, router],
  );

  const toggleGenre = (slug: string) =>
    update((p) => {
      const current = new Set(p.get("genres")?.split(",").filter(Boolean) ?? []);
      if (current.has(slug)) current.delete(slug);
      else current.add(slug);
      if (current.size) p.set("genres", [...current].join(","));
      else p.delete("genres");
    });

  const setParam = (key: string, value: string) =>
    update((p) => {
      if (value === ALL) p.delete(key);
      else p.set(key, value);
    });

  const clearAll = () =>
    startTransition(() => router.push(pathname, { scroll: false }));

  const hasActiveFilters = selectedGenres.length > 0 || status !== ALL || type !== ALL;
  const genreName = (slug: string) => genres.find((g) => g.slug === slug)?.name ?? slug;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-brand-surface bg-brand-card p-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <SlidersHorizontal className="h-4 w-4 text-brand-purple-light" />
          Filters
          {pending && <Loader2 className="h-3.5 w-3.5 animate-spin text-brand-text-muted" />}
        </div>

        {/* Genre multi-select */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="sm" className="gap-1.5">
              Genres
              {selectedGenres.length > 0 && (
                <Badge className="ml-1 px-1.5 py-0">{selectedGenres.length}</Badge>
              )}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="max-h-80 w-64 overflow-y-auto p-2">
            <div className="grid grid-cols-2 gap-1">
              {genres.map((g) => {
                const checked = selectedGenres.includes(g.slug);
                return (
                  <label
                    key={g.id}
                    className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-brand-text-secondary transition-colors hover:bg-brand-card-hover hover:text-white"
                  >
                    <Checkbox checked={checked} onCheckedChange={() => toggleGenre(g.slug)} />
                    <span className="truncate">{g.name}</span>
                  </label>
                );
              })}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Status */}
        <Select value={status} onValueChange={(v) => setParam("status", v)}>
          <SelectTrigger className="h-8 w-[130px] text-xs">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All Status</SelectItem>
            {STATUS_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Type */}
        <Select value={type} onValueChange={(v) => setParam("type", v)}>
          <SelectTrigger className="h-8 w-[120px] text-xs">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All Types</SelectItem>
            {TYPE_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select value={sort} onValueChange={(v) => setParam("sort", v)}>
          <SelectTrigger className="h-8 w-[130px] text-xs">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                Sort: {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearAll} className="ml-auto">
            Clear all
          </Button>
        )}
      </div>

      {/* Active filter chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {selectedGenres.map((slug) => (
            <FilterChip key={slug} label={genreName(slug)} onRemove={() => toggleGenre(slug)} />
          ))}
          {status !== ALL && (
            <FilterChip
              label={STATUS_OPTIONS.find((s) => s.value === status)?.label ?? status}
              onRemove={() => setParam("status", ALL)}
            />
          )}
          {type !== ALL && (
            <FilterChip
              label={TYPE_OPTIONS.find((t) => t.value === type)?.label ?? type}
              onRemove={() => setParam("type", ALL)}
            />
          )}
        </div>
      )}
    </div>
  );
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-brand-purple/50 bg-brand-purple/10 px-2 py-1 text-xs font-medium text-brand-purple-light">
      {label}
      <button
        onClick={onRemove}
        aria-label={`Remove ${label} filter`}
        className="rounded-sm transition-colors hover:text-white"
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}
