"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { X } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { ComicGrid } from "@/components/comic-grid";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ComicCardData } from "@/types";

interface Genre {
  id: string;
  name: string;
  slug: string;
}

function BrowseContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [comics, setComics] = useState<ComicCardData[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const selectedGenres = searchParams.get("genres")?.split(",").filter(Boolean) ?? [];
  const status = searchParams.get("status") ?? "";
  const type = searchParams.get("type") ?? "";
  const sort = searchParams.get("sort") ?? "latest";

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([k, v]) => {
        if (v) params.set(k, v);
        else params.delete(k);
      });
      router.push(`/browse?${params.toString()}`);
    },
    [searchParams, router]
  );

  const fetchComics = useCallback(
    async (pageNum: number, reset = false) => {
      setLoading(true);
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: "24",
        sort,
      });
      if (selectedGenres.length) params.set("genres", selectedGenres.join(","));
      if (status) params.set("status", status);
      if (type) params.set("type", type);

      const res = await fetch(`/api/comics?${params}`);
      const data = await res.json();
      setComics((prev) => (reset ? data.comics : [...prev, ...data.comics]));
      setHasMore(data.hasMore);
      setLoading(false);
    },
    [selectedGenres, status, type, sort]
  );

  useEffect(() => {
    fetch("/api/genres")
      .then((r) => r.json())
      .then((d) => setGenres(d.genres ?? []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setPage(1);
    fetchComics(1, true);
  }, [fetchComics]);

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchComics(next);
  };

  const toggleGenre = (slug: string) => {
    const next = selectedGenres.includes(slug)
      ? selectedGenres.filter((g) => g !== slug)
      : [...selectedGenres, slug];
    updateParams({ genres: next.join(",") });
  };

  const activeFilters = [
    ...selectedGenres.map((g) => ({
      key: "genre",
      value: g,
      label: genres.find((gr) => gr.slug === g)?.name ?? g,
    })),
    ...(status ? [{ key: "status", value: status, label: status }] : []),
    ...(type ? [{ key: "type", value: type, label: type }] : []),
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <SectionHeading>Browse Comics</SectionHeading>

      <div className="bg-brand-card rounded-cover border border-brand-surface p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-brand-text-secondary mb-2">Genre</p>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {genres.map((g) => (
                <label
                  key={g.id}
                  className="flex items-center gap-1.5 text-xs cursor-pointer"
                >
                  <Checkbox
                    checked={selectedGenres.includes(g.slug)}
                    onCheckedChange={() => toggleGenre(g.slug)}
                  />
                  {g.name}
                </label>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-brand-text-secondary mb-2">Status</p>
            <Select value={status} onValueChange={(v) => updateParams({ status: v === "all" ? "" : v })}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ONGOING">Ongoing</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="HIATUS">Hiatus</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <p className="text-xs text-brand-text-secondary mb-2">Type</p>
            <Select value={type} onValueChange={(v) => updateParams({ type: v === "all" ? "" : v })}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="MANGA">Manga</SelectItem>
                <SelectItem value="MANHWA">Manhwa</SelectItem>
                <SelectItem value="MANHUA">Manhua</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <p className="text-xs text-brand-text-secondary mb-2">Sort By</p>
            <Select value={sort} onValueChange={(v) => updateParams({ sort: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest</SelectItem>
                <SelectItem value="az">A-Z</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="views">Views</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {activeFilters.map((f) => (
            <button
              key={`${f.key}-${f.value}`}
              onClick={() => {
                if (f.key === "genre") {
                  toggleGenre(f.value);
                } else {
                  updateParams({ [f.key]: "" });
                }
              }}
              className="inline-flex items-center gap-1 bg-brand-purple/20 text-brand-purple-light text-xs px-2 py-1 rounded-full"
            >
              {f.label}
              <X className="h-3 w-3" />
            </button>
          ))}
        </div>
      )}

      <ComicGrid
        comics={comics}
        hasMore={hasMore}
        loading={loading}
        onLoadMore={loadMore}
      />

      {hasMore && !loading && (
        <div className="text-center mt-8">
          <Button variant="outline" onClick={loadMore}>
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}

export default function BrowsePage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading...</div>}>
      <BrowseContent />
    </Suspense>
  );
}
