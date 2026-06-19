"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { X, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { GENRES, COMIC_STATUS, COMIC_TYPE, SORT_OPTIONS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ALL = "all";

export function FilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const selectedGenres = React.useMemo(
    () => params.getAll("genre").flatMap((g) => g.split(",")).filter(Boolean),
    [params]
  );
  const status = params.get("status") ?? ALL;
  const type = params.get("type") ?? ALL;
  const sort = params.get("sort") ?? "latest";

  const updateParams = React.useCallback(
    (mutate: (p: URLSearchParams) => void) => {
      const p = new URLSearchParams(Array.from(params.entries()));
      p.delete("page");
      mutate(p);
      router.push(`${pathname}?${p.toString()}`);
    },
    [params, pathname, router]
  );

  const toggleGenre = (genre: string) => {
    updateParams((p) => {
      const current = p.getAll("genre").flatMap((g) => g.split(",")).filter(Boolean);
      p.delete("genre");
      const next = current.includes(genre)
        ? current.filter((g) => g !== genre)
        : [...current, genre];
      if (next.length) p.set("genre", next.join(","));
    });
  };

  const setSingle = (key: string, value: string) => {
    updateParams((p) => {
      if (value === ALL) p.delete(key);
      else p.set(key, value);
    });
  };

  const clearAll = () => router.push(pathname);

  const hasActiveFilters =
    selectedGenres.length > 0 || status !== ALL || type !== ALL || sort !== "latest";

  const [genreOpen, setGenreOpen] = React.useState(false);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* Genre multi-select */}
        <div className="relative">
          <Button
            variant="secondary"
            onClick={() => setGenreOpen((o) => !o)}
            className="gap-2"
            aria-expanded={genreOpen}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Genres
            {selectedGenres.length > 0 && (
              <span className="ml-1 rounded-full bg-brand-purple px-1.5 text-xs">
                {selectedGenres.length}
              </span>
            )}
          </Button>
          {genreOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setGenreOpen(false)}
                aria-hidden
              />
              <div className="absolute left-0 top-full z-20 mt-2 grid max-h-72 w-72 grid-cols-2 gap-1 overflow-y-auto rounded-lg border border-brand-surface bg-brand-card p-2 shadow-lg scrollbar-thin">
                {GENRES.map((g) => {
                  const active = selectedGenres.includes(g);
                  return (
                    <button
                      key={g}
                      onClick={() => toggleGenre(g)}
                      className={cn(
                        "rounded-md px-2 py-1.5 text-left text-xs transition-colors",
                        active
                          ? "bg-brand-purple text-white"
                          : "text-brand-text-secondary hover:bg-brand-card-hover hover:text-white"
                      )}
                    >
                      {g}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Status */}
        <Select value={status} onValueChange={(v) => setSingle("status", v)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All Status</SelectItem>
            {COMIC_STATUS.map((s) => (
              <SelectItem key={s} value={s}>
                {s.charAt(0) + s.slice(1).toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Type */}
        <Select value={type} onValueChange={(v) => setSingle("type", v)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All Types</SelectItem>
            {COMIC_TYPE.map((t) => (
              <SelectItem key={t} value={t}>
                {t.charAt(0) + t.slice(1).toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select value={sort} onValueChange={(v) => setSingle("sort", v)}>
          <SelectTrigger className="w-[150px]">
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

        {hasActiveFilters && (
          <Button variant="ghost" onClick={clearAll} className="text-brand-hot">
            Clear all
          </Button>
        )}
      </div>

      {/* Active filter chips */}
      {(selectedGenres.length > 0 || status !== ALL || type !== ALL) && (
        <div className="flex flex-wrap gap-2">
          {selectedGenres.map((g) => (
            <FilterChip key={g} label={g} onRemove={() => toggleGenre(g)} />
          ))}
          {status !== ALL && (
            <FilterChip
              label={status.charAt(0) + status.slice(1).toLowerCase()}
              onRemove={() => setSingle("status", ALL)}
            />
          )}
          {type !== ALL && (
            <FilterChip
              label={type.charAt(0) + type.slice(1).toLowerCase()}
              onRemove={() => setSingle("type", ALL)}
            />
          )}
        </div>
      )}
    </div>
  );
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-brand-purple/60 bg-brand-purple/10 py-1 pl-3 pr-1.5 text-xs font-medium text-brand-purple-light">
      {label}
      <button
        onClick={onRemove}
        aria-label={`Remove ${label} filter`}
        className="rounded-full p-0.5 transition-colors hover:bg-brand-purple hover:text-white"
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}
